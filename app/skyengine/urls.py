from django.urls import path
from . import views

urlpatterns = [
    path('human/<int:id>', views.Human.as_view(), name='human_image'),
    path('gallery/preview/<int:id>', views.Gallery.as_view(), name='gallery_preview'),
    path('gallery/<int:id>', views.Gallery.as_view(), name='set_gallery_image'),
]