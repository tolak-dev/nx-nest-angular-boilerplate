-- Create a user (if not using POSTGRES_USER env)
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';

-- Create a database (if not using POSTGRES_DB env)
CREATE DATABASE myappdb OWNER myuser;

-- (Optional) Create tables or seed data
-- CREATE TABLE users (...);
-- INSERT INTO users (...) VALUES (...);
