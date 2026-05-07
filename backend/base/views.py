from django.shortcuts import render

from django.http import JsonResponse
# Create your views here.

def getRoutes(request):
    routes = [
        '/api/auth/'
        '/api/me/'
        '/api/foods/'
        '/api/meals/'
        '/api/activities/'
        '/api/analytics/'
        '/api/report'
    ]
    return JsonResponse(routes, safe=False)