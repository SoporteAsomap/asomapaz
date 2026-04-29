from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('layout', '0002_remove_footer_company_remove_footer_location_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialNetwork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Nombre de la red social (ej: Facebook, Instagram, Twitter)', max_length=100, verbose_name='Nombre de la red social')),
                ('url', models.URLField(help_text='Enlace completo a la página de la red social', verbose_name='URL de la red social')),
                ('icon', models.CharField(help_text='Nombre del icono de React Icons (ej: FaFacebook, FaInstagram, FaTwitter)', max_length=50, verbose_name='Icono')),
                ('order', models.PositiveIntegerField(default=0, help_text='Orden de visualización (menor número = aparece primero)', verbose_name='Orden')),
                ('is_active', models.BooleanField(default=True, help_text='Indica si la red social está activa y se muestra', verbose_name='Activo')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Red Social',
                'verbose_name_plural': 'Redes Sociales',
                'ordering': ['order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Nombre del tipo de contacto (ej: Teléfono, Email, WhatsApp, Dirección)', max_length=100, verbose_name='Nombre del contacto')),
                ('url', models.URLField(help_text='Enlace o valor del contacto (ej: tel:+1234567890, mailto:info@empresa.com, https://wa.me/1234567890)', verbose_name='URL del contacto')),
                ('icon', models.CharField(help_text='Nombre del icono de React Icons (ej: FaPhone, FaEnvelope, FaWhatsapp, FaMapMarkerAlt)', max_length=50, verbose_name='Icono')),
                ('order', models.PositiveIntegerField(default=0, help_text='Orden de visualización (menor número = aparece primero)', verbose_name='Orden')),
                ('is_active', models.BooleanField(default=True, help_text='Indica si el contacto está activo y se muestra', verbose_name='Activo')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Contacto',
                'verbose_name_plural': 'Contactos',
                'ordering': ['order', 'name'],
            },
        ),
    ]
