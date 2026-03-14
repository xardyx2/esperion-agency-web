REMOVE INDEX idx_site_settings_key ON TABLE site_settings;

REMOVE INDEX idx_alert_deliveries_status ON TABLE alert_deliveries;
REMOVE INDEX idx_alert_deliveries_instance ON TABLE alert_deliveries;
REMOVE TABLE alert_deliveries;

REMOVE INDEX idx_alert_instances_service ON TABLE alert_instances;
REMOVE INDEX idx_alert_instances_state ON TABLE alert_instances;
REMOVE INDEX idx_alert_instances_key ON TABLE alert_instances;
REMOVE TABLE alert_instances;

REMOVE INDEX idx_alert_rules_signal ON TABLE alert_rules;
REMOVE INDEX idx_alert_rules_service ON TABLE alert_rules;
REMOVE TABLE alert_rules;
