FROM nginx:latest

RUN apt-get -y install openssl
RUN openssl req -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=KR/ST=Seoul/L=Seoul/O=42Seoul/OU=Gon/CN=api.leafinc.com" -keyout api.leafinc.com.key -out api.leafinc.com.crt && \
    openssl req -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=KR/ST=Seoul/L=Seoul/O=42Seoul/OU=Gon/CN=leafinc.com" -keyout leafinc.com.key -out leafinc.com.crt

RUN mv api.leafinc.com.crt /etc/ssl/certs && \
    mv api.leafinc.com.key /etc/ssl/private && \
    mv leafinc.com.crt /etc/ssl/certs && \
    mv leafinc.com.key /etc/ssl/private

COPY ./conf.d/* /etc/nginx/conf.d
