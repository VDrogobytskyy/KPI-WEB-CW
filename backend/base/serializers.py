from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Food,
    Meal,
    MealItem,
    Workout,
    WorkoutEntry,
    UserProfile,
)

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin']

    def get_name(self, obj):
        name = obj.first_name

        if name == '':
            name = obj.email

        return name
    
    def get_isAdmin(self, obj):
        return obj.is_staff

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'height_cm',
            'weight_kg',
            'birth_date',
            'sex',
            'kcal_goal_daily',
            'protein_goal',
            'fat_goal',
            'carbs_goal',
        ]


class MeSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False, allow_null=True)
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'name', 'isAdmin', 'profile', 'date_joined']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)

        for field in ['email', 'first_name', 'last_name']:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        instance.save()

        if profile_data is not None:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            for key, value in profile_data.items():
                setattr(profile, key, value)
            profile.save()

        return instance
    
    def get_name(self, obj):
        name = obj.first_name

        if name == '':
            name = obj.email

        return name

    def get_isAdmin(self, obj):
        return obj.is_staff


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = [
            'id',
            'source',
            'external_id',
            'name',
            'brand',
            'kcal_per_100g',
            'protein_per_100g',
            'fat_per_100g',
            'carbs_per_100g',
            'created_at',
            'updated_at',
        ]


class MealItemSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = MealItem
        fields = [
            'id',
            'food',
            'food_id',
            'name_snapshot',
            'grams',
            'kcal_total',
            'protein_total',
            'fat_total',
            'carbs_total',
        ]


class MealSerializer(serializers.ModelSerializer):
    items = MealItemSerializer(many=True)
    totals = serializers.SerializerMethodField()

    class Meta:
        model = Meal
        fields = ['id', 'eaten_at', 'note', 'items', 'totals']

    def get_totals(self, obj):
        kcal = 0
        protein = 0
        fat = 0
        carbs = 0
        for it in obj.items.all():
            kcal += it.kcal_total or 0
            protein += it.protein_total or 0
            fat += it.fat_total or 0
            carbs += it.carbs_total or 0
        return {
            'kcal': kcal,
            'protein': protein,
            'fat': fat,
            'carbs': carbs,
        }

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        user = self.context['request'].user
        meal = Meal.objects.create(user=user, **validated_data)
        for item in items_data:
            food_id = item.pop('food_id', None)
            food = None
            if food_id:
                try:
                    food = Food.objects.get(id=food_id)
                except Food.DoesNotExist:
                    food = None
            MealItem.objects.create(meal=meal, food=food, **item)
        return meal


class WorkoutEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutEntry
        fields = ['id', 'name_snapshot', 'minutes', 'kcal_burned']


class WorkoutSerializer(serializers.ModelSerializer):
    entries = WorkoutEntrySerializer(many=True)
    totals = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['id', 'started_at', 'duration_minutes', 'total_kcal_burned', 'note', 'entries', 'totals']

    def get_totals(self, obj):
        kcal = 0
        minutes = 0
        for e in obj.entries.all():
            kcal += e.kcal_burned or 0
            minutes += e.minutes or 0
        return {'kcal': kcal, 'minutes': minutes}

    def create(self, validated_data):
        entries_data = validated_data.pop('entries', [])
        user = self.context['request'].user

        total_kcal = sum([(e.get('kcal_burned') or 0) for e in entries_data])
        duration = validated_data.get('duration_minutes')
        if duration is None:
            duration = sum([(e.get('minutes') or 0) for e in entries_data])

        workout = Workout.objects.create(
            user=user,
            total_kcal_burned=validated_data.get('total_kcal_burned') or total_kcal,
            duration_minutes=duration,
            started_at=validated_data['started_at'],
            note=validated_data.get('note'),
        )
        for entry in entries_data:
            WorkoutEntry.objects.create(workout=workout, **entry)
        return workout
