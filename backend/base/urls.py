from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('', views.getRoutes, name="routes"),
    path('foods/search/', views.foodSearch, name='food-search'),
    path('users/profile/', views.getUserProfile, name='user-profile'),
]