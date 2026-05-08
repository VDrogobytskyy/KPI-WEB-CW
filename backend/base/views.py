from django.shortcuts import render

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response


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