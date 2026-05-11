from django.shortcuts import render

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from django.conf import settings
from urllib.parse import urlencode
from urllib.request import urlopen, Request
import json
from datetime import datetime, time
import uuid

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    MeSerializer,
    UserSerializerWithToken,
    FoodSerializer,
    MealSerializer,
    WorkoutSerializer,
)
from .models import Food, Meal, Workout


@api_view(['POST'])
def registerUser(request):
    payload = request.data or {}
    username = (payload.get("username") or "").strip()
    email = (payload.get("email") or "").strip()
    password = payload.get("password") or ""

    if not username or not password:
        return Response({"detail": "username and password are required."}, status=400)

    try:
        validate_password(password)
    except ValidationError as exc:
        return Response({"detail": "Invalid password.", "errors": list(exc.messages)}, status=400)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
    except IntegrityError:
        return Response({"detail": "Username already exists."}, status=400)

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        status=201,
    )

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    if request.method == 'GET':
        return Response(MeSerializer(user, many=False).data)

    serializer = MeSerializer(user, many=False, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(MeSerializer(user, many=False).data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/auth/',
        '/api/users/profile/',
        '/api/foods/search/',
        '/api/foods/',
        '/api/foods/import/',
        '/api/meals/',
        '/api/activities/',
    ]
    return Response(routes)

@api_view(['GET'])
def foodSearch(request):
    api_key = getattr(settings, "USDA_API_KEY", None)
    if not api_key:
        return Response(
            {"detail": "USDA_API_KEY is not configured on the server."},
            status=500,
        )

    query = (request.GET.get("q") or request.GET.get("query") or "").strip()
    if not query:
        return Response({"foods": [], "totalHits": 0})

    page_size = request.GET.get("pageSize") or "10"
    params = {
        "api_key": api_key,
        "query": query,
        "pageSize": page_size,
    }
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search?{urlencode(params)}"

    try:
        req = Request(url, headers={"Accept": "application/json"})
        with urlopen(req, timeout=15) as resp:
            raw = resp.read().decode("utf-8")
            data = json.loads(raw)
    except Exception as exc:
        return Response(
            {"detail": "Failed to fetch USDA FoodData Central.", "error": str(exc)},
            status=502,
        )

    foods = []
    fdc_ids = []
    for item in data.get("foods", []) or []:
        fdc_ids.append(str(item.get("fdcId")))

    cached = set(
        Food.objects.filter(source="usda", external_id__in=fdc_ids).values_list("external_id", flat=True)
    )

    for item in data.get("foods", []) or []:
        fdc_id = item.get("fdcId")
        foods.append(
            {
                "fdcId": fdc_id,
                "description": item.get("description"),
                "brandOwner": item.get("brandOwner"),
                "dataType": item.get("dataType"),
                "cached": str(fdc_id) in cached,
            }
        )

    return Response({"foods": foods, "totalHits": data.get("totalHits", 0)})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listFoods(request):
    if request.method == 'GET':
        q = (request.GET.get("search") or "").strip()
        source = (request.GET.get("source") or "").strip()
        qs = Food.objects.all().order_by("-updated_at")
        if q:
            qs = qs.filter(name__icontains=q)
        if source:
            qs = qs.filter(source=source)
        return Response(FoodSerializer(qs[:50], many=True).data)

    payload = request.data or {}
    name = (payload.get("name") or "").strip()
    if not name:
        return Response({"detail": "name is required."}, status=400)

    food = Food.objects.create(
        source=(payload.get("source") or "custom"),
        external_id=str(payload.get("external_id") or uuid.uuid4()),
        name=name,
        brand=(payload.get("brand") or None),
        kcal_per_100g=payload.get("kcal_per_100g"),
        protein_per_100g=payload.get("protein_per_100g"),
        fat_per_100g=payload.get("fat_per_100g"),
        carbs_per_100g=payload.get("carbs_per_100g"),
        raw_payload=payload.get("raw_payload"),
    )
    return Response(FoodSerializer(food, many=False).data, status=201)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def foodDetail(request, pk):
    food = Food.objects.filter(id=pk).first()
    if not food:
        return Response({"detail": "Not found."}, status=404)

    if request.method == 'GET':
        return Response(FoodSerializer(food, many=False).data)

    if request.method == 'DELETE':
        food.delete()
        return Response(status=204)

    payload = request.data or {}
    for field in [
        "name",
        "brand",
        "kcal_per_100g",
        "protein_per_100g",
        "fat_per_100g",
        "carbs_per_100g",
    ]:
        if field in payload:
            setattr(food, field, payload.get(field))
    food.save()
    return Response(FoodSerializer(food, many=False).data)


def _nutrient_map_from_food_details(data):
    # Try common fields first (branded foods)
    label = data.get("labelNutrients") or {}
    serving_size = data.get("servingSize")
    serving_unit = (data.get("servingSizeUnit") or "").lower()

    def per_100g_from_label(key):
        v = (label.get(key) or {}).get("value")
        if v is None:
            return None
        if serving_size and serving_unit in ["g", "gram", "grams", "grm"]:
            try:
                return float(v) / float(serving_size) * 100.0
            except Exception:
                return None
        return None

    kcal = per_100g_from_label("calories")
    protein = per_100g_from_label("protein")
    fat = per_100g_from_label("fat")
    carbs = per_100g_from_label("carbohydrates")

    # Foundation/SR foods: foodNutrients array usually already normalized per 100g
    if kcal is None or protein is None or fat is None or carbs is None:
        nutrient_by_id = {}
        for n in data.get("foodNutrients", []) or []:
            nutrient = n.get("nutrient") or {}
            nutrient_id = nutrient.get("id") or n.get("nutrientId")
            if nutrient_id is None:
                continue
            amount = n.get("amount")
            if amount is None:
                amount = n.get("value")
            nutrient_by_id[int(nutrient_id)] = amount

        def num(nid):
            v = nutrient_by_id.get(nid)
            return float(v) if v is not None else None

        kcal = kcal if kcal is not None else num(1008)
        protein = protein if protein is not None else num(1003)
        fat = fat if fat is not None else num(1004)
        carbs = carbs if carbs is not None else num(1005)

    return kcal, protein, fat, carbs


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def importFood(request):
    api_key = getattr(settings, "USDA_API_KEY", None)
    if not api_key:
        return Response(
            {"detail": "USDA_API_KEY is not configured on the server."},
            status=500,
        )

    fdc_id = request.data.get("fdcId") or request.data.get("external_id")
    if not fdc_id:
        return Response({"detail": "fdcId is required."}, status=400)

    food = Food.objects.filter(source="usda", external_id=str(fdc_id)).first()
    if food:
        return Response(FoodSerializer(food, many=False).data)

    url = f"https://api.nal.usda.gov/fdc/v1/food/{fdc_id}?{urlencode({'api_key': api_key})}"
    try:
        req = Request(url, headers={"Accept": "application/json"})
        with urlopen(req, timeout=15) as resp:
            raw = resp.read().decode("utf-8")
            data = json.loads(raw)
    except Exception as exc:
        return Response(
            {"detail": "Failed to fetch USDA FoodData Central.", "error": str(exc)},
            status=502,
        )

    kcal, protein, fat, carbs = _nutrient_map_from_food_details(data)
    food = Food.objects.create(
        source="usda",
        external_id=str(fdc_id),
        name=data.get("description") or data.get("lowercaseDescription") or str(fdc_id),
        brand=data.get("brandOwner"),
        kcal_per_100g=kcal,
        protein_per_100g=protein,
        fat_per_100g=fat,
        carbs_per_100g=carbs,
        raw_payload=data,
    )
    return Response(FoodSerializer(food, many=False).data, status=201)


def _parse_date_range(request):
    from_s = (request.GET.get("from") or "").strip()
    to_s = (request.GET.get("to") or "").strip()
    if not from_s and not to_s:
        return None, None

    def parse_d(s):
        return datetime.strptime(s, "%Y-%m-%d").date()

    try:
        d_from = parse_d(from_s) if from_s else None
        d_to = parse_d(to_s) if to_s else None
    except Exception:
        return "invalid", "invalid"

    dt_from = datetime.combine(d_from, time.min) if d_from else None
    dt_to = datetime.combine(d_to, time.max) if d_to else None
    return dt_from, dt_to


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def mealsCollection(request):
    if request.method == 'GET':
        dt_from, dt_to = _parse_date_range(request)
        if dt_from == "invalid":
            return Response({"detail": "Invalid date range. Use from/to=YYYY-MM-DD."}, status=400)

        qs = Meal.objects.filter(user=request.user).prefetch_related("items", "items__food").order_by("-eaten_at")
        if dt_from:
            qs = qs.filter(eaten_at__gte=dt_from)
        if dt_to:
            qs = qs.filter(eaten_at__lte=dt_to)
        return Response(MealSerializer(qs[:200], many=True).data)

    serializer = MealSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    meal = serializer.save()
    return Response(MealSerializer(meal, many=False).data, status=201)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def mealDetail(request, pk):
    meal = Meal.objects.filter(user=request.user, id=pk).prefetch_related("items", "items__food").first()
    if not meal:
        return Response({"detail": "Not found."}, status=404)

    if request.method == 'GET':
        return Response(MealSerializer(meal, many=False).data)

    meal.delete()
    return Response(status=204)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def activitiesCollection(request):
    if request.method == 'GET':
        dt_from, dt_to = _parse_date_range(request)
        if dt_from == "invalid":
            return Response({"detail": "Invalid date range. Use from/to=YYYY-MM-DD."}, status=400)

        qs = Workout.objects.filter(user=request.user).prefetch_related("entries").order_by("-started_at")
        if dt_from:
            qs = qs.filter(started_at__gte=dt_from)
        if dt_to:
            qs = qs.filter(started_at__lte=dt_to)
        return Response(WorkoutSerializer(qs[:200], many=True).data)

    serializer = WorkoutSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    workout = serializer.save()
    return Response(WorkoutSerializer(workout, many=False).data, status=201)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def activityDetail(request, pk):
    workout = Workout.objects.filter(user=request.user, id=pk).prefetch_related("entries").first()
    if not workout:
        return Response({"detail": "Not found."}, status=404)

    if request.method == 'GET':
        return Response(WorkoutSerializer(workout, many=False).data)

    workout.delete()
    return Response(status=204)
