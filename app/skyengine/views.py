import requests
from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
from io import BytesIO
import json
from django.conf import settings
from django.views import View

gallery = {}

def fetch_and_save_image(image_id: int):
    url = "https://thispersondoesnotexist.com"
    response = requests.get(url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content))
        gallery[image_id] = image
        return image
    return None

def get_buffered_image(image):
    buffer = BytesIO()
    image = image
    image.save(buffer, format="JPEG")
    buffer.seek(0)
    return buffer

class Human(View):
    def get(self, request, id):
        if not id in gallery.keys():
            image = fetch_and_save_image(id)
            if not image:
                return HttpResponse(status=404)

        return HttpResponse(get_buffered_image(gallery[id]), content_type="image/jpeg")
    
@method_decorator(csrf_exempt, name='dispatch')
class Gallery(View):
    def get(self, request, id):
        image = gallery[id]
        if not image:
            return HttpResponse(status=404)
        image = image.resize((200,200))
        return HttpResponse(get_buffered_image(image), content_type="image/jpeg")
    
    def put(self, request, id):
        if request.method == "PUT":
            try:
                data = json.loads(request.body)
                image_type = data["type"]
                new_id = data["id"]

                if image_type != "human":
                    return JsonResponse({"error": "Invalid image type"}, status=400)

                if id not in gallery.keys():
                    return JsonResponse({"error": "Wrong ID of image"}, status=404)
                
                gallery[new_id] = gallery.pop(id)
                return JsonResponse({"error": "ID "+str(id) +" changed to "+str(new_id)}, status=200)

            except (KeyError, json.JSONDecodeError):
                return JsonResponse({"error": "Invalid request format"}, status=400)
        else:
            return JsonResponse({"error": "Invalid request method"}, status=405)