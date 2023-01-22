#Build the react app
FROM node:alpine3.17 as projecttool
WORKDIR /tool
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

#Building NGINX and Running from NGINX
FROM nginx:1.10-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=projecttool /tool/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]