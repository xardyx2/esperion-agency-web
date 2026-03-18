#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

MODE=""
FORCE_RESET=0
DATA_VOLUME="${DATA_VOLUME:-}"
DB_CONTAINER="${DB_CONTAINER:-esperion-surrealdb}"
DB_NS="${DB_NS:-esperion}"
DB_DB="${DB_DB:-esperion_db}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-root}"
DB_PORT="${DB_PORT:-8002}"
TEMP_V2_PORT="${TEMP_V2_PORT:-18002}"
TEMP_V3_PORT="${TEMP_V3_PORT:-18003}"
RECOVERY_2X_IMAGE="${RECOVERY_2X_IMAGE:-surrealdb/surrealdb:v2.6.3}"
RECOVERY_3X_IMAGE="${RECOVERY_3X_IMAGE:-surrealdb/surrealdb:v3.0.4}"
BACKUP_ROOT="${BACKUP_ROOT:-${REPO_ROOT}/backups/local-surrealdb-recovery}"
BACKEND_WAIT_ATTEMPTS="${BACKEND_WAIT_ATTEMPTS:-300}"
BACKEND_WAIT_INTERVAL="${BACKEND_WAIT_INTERVAL:-2}"

SESSION_STAMP=""
SESSION_DIR=""
WORK_VOLUME=""
TEMP_V2_CONTAINER="esperion-surrealdb-recovery-v2"
TEMP_V3_CONTAINER="esperion-surrealdb-recovery-v3"

log() {
  printf '[recover-local-surrealdb] %s\n' "$*"
}

die() {
  printf '[recover-local-surrealdb] ERROR: %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage:
  bash scripts/recover-local-surrealdb.sh migrate [options]
  bash scripts/recover-local-surrealdb.sh reset --yes [options]
  bash scripts/recover-local-surrealdb.sh verify [options]

Options:
  --yes                 Skip the destructive reset confirmation prompt.
  --volume NAME         Override the Docker volume name to recover.
  --db-container NAME   Override the database container name (default: esperion-surrealdb).
  --ns NAME             Override the SurrealDB namespace (default: esperion).
  --db NAME             Override the SurrealDB database (default: esperion_db).
  --user NAME           Override the SurrealDB root user (default: root).
  --pass VALUE          Override the SurrealDB root password (default: root).
  --backup-root PATH    Override the host backup root.

Environment overrides:
  DATA_VOLUME, DB_CONTAINER, DB_NS, DB_DB, DB_USER, DB_PASS,
  RECOVERY_2X_IMAGE, RECOVERY_3X_IMAGE, BACKUP_ROOT,
  TEMP_V2_PORT, TEMP_V3_PORT, DB_PORT.

Examples:
  bash scripts/recover-local-surrealdb.sh migrate
  bash scripts/recover-local-surrealdb.sh reset --yes
  bash scripts/recover-local-surrealdb.sh verify
EOF
}

cleanup_temp_containers() {
  docker rm -f "${TEMP_V2_CONTAINER}" >/dev/null 2>&1 || true
  docker rm -f "${TEMP_V3_CONTAINER}" >/dev/null 2>&1 || true
}

trap cleanup_temp_containers EXIT

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}

compose() {
  docker compose "$@"
}

resolve_data_volume() {
  if [ -n "${DATA_VOLUME}" ]; then
    return
  fi

  if docker inspect "${DB_CONTAINER}" >/dev/null 2>&1; then
    DATA_VOLUME="$(docker inspect -f '{{ range .Mounts }}{{ if eq .Destination "/data" }}{{ .Name }}{{ end }}{{ end }}' "${DB_CONTAINER}")"
  fi

  if [ -z "${DATA_VOLUME}" ]; then
    DATA_VOLUME="$(docker volume ls --format '{{.Name}}' | grep -E '(^|_)surreal-data$' | grep -v 'staging' | head -n 1 || true)"
  fi

  [ -n "${DATA_VOLUME}" ] || die "Could not resolve the local Docker volume for /data. Use --volume to specify it explicitly."
}

ensure_volume_exists() {
  docker volume inspect "$1" >/dev/null 2>&1 || die "Docker volume not found: $1"
}

wait_for_http() {
  local url="$1"
  local label="$2"
  local attempts="${3:-40}"
  local sleep_seconds="${4:-3}"
  local i

  for i in $(seq 1 "${attempts}"); do
    if curl -fsS "${url}" >/dev/null 2>&1; then
      return 0
    fi
    sleep "${sleep_seconds}"
  done

  die "Timed out waiting for ${label} at ${url}"
}

create_session_dir() {
  SESSION_STAMP="$(date +%Y%m%d-%H%M%S)"
  SESSION_DIR="${BACKUP_ROOT}/${SESSION_STAMP}"
  mkdir -p "${SESSION_DIR}/source-volume" "${SESSION_DIR}/exports"
}

docker_host_path() {
  local input_path="$1"

  if command -v cygpath >/dev/null 2>&1; then
    cygpath -w "${input_path}"
  else
    printf '%s' "${input_path}"
  fi
}

copy_volume_to_dir() {
  local volume_name="$1"
  local target_dir="$2"
  local temp_name="recover-local-surrealdb-copy-${SESSION_STAMP}"

  mkdir -p "${target_dir}"
  docker create --name "${temp_name}" -v "${volume_name}:/source" alpine:3.20 sleep 300 >/dev/null
  docker cp "${temp_name}:/source/." "${target_dir}/"
  docker rm -f "${temp_name}" >/dev/null 2>&1 || true
}

copy_dir_to_volume() {
  local source_dir="$1"
  local volume_name="$2"
  local temp_name="recover-local-surrealdb-restore-${SESSION_STAMP}"

  docker volume create "${volume_name}" >/dev/null
  docker create --name "${temp_name}" -v "${volume_name}:/target" alpine:3.20 sleep 300 >/dev/null
  docker cp "${source_dir}/." "${temp_name}:/target/"
  docker rm -f "${temp_name}" >/dev/null 2>&1 || true
}

run_fix_on_work_volume() {
  local volume_name="$1"

  log "Running 1.x -> 2.x repair with ${RECOVERY_2X_IMAGE}"
  docker run --rm --user 0:0 -v "${volume_name}:/data" "${RECOVERY_2X_IMAGE}" fix "rocksdb:/data/esperion.db"
}

start_temp_v2_server() {
  local volume_name="$1"

  cleanup_temp_containers
  log "Starting temporary 2.x database on port ${TEMP_V2_PORT}"
  docker run -d --rm --user 0:0 --name "${TEMP_V2_CONTAINER}" -p "${TEMP_V2_PORT}:8000" -v "${volume_name}:/data" \
    "${RECOVERY_2X_IMAGE}" start --log warn --user "${DB_USER}" --pass "${DB_PASS}" --bind 0.0.0.0:8000 \
    "rocksdb:/data/esperion.db" >/dev/null
  wait_for_http "http://localhost:${TEMP_V2_PORT}/version" "temporary 2.x database"
}

export_v3_compatible() {
  local export_file="${SESSION_DIR}/exports/local-v3-export.surql"
  local workspace_mount

  workspace_mount="$(docker_host_path "${SESSION_DIR}")"

  log "Exporting repaired 2.x data in v3-compatible format"
  MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' docker run --rm --add-host host.docker.internal:host-gateway -v "${workspace_mount}:/workspace" \
    "${RECOVERY_2X_IMAGE}" export --v3 --endpoint "http://host.docker.internal:${TEMP_V2_PORT}" \
    --username "${DB_USER}" --password "${DB_PASS}" --namespace "${DB_NS}" --database "${DB_DB}" \
    "/workspace/exports/local-v3-export.surql"

  [ -f "${export_file}" ] || die "Expected export file was not created: ${export_file}"
}

recreate_active_volume() {
  local logical_name="surreal-data"
  local project_name=""

  if [[ "${DATA_VOLUME}" == *_${logical_name} ]]; then
    project_name="${DATA_VOLUME%_${logical_name}}"
  fi

  log "Recreating target volume ${DATA_VOLUME} for clean v3 import"
  docker volume rm "${DATA_VOLUME}" >/dev/null 2>&1 || true

  if [ -n "${project_name}" ] && [ "${project_name}" != "${DATA_VOLUME}" ]; then
    docker volume create \
      --label "com.docker.compose.project=${project_name}" \
      --label "com.docker.compose.volume=${logical_name}" \
      "${DATA_VOLUME}" >/dev/null
  else
    docker volume create "${DATA_VOLUME}" >/dev/null
  fi
}

start_temp_v3_server() {
  cleanup_temp_containers
  log "Starting temporary v3 database on port ${TEMP_V3_PORT}"
  docker run -d --rm --user 0:0 --name "${TEMP_V3_CONTAINER}" -p "${TEMP_V3_PORT}:8000" -v "${DATA_VOLUME}:/data" \
    "${RECOVERY_3X_IMAGE}" start --log warn --user "${DB_USER}" --pass "${DB_PASS}" --bind 0.0.0.0:8000 \
    "rocksdb:/data/esperion.db" >/dev/null
  wait_for_http "http://localhost:${TEMP_V3_PORT}/version" "temporary v3 database"
}

import_v3_export() {
  local workspace_mount

  workspace_mount="$(docker_host_path "${SESSION_DIR}")"

  log "Importing v3-compatible export into clean ${RECOVERY_3X_IMAGE} target"
  MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' docker run --rm --add-host host.docker.internal:host-gateway -v "${workspace_mount}:/workspace" \
    "${RECOVERY_3X_IMAGE}" import --endpoint "http://host.docker.internal:${TEMP_V3_PORT}" \
    --username "${DB_USER}" --password "${DB_PASS}" --namespace "${DB_NS}" --database "${DB_DB}" \
    "/workspace/exports/local-v3-export.surql"
}

verify_stack() {
  log "Checking compose service state"
  compose ps

  log "Checking database version endpoint"
  curl -fsS "http://localhost:${DB_PORT}/version"
  printf '\n'

  log "Checking backend health endpoint"
  wait_for_http "http://localhost:8081/health" "backend health endpoint" "${BACKEND_WAIT_ATTEMPTS}" "${BACKEND_WAIT_INTERVAL}"
  curl -fsS "http://localhost:8081/health"
  printf '\n'

  log "Checking frontend HTTP response"
  curl -I -fsS "http://localhost:3000"
  printf '\n'

  log "Recent service logs"
  compose logs --tail=20 database backend frontend
}

migrate_flow() {
  resolve_data_volume
  ensure_volume_exists "${DATA_VOLUME}"
  create_session_dir

  log "Using Docker data volume: ${DATA_VOLUME}"
  log "Backup session directory: ${SESSION_DIR}"
  log "Namespace/Database: ${DB_NS}/${DB_DB}"
  log "Pinned helper images: ${RECOVERY_2X_IMAGE} and ${RECOVERY_3X_IMAGE}"

  compose down >/dev/null 2>&1 || true

  log "Snapshotting the current local data volume"
  copy_volume_to_dir "${DATA_VOLUME}" "${SESSION_DIR}/source-volume"

  WORK_VOLUME="${DATA_VOLUME}-recovery-${SESSION_STAMP}"
  log "Preparing working copy volume: ${WORK_VOLUME}"
  copy_dir_to_volume "${SESSION_DIR}/source-volume" "${WORK_VOLUME}"

  run_fix_on_work_volume "${WORK_VOLUME}"
  start_temp_v2_server "${WORK_VOLUME}"
  export_v3_compatible
  docker rm -f "${TEMP_V2_CONTAINER}" >/dev/null 2>&1 || true

  recreate_active_volume
  start_temp_v3_server
  import_v3_export
  docker rm -f "${TEMP_V3_CONTAINER}" >/dev/null 2>&1 || true

  log "Bringing the root Docker Compose stack back up"
  compose up -d >/dev/null

  verify_stack

  log "Preserve-data recovery completed"
  log "Backup kept at: ${SESSION_DIR}"
  log "Working volume kept for inspection: ${WORK_VOLUME}"
}

confirm_reset() {
  local answer
  printf 'This will delete local Docker volume %s and recreate it for v3. Continue? [y/N] ' "${DATA_VOLUME}" >&2
  read -r answer
  case "${answer}" in
    y|Y|yes|YES) ;;
    *) die "Reset cancelled" ;;
  esac
}

reset_flow() {
  resolve_data_volume
  ensure_volume_exists "${DATA_VOLUME}"

  if [ "${FORCE_RESET}" -ne 1 ]; then
    confirm_reset
  fi

  log "Stopping the root Docker Compose stack"
  compose down >/dev/null 2>&1 || true

  log "Recreating ${DATA_VOLUME}"
  docker volume rm "${DATA_VOLUME}" >/dev/null 2>&1 || true
  docker volume create "${DATA_VOLUME}" >/dev/null

  log "Starting the root Docker Compose stack on a clean v3 volume"
  compose up -d >/dev/null

  verify_stack

  log "Reset recovery completed"
}

parse_args() {
  [ "$#" -gt 0 ] || {
    usage
    exit 1
  }

  MODE="$1"
  shift

  while [ "$#" -gt 0 ]; do
    case "$1" in
      --yes|-y)
        FORCE_RESET=1
        ;;
      --volume)
        shift
        DATA_VOLUME="$1"
        ;;
      --db-container)
        shift
        DB_CONTAINER="$1"
        ;;
      --ns)
        shift
        DB_NS="$1"
        ;;
      --db)
        shift
        DB_DB="$1"
        ;;
      --user)
        shift
        DB_USER="$1"
        ;;
      --pass)
        shift
        DB_PASS="$1"
        ;;
      --backup-root)
        shift
        BACKUP_ROOT="$1"
        ;;
      --help|-h)
        usage
        exit 0
        ;;
      *)
        die "Unknown argument: $1"
        ;;
    esac
    shift
  done
}

main() {
  require_command docker
  require_command curl

  parse_args "$@"
  cd "${REPO_ROOT}"

  case "${MODE}" in
    migrate)
      migrate_flow
      ;;
    reset)
      reset_flow
      ;;
    verify)
      verify_stack
      ;;
    *)
      usage
      die "Unknown mode: ${MODE}"
      ;;
  esac
}

main "$@"
