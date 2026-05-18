from rest_framework import serializers
from .models import Location


class LocationSerializer(serializers.ModelSerializer):
    coordinates = serializers.SerializerMethodField()
    hours = serializers.SerializerMethodField()
    services = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = [
            'id', 'type', 'name', 'address', 'phone', 
            'coordinates', 'hours', 'is_open', 'services'
        ]

    def get_coordinates(self, obj):
        return obj.coordinates() if callable(obj.coordinates) else obj.coordinates

    def get_hours(self, obj):
        return obj.hours() if callable(obj.hours) else obj.hours

    def get_services(self, obj):
        return obj.services_list
