#!/bin/bash

# Script de inicio para Django con migraciones automáticas

echo "🚀 Iniciando backend Django..."

# Función para esperar a que PostgreSQL esté listo
wait_for_postgres() {
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    while ! nc -z $DB_HOST $DB_PORT; do
        echo "⏳ PostgreSQL no está listo en $DB_HOST:$DB_PORT - esperando..."
        sleep 2
    done
    echo "✅ PostgreSQL está listo!"
}

# Función para ejecutar migraciones
run_migrations() {
    echo "🔄 Ejecutando migraciones de Django..."
    python manage.py migrate --noinput
    if [ $? -eq 0 ]; then
        echo "✅ Migraciones completadas exitosamente"
    else
        echo "❌ Error ejecutando migraciones"
        exit 1
    fi
}

# Función para recolectar archivos estáticos
collect_static() {
    echo "📁 Recolectando archivos estáticos..."
    python manage.py collectstatic --noinput
    if [ $? -eq 0 ]; then
        echo "✅ Archivos estáticos recolectados"
    else
        echo "❌ Error recolectando archivos estáticos"
        exit 1
    fi
}

# Función para crear superusuario si no existe
create_superuser() {
    echo "👤 Verificando superusuario..."
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    print('Creando superusuario...')
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuario creado: admin/admin123')
else:
    print('Superusuario ya existe')
"
}

# Función para ejecutar comandos de datos iniciales
create_initial_data() {
    echo "📊 Creando datos iniciales de la aplicación..."
    
    # Verificar si ya existen datos (usando una tabla como indicador)
    python manage.py shell -c "
from about.models import Hero
if Hero.objects.exists():
    print('Datos iniciales ya existen, saltando...')
    exit(0)
else:
    print('Creando datos iniciales...')
    exit(1)
" 2>/dev/null
    
    if [ $? -eq 1 ]; then
        echo "🔄 Ejecutando comandos de datos iniciales..."
        
        # Ejecutar comandos uno por uno con manejo de errores
        echo "📝 Creando datos de About..."
        python manage.py create_about_data --force 2>/dev/null || echo "⚠️  Error en create_about_data"
        
        echo "🏘️  Creando datos de Community..."
        python manage.py create_community_data --force 2>/dev/null || echo "⚠️  Error en create_community_data"
        
        echo "💰 Creando datos financieros..."
        python manage.py create_financial_data --force 2>/dev/null || echo "⚠️  Error en create_financial_data"
        
        echo "📚 Creando datos de memoria..."
        python manage.py create_memory_data --force 2>/dev/null || echo "⚠️  Error en create_memory_data"
        
        echo "📋 Creando datos de políticas..."
        python manage.py create_policy_data --force 2>/dev/null || echo "⚠️  Error en create_policy_data"
        
        echo "📚 Creando datos de educación financiera..."
        python manage.py create_financial_guidance_data --force 2>/dev/null || echo "⚠️  Error en create_financial_guidance_data"
        
        echo "🏠 Creando datos de la página de inicio..."
        python manage.py create_home_data --force 2>/dev/null || echo "⚠️  Error en create_home_data"
        
        echo "📍 Creando servicios y horarios de ubicaciones..."
        python manage.py create_services --force 2>/dev/null || echo "⚠️  Error en create_services"
        python manage.py create_schedules --force 2>/dev/null || echo "⚠️  Error en create_schedules"
        
        echo "📰 Creando noticias y promociones de ejemplo..."
        python manage.py create_sample_news --force 2>/dev/null || echo "⚠️  Error en create_sample_news"
        python manage.py create_sample_promotions --force 2>/dev/null || echo "⚠️  Error en create_sample_promotions"
        
        echo "🏦 Creando productos bancarios de ejemplo..."
        python manage.py create_products --force 2>/dev/null || echo "⚠️  Error en create_products"
        python manage.py create_sample_accounts --force 2>/dev/null || echo "⚠️  Error en create_sample_accounts"
        python manage.py create_sample_cards --force 2>/dev/null || echo "⚠️  Error en create_sample_cards"
        python manage.py create_sample_certificates --force 2>/dev/null || echo "⚠️  Error en create_sample_certificates"
        python manage.py create_sample_loans --force 2>/dev/null || echo "⚠️  Error en create_sample_loans"
        
        echo "🎨 Creando banner de ejemplo..."
        python manage.py create_banner_data --force 2>/dev/null || echo "⚠️  Error en create_banner_data"
        
        echo "🏷️ Creando tipos de préstamos..."
        python manage.py create_loan_types --force 2>/dev/null || echo "⚠️  Error en create_loan_types"
        
        echo "👤 Creando datos de Pro Usuario..."
        python manage.py create_provinces --force 2>/dev/null || echo "⚠️  Error en create_provinces"
        python manage.py create_sample_service_rates --force 2>/dev/null || echo "⚠️  Error en create_sample_service_rates"
        python manage.py create_sample_contracts --force 2>/dev/null || echo "⚠️  Error en create_sample_contracts"
        python manage.py create_sample_rights_and_duties --force 2>/dev/null || echo "⚠️  Error en create_sample_rights_and_duties"
        python manage.py create_sample_fraud_reports --force 2>/dev/null || echo "⚠️  Error en create_sample_fraud_reports"
        python manage.py create_sample_abandoned_accounts --force 2>/dev/null || echo "⚠️  Error en create_sample_abandoned_accounts"
        
        echo "🏦 Creando servicios bancarios de ejemplo..."
        python manage.py create_sample_services --force 2>/dev/null || echo "⚠️  Error en create_sample_services"

        echo "🎨 Creando datos de layout (redes sociales y contactos)..."
        python manage.py create_layout_data 2>/dev/null || echo "⚠️  Error en create_layout_data"

        echo "✅ Datos iniciales creados exitosamente"
    else
        echo "✅ Datos iniciales ya existen, saltando..."
    fi
}

# Esperar a que PostgreSQL esté listo
wait_for_postgres

# Ejecutar migraciones
run_migrations

# Recolectar archivos estáticos
collect_static

# Crear superusuario si no existe
create_superuser

# Crear datos iniciales si no existen
create_initial_data

echo "🎉 Backend Django iniciado correctamente!"
echo "🌐 Servidor disponible en http://0.0.0.0:8000"

# Iniciar Django
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
