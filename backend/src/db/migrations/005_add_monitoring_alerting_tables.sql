DEFINE INDEX idx_site_settings_key ON site_settings FIELDS key UNIQUE;

DEFINE TABLE alert_rules SCHEMAFULL;
DEFINE FIELD name ON alert_rules TYPE string;
DEFINE FIELD signal_type ON alert_rules TYPE string;
DEFINE FIELD service ON alert_rules TYPE string;
DEFINE FIELD operator ON alert_rules TYPE string;
DEFINE FIELD threshold_value ON alert_rules TYPE float;
DEFINE FIELD severity ON alert_rules TYPE string;
DEFINE FIELD cooldown_minutes ON alert_rules TYPE int DEFAULT 5;
DEFINE FIELD enabled ON alert_rules TYPE bool DEFAULT true;
DEFINE FIELD created_at ON alert_rules TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON alert_rules TYPE datetime DEFAULT time::now();

DEFINE INDEX idx_alert_rules_service ON alert_rules FIELDS service;
DEFINE INDEX idx_alert_rules_signal ON alert_rules FIELDS signal_type;

DEFINE TABLE alert_instances SCHEMAFULL;
DEFINE FIELD alert_key ON alert_instances TYPE string;
DEFINE FIELD rule_id ON alert_instances TYPE option<record<alert_rules>>;
DEFINE FIELD service ON alert_instances TYPE string;
DEFINE FIELD signal_type ON alert_instances TYPE string;
DEFINE FIELD observed_value ON alert_instances TYPE float;
DEFINE FIELD threshold_value ON alert_instances TYPE float;
DEFINE FIELD severity ON alert_instances TYPE string;
DEFINE FIELD state ON alert_instances TYPE string DEFAULT 'pending';
DEFINE FIELD message ON alert_instances TYPE string;
DEFINE FIELD fired_at ON alert_instances TYPE datetime DEFAULT time::now();
DEFINE FIELD resolved_at ON alert_instances TYPE option<datetime>;
DEFINE FIELD metadata ON alert_instances TYPE option<object>;

DEFINE INDEX idx_alert_instances_key ON alert_instances FIELDS alert_key UNIQUE;
DEFINE INDEX idx_alert_instances_state ON alert_instances FIELDS state;
DEFINE INDEX idx_alert_instances_service ON alert_instances FIELDS service;

DEFINE TABLE alert_deliveries SCHEMAFULL;
DEFINE FIELD instance_id ON alert_deliveries TYPE record<alert_instances>;
DEFINE FIELD channel ON alert_deliveries TYPE string;
DEFINE FIELD destination ON alert_deliveries TYPE string;
DEFINE FIELD attempt_count ON alert_deliveries TYPE int DEFAULT 0;
DEFINE FIELD delivery_status ON alert_deliveries TYPE string DEFAULT 'pending';
DEFINE FIELD last_error ON alert_deliveries TYPE option<string>;
DEFINE FIELD next_retry_at ON alert_deliveries TYPE option<datetime>;
DEFINE FIELD created_at ON alert_deliveries TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON alert_deliveries TYPE datetime DEFAULT time::now();

DEFINE INDEX idx_alert_deliveries_instance ON alert_deliveries FIELDS instance_id;
DEFINE INDEX idx_alert_deliveries_status ON alert_deliveries FIELDS delivery_status;
