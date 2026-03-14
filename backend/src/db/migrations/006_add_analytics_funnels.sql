DEFINE TABLE analytics_funnels SCHEMAFULL;
DEFINE FIELD name ON analytics_funnels TYPE string;
DEFINE FIELD description ON analytics_funnels TYPE option<string>;
DEFINE FIELD steps ON analytics_funnels TYPE array;
DEFINE FIELD active ON analytics_funnels TYPE bool DEFAULT true;
DEFINE FIELD created_at ON analytics_funnels TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON analytics_funnels TYPE datetime DEFAULT time::now();

DEFINE INDEX idx_analytics_funnels_active ON analytics_funnels FIELDS active;
