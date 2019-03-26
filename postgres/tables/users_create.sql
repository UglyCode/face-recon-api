BEGIN TRANSACTION;

CREATE TABLE users(
    id serial PRIMARY KEY,
    name VARCHAR(128),
    email text UNIQUE NOT NULL,
    entries INTEGER DEFAULT 0,
    joined TIMESTAMP NOT NULL
);

COMMIT;