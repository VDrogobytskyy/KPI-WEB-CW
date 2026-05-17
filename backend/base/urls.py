from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser, name='user-register'),
    path('', views.getRoutes, name="routes"),
    path('foods/search/', views.foodSearch, name='food-search'),
    path('foods/', views.listFoods, name='foods-list'),
    path('foods/<int:pk>/', views.foodDetail, name='foods-detail'),
    path('foods/import/', views.importFood, name='foods-import'),

    path('meals/', views.mealsCollection, name='meals-collection'),
    path('meals/<int:pk>/', views.mealDetail, name='meal-detail'),

    path('activities/', views.activitiesCollection, name='activities-collection'),
    path('activities/<int:pk>/', views.activityDetail, name='activity-detail'),

    path('users/profile/', views.me, name='me'),
    
]
