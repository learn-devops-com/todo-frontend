FROM nginx:1.17.5-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

COPY build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
