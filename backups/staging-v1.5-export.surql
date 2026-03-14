-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- TABLE: articles
-- ------------------------------

DEFINE TABLE articles TYPE ANY SCHEMAFULL PERMISSIONS NONE;

DEFINE FIELD content ON articles TYPE string PERMISSIONS FULL;
DEFINE FIELD published ON articles TYPE bool DEFAULT false PERMISSIONS FULL;
DEFINE FIELD title ON articles TYPE string PERMISSIONS FULL;

-- ------------------------------
-- TABLE: users
-- ------------------------------

DEFINE TABLE users TYPE ANY SCHEMAFULL PERMISSIONS NONE;

DEFINE FIELD email ON users TYPE string PERMISSIONS FULL;
DEFINE FIELD password ON users TYPE string PERMISSIONS FULL;
DEFINE FIELD role ON users TYPE string DEFAULT 'user' PERMISSIONS FULL;

-- ------------------------------
-- TRANSACTION
-- ------------------------------

BEGIN TRANSACTION;

-- ------------------------------
-- TABLE DATA: articles
-- ------------------------------

UPDATE articles:1 CONTENT { content: 'Content 1', id: articles:1, published: true, title: 'Test Article 1' };
UPDATE articles:2 CONTENT { content: 'Content 2', id: articles:2, published: false, title: 'Test Article 2' };

-- ------------------------------
-- TABLE DATA: users
-- ------------------------------

UPDATE users:1 CONTENT { email: 'admin@esperion.com', id: users:1, password: 'hashed123', role: 'admin' };
UPDATE users:2 CONTENT { email: 'user@esperion.com', id: users:2, password: 'hashed456', role: 'user' };

-- ------------------------------
-- TRANSACTION
-- ------------------------------

COMMIT TRANSACTION;

