FROM node:alpine AS builder

WORKDIR /app

COPY frontend .

RUN npm install && \
    npm run build-prod

FROM nginx:alpine

COPY --from=builder /app/dist/thread-net/* /usr/share/nginx/html/
COPY --from=builder /app/dist/thread-net/assets/ /usr/share/nginx/html/assets/
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf