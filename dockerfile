FROM nginx:stable-alpine

LABEL version="1.4"

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

COPY dist/statmis-app/ .