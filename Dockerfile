# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# These will be passed as build args during Cloud Build
ARG VITE_GOOGLE_CIVIC_API_KEY
ARG VITE_GEMINI_API_KEY

ENV VITE_GOOGLE_CIVIC_API_KEY=$VITE_GOOGLE_CIVIC_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

RUN npm run build

# Stage 2: Serve with Nginx on port 8080 (Cloud Run requirement)
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configure Nginx to listen on 8080 and handle client-side routing
RUN printf 'server {\n\
    listen 8080;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
