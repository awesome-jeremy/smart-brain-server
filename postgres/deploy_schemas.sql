-- Deploy fresh database tables
-- order matters if tables depend on each other
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'