FROM mysql:8.0
# Copy the initialization script to the special folder MySQL uses to setup databases
COPY init-db.sql /docker-entrypoint-initdb.d/
