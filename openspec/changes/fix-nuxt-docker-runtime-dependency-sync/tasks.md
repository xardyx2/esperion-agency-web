## 1. Frontend Docker runtime sync

- [x] 1.1 Finalize the frontend dev startup flow in `frontend/Dockerfile.dev`, `frontend/docker-entrypoint.sh`, and `docker-compose.yml` so the runtime container synchronizes Bun dependencies before `nuxt dev` starts.
- [x] 1.2 Decide whether `/app/node_modules` stays anonymous or becomes a named volume in `docker-compose.yml`, and document the supported recovery/reset workflow for stale frontend dependency volumes.

## 2. Dependency warning handling

- [x] 2.1 In `frontend/package.json`, `frontend/nuxt.config.ts`, and validation-related frontend code, choose the supported VeeValidate + Zod strategy and remove or explicitly justify the current startup warning about `@vee-validate/zod`.
- [x] 2.2 Evaluate the Vite dependency discovery warning for Scalar in `frontend/nuxt.config.ts` and either add the needed `optimizeDeps.include` entries or document why the warning is accepted in local development.

## 3. Localization warning cleanup

- [x] 3.1 Add the missing `footer.cookieSettings` key to the authoritative runtime locale files in `frontend/i18n/locales/id.json` and `frontend/i18n/locales/en.json`.
- [x] 3.2 Audit the duplicate locale trees in `frontend/i18n/locales/` and `frontend/app/locales/`, then document or simplify the source-of-truth rule so new keys are not added to the wrong directory again.

## 4. Verification and documentation

- [x] 4.1 Update `frontend/README.md` and any Docker setup docs with the expected frontend container startup behavior, dependency sync step, and stale-volume recovery commands.
- [x] 4.2 Verify the fix by starting the frontend container, confirming the Nuxt dev server boots without the missing-module error, and checking that the known `footer.cookieSettings` warning is gone from `docker-compose logs frontend`.
