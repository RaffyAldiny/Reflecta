from django.conf import settings
from django.db import models
from uuid import uuid4
from pathlib import Path

User = settings.AUTH_USER_MODEL

def entry_media_path(instance, filename):
    ext = Path(filename).suffix.lower()
    return f"entries/{instance.entry.user_id}/{instance.entry_id}/{uuid4().hex}{ext}"

def music_path(instance, filename):
    ext = Path(filename).suffix.lower()
    return f"music/{instance.user_id}/{uuid4().hex}{ext}"

class Entry(models.Model):
    VISIBILITY_CHOICES = [("private", "Private"), ("unlisted", "Unlisted")]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="entries")
    title = models.CharField(max_length=255, null=True, blank=True)
    body_html = models.TextField(null=True, blank=True)
    body_json = models.JSONField(null=True, blank=True)
    created_for = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    unlock_at = models.DateTimeField(null=True, blank=True)
    soundtrack = models.ForeignKey("MusicTrack", null=True, blank=True, on_delete=models.SET_NULL)
    visibility = models.CharField(max_length=16, choices=VISIBILITY_CHOICES, default="private")
    location = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "created_for"]),
            models.Index(fields=["user", "-created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user_id} – {self.title or '(untitled)'}"

class MediaAsset(models.Model):
    TYPE_CHOICES = [("image", "Image"), ("video", "Video"), ("audio", "Audio")]

    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name="media")
    type = models.CharField(max_length=8, choices=TYPE_CHOICES)
    file = models.FileField(upload_to=entry_media_path, blank=True, null=True)
    external_url = models.URLField(null=True, blank=True)
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["entry"]), models.Index(fields=["type"])]
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.type} for entry {self.entry_id}"

class MusicTrack(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tracks")
    file = models.FileField(upload_to=music_path)
    title = models.CharField(max_length=255, null=True, blank=True)
    artist = models.CharField(max_length=255, null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)
    size_bytes = models.BigIntegerField(null=True, blank=True)
    sha256 = models.CharField(max_length=64)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "sha256"], name="uniq_user_trackhash")
        ]
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title or Path(self.file.name).name

class MoodLabel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mood_labels")
    name = models.CharField(max_length=48)
    emoji = models.CharField(max_length=8, null=True, blank=True)
    color = models.CharField(max_length=16, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "name"], name="uniq_user_moodlabel")
        ]
        ordering = ["name"]

    def __str__(self):
        return self.name

class MoodDay(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mood_days")
    date = models.DateField()
    note = models.TextField(null=True, blank=True)
    labels = models.ManyToManyField(MoodLabel, related_name="days", blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "date"], name="uniq_user_date")
        ]
        ordering = ["-date"]

    def __str__(self):
        return f"{self.user_id} – {self.date}"

class WordStat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wordstats")
    period = models.CharField(max_length=7)  # YYYY-MM
    lemma = models.CharField(max_length=64)
    count = models.IntegerField()
    avg_sentiment = models.FloatField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "period", "lemma"], name="uniq_user_period_lemma")
        ]
        ordering = ["-period", "-count"]

class EntryEmbedding(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="embeddings")
    entry = models.OneToOneField(Entry, on_delete=models.CASCADE, related_name="embedding")
    x = models.FloatField()
    y = models.FloatField()
    year = models.IntegerField()
    model_version = models.CharField(max_length=32)

    class Meta:
        indexes = [models.Index(fields=["user", "year"])]

class Constellation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="constellations")
    name = models.CharField(max_length=128)
    entries = models.ManyToManyField(Entry, related_name="constellations", blank=True)
    is_auto = models.BooleanField(default=False)
    method = models.CharField(max_length=64, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "name"], name="uniq_user_constellation_name")
        ]
        ordering = ["name"]
