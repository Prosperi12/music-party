from django.db import models
import string
import random


def generate_unique_code():
    length = 6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break
    return code


class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Room {self.code} hosted by {self.host}"


class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

    def __str__(self):
        return f"SpotifyToken for {self.user}"


class Vote(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self):
        return f"Vote by {self.user} in room {self.room.code}"
