from django.core.management.base import BaseCommand
from header.models import ExchangeRate, Navigation


class Command(BaseCommand):
    help = 'Crea datos iniciales para header (tasa de cambio y navegacion)'

    def handle(self, *args, **options):
        self.stdout.write('Creando datos iniciales del header...')

        # Tasa de cambio
        if not ExchangeRate.objects.filter(is_active=True).exists():
            ExchangeRate.objects.create(
                currency_name='US DOLAR',
                buy_rate=58.50,
                sell_rate=59.20,
                show_buy_rate=True,
                show_sell_rate=True,
                is_active=True,
            )
            self.stdout.write('  + Tasa de cambio USD creada')
        else:
            self.stdout.write('  = Tasa de cambio ya existe')

        # Navegacion
        nav_items = [
            ('individual', 'Individual'),
            ('empresarial', 'Empresarial'),
        ]
        for nav_type, label in nav_items:
            _, created = Navigation.objects.get_or_create(
                navigation_type=nav_type,
                defaults={'menu_items': label, 'is_active': True},
            )
            if created:
                self.stdout.write(f'  + Navegacion "{label}" creada')
            else:
                self.stdout.write(f'  = Navegacion "{label}" ya existe')

        self.stdout.write(self.style.SUCCESS('Datos del header creados correctamente'))
