from django.contrib import admin

# Register your models here.
from embed_video.admin import AdminVideoMixin
from .models import *


admin.site.register(Video)
admin.site.register(DocumentPost)
