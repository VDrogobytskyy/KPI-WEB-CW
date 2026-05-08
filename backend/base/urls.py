from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('foods/search/', views.foodSearch, name='food-search'),
]