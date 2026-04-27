# Usar Python 3.11 como base
FROM python:3.11-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements.txt
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY . .

# Crear directorios necesarios
RUN mkdir -p media staticfiles

# Hacer el script ejecutable y normalizar finales de linea de Windows
COPY start.sh .
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh

# Configurar variables de entorno
ENV PYTHONPATH=/app
ENV DJANGO_SETTINGS_MODULE=config.settings
ENV DEBUG=False
ENV ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar Django con migraciones automáticas
CMD ["./start.sh"]
