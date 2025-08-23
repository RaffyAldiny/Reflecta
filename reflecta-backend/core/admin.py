from django.contrib import admin
from .models import Entry, MediaAsset, MusicTrack, MoodLabel, MoodDay, WordStat, EntryEmbedding, Constellation

admin.site.register(Entry)
admin.site.register(MediaAsset)
admin.site.register(MusicTrack)
admin.site.register(MoodLabel)
admin.site.register(MoodDay)
admin.site.register(WordStat)
admin.site.register(EntryEmbedding)
admin.site.register(Constellation)

