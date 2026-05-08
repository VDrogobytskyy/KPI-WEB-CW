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
