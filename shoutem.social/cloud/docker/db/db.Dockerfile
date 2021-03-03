FROM postgres:11.2-alpine
COPY init.sql /docker-entrypoint-initdb.d/
