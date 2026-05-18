# Despliegue en Azure

## Arquitectura

| Componente | Servicio Azure |
|---|---|
| Backend (Django) | Azure Container Apps |
| Base de datos | Azure Database for PostgreSQL Flexible Server |
| Archivos media | Azure Blob Storage |
| Frontend (React) | Azure Static Web Apps |
| Imágenes Docker | Azure Container Registry (ACR) |
| CI/CD | GitHub Actions |

---

## Requisitos Previos

- Cuenta de Azure activa
- Azure CLI instalado (`az login` para autenticarse)
- Docker instalado
- Repositorio en GitHub

---

## 1. Infraestructura en Azure

### Resource Group y Container Registry

```bash
az group create --name asomap-rg --location brazilsouth

az acr create \
  --resource-group asomap-rg \
  --name asomapregistry \
  --sku Basic \
  --admin-enabled true
```

### PostgreSQL

```bash
az postgres flexible-server create \
  --resource-group asomap-rg \
  --name asomap-postgres \
  --location brazilsouth \
  --admin-user asomap_admin \
  --admin-password "TuPassword" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 16 \
  --public-access 0.0.0.0

az postgres flexible-server db create \
  --resource-group asomap-rg \
  --server-name asomap-postgres \
  --database-name asomap_db
```

> **Nota:** Si la password tiene caracteres especiales como `!`, encodearlos como `%21` en la DATABASE_URL.

### Storage Account (para archivos media)

```bash
az storage account create \
  --name asomapstorage \
  --resource-group asomap-rg \
  --location brazilsouth \
  --sku Standard_LRS \
  --allow-blob-public-access true

az storage container create \
  --name media \
  --account-name asomapstorage \
  --public-access blob
```

### Container Apps Environment

```bash
az containerapp env create \
  --name asomap-env \
  --resource-group asomap-rg \
  --location brazilsouth
```

---

## 2. Build y Push de la Imagen Docker

```bash
# Login al registry
az acr login --name asomapregistry

# Build y push (usar timestamp para forzar nueva revisión)
TAG=$(date +%Y%m%d%H%M%S)
docker build -t asomapregistry.azurecr.io/asomap-backend:$TAG .
docker push asomapregistry.azurecr.io/asomap-backend:$TAG
```

---

## 3. Despliegue del Container App

```bash
ACR_PASSWORD=$(az acr credential show --name asomapregistry --query passwords[0].value -o tsv)
TAG=$(date +%Y%m%d%H%M%S)

az containerapp create \
  --name asomap-backend \
  --resource-group asomap-rg \
  --environment asomap-env \
  --image asomapregistry.azurecr.io/asomap-backend:$TAG \
  --registry-server asomapregistry.azurecr.io \
  --registry-username asomapregistry \
  --registry-password "$ACR_PASSWORD" \
  --target-port 8000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    "DEBUG=False" \
    "SECRET_KEY=tu-clave-secreta-50-chars" \
    "DATABASE_URL=postgresql://asomap_admin:Password@asomap-postgres.postgres.database.azure.com:5432/asomap_db" \
    "CSRF_TRUSTED_ORIGINS=https://*.azurecontainerapps.io" \
    "CORS_ALLOW_ALL_ORIGINS=False" \
    "CORS_ALLOWED_ORIGINS=https://tu-static-web-app.azurestaticapps.net" \
    "AZURE_STORAGE_ACCOUNT_NAME=asomapstorage" \
    "AZURE_STORAGE_ACCOUNT_KEY=tu-storage-key" \
    "AZURE_STORAGE_CONTAINER=media"
```

> **Importante:** Siempre usar tag con timestamp (no `:latest`) para que Azure Container Apps cree una nueva revisión.

### Actualizar imagen existente

```bash
TAG=$(date +%Y%m%d%H%M%S)
docker build -t asomapregistry.azurecr.io/asomap-backend:$TAG .
docker push asomapregistry.azurecr.io/asomap-backend:$TAG

az containerapp update \
  --name asomap-backend \
  --resource-group asomap-rg \
  --image asomapregistry.azurecr.io/asomap-backend:$TAG
```

---

## 4. Despliegue del Frontend

```bash
az staticwebapp create \
  --name asomap-frontend \
  --resource-group asomap-rg \
  --location eastus2
```

El token de despliegue se obtiene desde:
**Azure Portal → Static Web App → Manage deployment token**

Agregar como secret en GitHub: `AZURE_STATIC_WEB_APPS_API_TOKEN`

---

## 5. GitHub Actions (CI/CD)

### Secrets requeridos en GitHub

| Secret | Cómo obtenerlo |
|---|---|
| `AZURE_CREDENTIALS` | `az ad sp create-for-rbac --name asomap-deploy --role contributor --scopes /subscriptions/<SUB_ID>/resourceGroups/asomap-rg --json-auth` |
| `AZURE_REGISTRY_NAME` | `asomapregistry` |
| `AZURE_REGISTRY_USERNAME` | `az acr credential show --name asomapregistry --query username -o tsv` |
| `AZURE_REGISTRY_PASSWORD` | `az acr credential show --name asomapregistry --query passwords[0].value -o tsv` |
| `AZURE_RESOURCE_GROUP` | `asomap-rg` |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Portal → Static Web App → Manage deployment token |
| `VITE_API_BASE_URL` | URL del Container App + `/api` (ej: `https://asomap-backend.whitesky-xxx.brazilsouth.azurecontainerapps.io/api`) |

El workflow de backend (`.github/workflows/backend.yml`) se dispara automáticamente en cada push a `main` que afecte archivos del backend.

---

## 6. Variables de Entorno del Container App

| Variable | Valor |
|---|---|
| `DEBUG` | `False` |
| `SECRET_KEY` | Clave aleatoria 50+ chars |
| `DATABASE_URL` | `postgresql://user:password@host:5432/db` |
| `CSRF_TRUSTED_ORIGINS` | `https://*.azurecontainerapps.io` |
| `CORS_ALLOW_ALL_ORIGINS` | `False` |
| `CORS_ALLOWED_ORIGINS` | URL del Static Web App |
| `AZURE_STORAGE_ACCOUNT_NAME` | Nombre del storage account |
| `AZURE_STORAGE_ACCOUNT_KEY` | Clave del storage account |
| `AZURE_STORAGE_CONTAINER` | `media` |

---

## 7. Verificación

```bash
# Healthcheck
curl https://asomap-backend.<id>.brazilsouth.azurecontainerapps.io/health/
# Debe devolver: {"status": "ok"}

# Admin panel
# https://asomap-backend.<id>.brazilsouth.azurecontainerapps.io/

# Swagger UI
# https://asomap-backend.<id>.brazilsouth.azurecontainerapps.io/api/schema/swagger-ui/
```

---

## 8. Solución de Problemas

### Error 403 CSRF en el admin
- Verificar que `CSRF_TRUSTED_ORIGINS` incluye la URL del Container App con `https://`

### Container App no actualiza imagen
- Azure cachea la imagen `:latest`. Siempre usar tags con timestamp (`YYYYMMDDHHMMSS`)

### Error de autenticación en PostgreSQL
- Si la password tiene `!` u otros caracteres especiales, encodear en la URL (`!` → `%21`)

### Registro de providers si falta algún servicio
```bash
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.DBforPostgreSQL
az provider register --namespace Microsoft.Storage
az provider register --namespace Microsoft.Web
```

### PostgreSQL no disponible en eastus/eastus2
- Usar `brazilsouth` como región alternativa

---

## 9. Comandos de Administración en Producción

```bash
# Ejecutar comando en el container
az containerapp exec \
  --name asomap-backend \
  --resource-group asomap-rg \
  --command "python manage.py createsuperuser"

# Ver logs
az containerapp logs show \
  --name asomap-backend \
  --resource-group asomap-rg \
  --follow
```
