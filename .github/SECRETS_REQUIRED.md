# GitHub Secrets requeridos

Ve a: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

## Backend

| Secret | Cómo obtenerlo |
|---|---|
| `AZURE_CREDENTIALS` | `az ad sp create-for-rbac --name asomap-deploy --role contributor --scopes /subscriptions/<SUB_ID>/resourceGroups/asomap-rg --json-auth` |
| `AZURE_REGISTRY_NAME` | Nombre del ACR sin `.azurecr.io` (ej: `asomapregistry`) |
| `AZURE_REGISTRY_USERNAME` | `az acr credential show --name asomapregistry --query username -o tsv` |
| `AZURE_REGISTRY_PASSWORD` | `az acr credential show --name asomapregistry --query passwords[0].value -o tsv` |
| `AZURE_RESOURCE_GROUP` | `asomap-rg` |

## Frontend

| Secret | Cómo obtenerlo |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Portal → Static Web App → Manage deployment token |
| `VITE_API_URL` | URL del Container App (ej: `https://asomap-backend.azurecontainerapps.io`) |

## Variables de entorno del Container App

Configura estas en Azure Portal → Container App → Environment variables:

| Variable | Valor |
|---|---|
| `DEBUG` | `False` |
| `SECRET_KEY` | Clave aleatoria (50+ chars) |
| `DATABASE_URL` | URL de PostgreSQL de Azure |
| `ALLOWED_HOSTS` | `*.azurecontainerapps.io,tu-dominio.com` |
| `CSRF_TRUSTED_ORIGINS` | `https://*.azurecontainerapps.io` |
| `CORS_ALLOW_ALL_ORIGINS` | `False` |
| `CORS_ALLOWED_ORIGINS` | URL del Static Web App |
| `AZURE_STORAGE_ACCOUNT_NAME` | Nombre del storage account |
| `AZURE_STORAGE_ACCOUNT_KEY` | Clave del storage account |
| `AZURE_STORAGE_CONTAINER` | `media` |
