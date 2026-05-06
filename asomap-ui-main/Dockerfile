# Usar Node.js 18 como base (ya incluye yarn)
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y yarn.lock
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código del frontend
COPY . .

# Variables de entorno para el build (se pasan como build args desde docker-compose)
ARG VITE_API_URL
ARG VITE_ENV=production
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENV=$VITE_ENV
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

# Construir la aplicación
RUN yarn build

# Instalar serve para servir archivos estáticos
RUN yarn global add serve

# Exponer puerto
EXPOSE 3000

# Comando para servir la aplicación construida
CMD ["serve", "-s", "build", "-l", "3000"]
