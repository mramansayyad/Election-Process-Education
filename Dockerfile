# Stage 1: Build the React/Vite application
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Accept build-time secrets from Cloud Build
ARG VITE_GOOGLE_CIVIC_API_KEY
ARG VITE_GEMINI_API_KEY
ARG VITE_GOOGLE_CLIENT_ID

# Write them to a .env file so Vite's env loading picks them up reliably
RUN echo "VITE_GOOGLE_CIVIC_API_KEY=${VITE_GOOGLE_CIVIC_API_KEY}" > .env && \
    echo "VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}" >> .env && \
    echo "VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}" >> .env

# Build the production bundle (Vite reads .env automatically)
RUN npm run build

# Stage 2: Serve the built assets with Nginx on port 8080 (Cloud Run requirement)
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configure Nginx: listen on 8080, handle SPA client-side routing
RUN printf 'server {\n\
    listen 8080;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    # Cache static assets aggressively\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
