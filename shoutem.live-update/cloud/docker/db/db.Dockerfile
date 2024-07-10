FROM postgres:12.14-alpine3.17
COPY init.sql /docker-entrypoint-initdb.d/
