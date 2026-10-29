#Build the react app
FROM node:18-alpine as projecttool
WORKDIR /tool
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

#Building NGINX and Running from NGINX
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=projecttool /tool/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
