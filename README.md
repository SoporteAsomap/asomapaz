# ASOMAP — Asociacion de Ahorros y Prestamos Moca

Plataforma web completa para ASOMAP. Incluye sitio publico, panel de administracion y API REST. Completamente containerizado con Docker.

## Stack tecnologico

| Capa | Tecnologia |
|---|---|
| Backend | Python 3.11, Django 4, Django REST Framework, Gunicorn |
| Frontend | React 18, TypeScript, Vite |
| Base de datos | PostgreSQL 15 |
| Servidor web | Nginx |
| Contenedores | Docker, Docker Compose |
| Admin | Django Jazzmin |

## Estructura del repositorio

```
asomap/
├── asomap-backend-jazzmin/   # Backend Django
├── asomap-ui-main/           # Frontend React
├── asomap/nginx/             # Configuracion de Nginx
│   ├── Dockerfile            # Nginx para desarrollo
│   ├── Dockerfile.prod       # Nginx para produccion
│   ├── default.conf          # Config desarrollo
│   └── default-prod.conf     # Config produccion
├── docker-compose.yml        # Orquestacion de servicios
├── .env.example              # Plantilla de variables de entorno
└── GUIA_PRODUCCION.html      # Guia completa de despliegue paso a paso
```

---

## Despliegue en produccion

> Para instrucciones completas, abrir `GUIA_PRODUCCION.html` en el navegador.

### Requisitos del servidor
- Ubuntu 20.04 LTS o superior
- Docker 24+ y Docker Compose 2+
- Git

### Pasos rapidos

**1. Instalar Docker**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release git

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER && newgrp docker
```

**2. Clonar el repositorio**
```bash
cd /opt
sudo mkdir asomap && sudo chown $USER:$USER asomap && cd asomap
git clone https://github.com/TU_USUARIO/asomap.git .
```

**3. Configurar el .env**
```bash
cp .env.example .env
nano .env
```

Variables obligatorias:

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `DB_PASS` | Contrasena de PostgreSQL | `MiPassword123!` |
| `SECRET_KEY` | Clave secreta de Django | (ver comando abajo) |
| `SERVER_IP` | IP o dominio del servidor | `192.168.1.50` o `asomap.com` |
| `VITE_API_URL` | URL de la API desde el navegador | `http://192.168.1.50:8080` |

Generar SECRET_KEY segura:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

**4. Levantar en produccion**
```bash
docker compose --profile prod up -d
```

Docker hace todo automaticamente:
- Compila el frontend React (sin necesitar Node en el servidor)
- Aplica migraciones de la base de datos
- Crea datos iniciales del sistema
- Inicia Gunicorn con 3 workers
- Sirve todo a traves de Nginx en el puerto 8080

**5. Verificar**
```bash
docker compose ps
curl http://SERVER_IP:8080/health/
```

Estado esperado:
```
asomap_postgres         Up (healthy)
asomap_backend          Up (healthy)
asomap_frontend_build   Exited (0)    <- normal, solo compila y termina
asomap_nginx_prod       Up
```

**6. Cambiar la contrasena del admin**

El sistema crea el usuario `admin` / `admin123` al primer inicio. Cambiala inmediatamente:
```bash
docker compose exec backend python manage.py changepassword admin
```

---

## Accesos

| URL | Descripcion |
|---|---|
| `http://SERVER_IP:8080/` | Sitio publico |
| `http://SERVER_IP:8080/admin/` | Panel de administracion |
| `http://SERVER_IP:8080/api/` | API REST |
| `http://SERVER_IP:8080/health/` | Health check |

---

## Agregar dominio con HTTPS

Si ASOMAP tiene un dominio (ej: `asomap.com`):

1. Apuntar el dominio al servidor en el panel DNS del proveedor (registro tipo A)
2. Actualizar el `.env`:
```bash
SERVER_IP=asomap.com
SERVER_PROTOCOL=https
ALLOWED_HOSTS=127.0.0.1,localhost,asomap.com,www.asomap.com
CORS_ALLOWED_ORIGINS=https://asomap.com,https://www.asomap.com
CSRF_TRUSTED_ORIGINS=https://asomap.com,https://www.asomap.com
VITE_API_URL=https://asomap.com
```
3. Reconstruir el frontend:
```bash
docker compose build frontend-build
docker compose --profile prod up -d --force-recreate frontend-build nginx-prod
```
4. Instalar SSL gratuito con Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
docker compose stop nginx-prod
sudo certbot --nginx -d asomap.com -d www.asomap.com
docker compose --profile prod up -d nginx-prod
```

> Ver seccion 10 de `GUIA_PRODUCCION.html` para el proceso completo.

---

## Desarrollo local

### Requisitos
- Docker y Docker Compose
- Node.js 18 + Yarn (para el frontend en hot-reload)

### Levantar en modo desarrollo
```bash
cp .env.example .env
# En .env cambiar: VITE_API_URL=http://localhost:8000

docker compose --profile dev up -d
```

| Servicio | URL |
|---|---|
| Frontend (hot reload) | http://localhost:3000 |
| Backend directo | http://localhost:8000 |
| Swagger / API docs | http://localhost:8000/api/docs/ |
| Admin | http://localhost:8000/admin/ |

---

## Comandos de mantenimiento

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio especifico
docker compose logs -f backend

# Reiniciar un servicio
docker compose restart backend

# Ejecutar migraciones manualmente
docker compose exec backend python manage.py migrate

# Crear superusuario adicional
docker compose exec backend python manage.py createsuperuser

# Backup de la base de datos
docker compose exec db pg_dump -U asomap_user asomap > backup_$(date +%Y%m%d).sql

# Actualizar la aplicacion tras git pull
git pull origin main
docker compose --profile prod build
docker compose --profile prod up -d --force-recreate

# Limpiar recursos Docker no utilizados
docker system prune -f
```

---

## Servicios y puertos

| Servicio | Puerto | Descripcion |
|---|---|---|
| nginx-prod | 8080 | Punto de entrada en produccion |
| backend | 8000 | Django / Gunicorn |
| db | 5433 | PostgreSQL |
| frontend-dev | 3000 | React dev server (solo perfil dev) |

---

## Documentacion adicional

| Archivo | Contenido |
|---|---|
| `GUIA_PRODUCCION.html` | Guia completa paso a paso |
| `.env.example` | Plantilla de variables con ejemplos |
| `asomap-backend-jazzmin/DEPLOYMENT.md` | Despliegue alternativo en Railway |
| `asomap-backend-jazzmin/EMAIL_PROVIDERS_CONFIG.md` | Configuracion de email |

---

**Desarrollado por Coneys Technologies para ASOMAP**
**ASOMAP — Mas de 50 anos sirviendo a la comunidad de Moca**
