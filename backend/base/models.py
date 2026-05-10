from django.db import models
from django.contrib.auth.models import User

class Food(models.Model):

    id = models.AutoField(primary_key=True, editable=False)

    source = models.CharField(max_length=32, default="usda")
    external_id = models.CharField(max_length=64)  # fdcId

    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255, blank=True, null=True)

    kcal_per_100g = models.FloatField(blank=True, null=True)
    protein_per_100g = models.FloatField(blank=True, null=True)
    fat_per_100g = models.FloatField(blank=True, null=True)
    carbs_per_100g = models.FloatField(blank=True, null=True)

    raw_payload = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Meal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="meals")
    eaten_at = models.DateTimeField()
    note = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "eaten_at"], name="ix_meal_user_eaten_at"),
        ]

    def __str__(self):
        return f"Meal {self.id} ({self.user.username})"


class MealItem(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name="items")
    food = models.ForeignKey(Food, on_delete=models.SET_NULL, null=True, blank=True, related_name="meal_items")
    name_snapshot = models.CharField(max_length=255)

    grams = models.FloatField()

    kcal_total = models.FloatField(default=0)
    protein_total = models.FloatField(default=0)
    fat_total = models.FloatField(default=0)
    carbs_total = models.FloatField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=["meal"], name="ix_mealitem_meal"),
        ]

    def __str__(self):
        return f"{self.name_snapshot} ({self.grams}g)"


class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")
    started_at = models.DateTimeField()
    duration_minutes = models.IntegerField()
    total_kcal_burned = models.FloatField(default=0)
    note = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "started_at"], name="ix_workout_user_started_at"),
        ]

    def __str__(self):
        return f"Workout {self.id} ({self.user.username})"


class ExerciseType(models.Model):
    name = models.CharField(max_length=120, unique=True)
    met = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.name


class WorkoutEntry(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="entries")
    exercise_type = models.ForeignKey(
        ExerciseType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="workout_entries",
    )
    name_snapshot = models.CharField(max_length=255)

    minutes = models.IntegerField()
    kcal_burned = models.FloatField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=["workout"], name="ix_workoutentry_workout"),
        ]

    def __str__(self):
        return f"{self.name_snapshot} ({self.minutes} min)"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    height_cm = models.IntegerField(blank=True, null=True)
    weight_kg = models.FloatField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    sex = models.CharField(max_length=16, blank=True, null=True)

    kcal_goal_daily = models.IntegerField(blank=True, null=True)
    protein_goal = models.FloatField(blank=True, null=True)
    fat_goal = models.FloatField(blank=True, null=True)
    carbs_goal = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"Profile ({self.user.username})"