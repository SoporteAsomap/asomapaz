from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    DebitCardPromo,
    EducationSection,
    PeKeAccountSummary,
    ProductSection,
    SliderItem,
)
from .serializers import (
    DebitCardPromoSerializer,
    EducationSectionSerializer,
    PeKeAccountSummarySerializer,
    ProductSectionSerializer,
    SliderItemSerializer,
)


class HomeViewSet(viewsets.GenericViewSet):
    queryset = SliderItem.objects.none()

    @action(detail=False, methods=["get"], url_path="slider")
    def slider(self, request):
        items = SliderItem.objects.filter(is_active=True).order_by("order")
        serializer = SliderItemSerializer(items, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="product-section")
    def product_section(self, request):
        section = ProductSection.objects.filter(is_active=True).prefetch_related("products").first()
        if not section:
            return Response({"data": None}, status=status.HTTP_200_OK)

        serializer = ProductSectionSerializer(section, context={"request": request})
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="education-section")
    def education_section(self, request):
        section = EducationSection.objects.filter(is_active=True).prefetch_related("education_items").first()
        if not section:
            return Response({"data": None}, status=status.HTTP_200_OK)

        serializer = EducationSectionSerializer(section, context={"request": request})
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="peke-account-summary")
    def peke_account_summary(self, request):
        summary = PeKeAccountSummary.objects.filter(is_active=True).first()
        if not summary:
            return Response({}, status=status.HTTP_200_OK)

        serializer = PeKeAccountSummarySerializer(summary, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="debit-card-promo")
    def debit_card_promo(self, request):
        promo = DebitCardPromo.objects.filter(is_active=True).first()
        if not promo:
            return Response({}, status=status.HTTP_200_OK)

        serializer = DebitCardPromoSerializer(promo, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
