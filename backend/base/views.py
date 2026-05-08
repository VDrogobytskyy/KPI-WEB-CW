from django.shortcuts import render

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.conf import settings
from urllib.parse import urlencode
from urllib.request import urlopen, Request
import json

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/auth/',
        '/api/me/',
        '/api/foods/',
        '/api/meals/',
        '/api/activities/',
        '/api/analytics/',
        '/api/report'
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
    for item in data.get("foods", []) or []:
        foods.append(
            {
                "fdcId": item.get("fdcId"),
                "description": item.get("description"),
                "brandOwner": item.get("brandOwner"),
                "dataType": item.get("dataType"),
            }
        )

    return Response({"foods": foods, "totalHits": data.get("totalHits", 0)})
