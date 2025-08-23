from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Entry, MediaAsset, MusicTrack, MoodLabel, MoodDay
import hashlib

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "date_joined"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    class Meta:
        model = User
        fields = ["username", "email", "password"]
    def create(self, data):
        return User.objects.create_user(
            username=data["username"], email=data.get("email"), password=data["password"]
        )

class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = ["id","type","file","external_url","width","height","duration","order","created_at"]
        read_only_fields = ["id","created_at"]

class EntrySerializer(serializers.ModelSerializer):
    media = MediaAssetSerializer(many=True, read_only=True)
    class Meta:
        model = Entry
        fields = [
            "id","title","body_html","body_json","created_for","created_at",
            "unlock_at","visibility","location","soundtrack","media"
        ]
        read_only_fields = ["id","created_at"]
    def create(self, data):
        data["user"] = self.context["request"].user
        return super().create(data)

class MusicTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicTrack
        fields = ["id","file","title","artist","duration","size_bytes","sha256","uploaded_at"]
        read_only_fields = ["id","sha256","uploaded_at","size_bytes"]
    def create(self, data):
        user = self.context["request"].user
        f = data["file"]
        h = hashlib.sha256()
        for chunk in f.chunks():
            h.update(chunk)
        data["sha256"] = h.hexdigest()
        data["user"] = user
        obj = super().create(data)
        obj.size_bytes = obj.file.size
        obj.save(update_fields=["size_bytes"])
        if MusicTrack.objects.filter(user=user, sha256=obj.sha256).exclude(pk=obj.pk).exists():
            obj.file.delete(save=False)
            obj.delete()
            raise serializers.ValidationError("Exact duplicate track already exists.")
        return obj

class MoodLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodLabel
        fields = ["id","name","emoji","color"]

class MoodDaySerializer(serializers.ModelSerializer):
    labels = serializers.PrimaryKeyRelatedField(many=True, queryset=MoodLabel.objects.none(), required=False)
    class Meta:
        model = MoodDay
        fields = ["id","date","note","labels"]
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["labels"].queryset = MoodLabel.objects.filter(user=self.context["request"].user)
    def create(self, data):
        data["user"] = self.context["request"].user
        labels = data.pop("labels", [])
        obj = super().create(data)
        if labels: obj.labels.set(labels)
        return obj
    def update(self, instance, data):
        labels = data.pop("labels", None)
        obj = super().update(instance, data)
        if labels is not None: obj.labels.set(labels)
        return obj
