DEFINE TABLE backup_jobs SCHEMAFULL;
DEFINE FIELD status ON backup_jobs TYPE string;
DEFINE FIELD scopes ON backup_jobs TYPE array;
DEFINE FIELD reason ON backup_jobs TYPE option<string>;
DEFINE FIELD location ON backup_jobs TYPE option<string>;
DEFINE FIELD error ON backup_jobs TYPE option<string>;
DEFINE FIELD created_at ON backup_jobs TYPE datetime DEFAULT time::now();
DEFINE FIELD completed_at ON backup_jobs TYPE option<datetime>;

DEFINE INDEX idx_backup_jobs_created_at ON backup_jobs FIELDS created_at;
