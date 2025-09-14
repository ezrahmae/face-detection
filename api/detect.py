# api/detect.py
def handler(request, response):
    # your Python logic here
    response.status_code = 200
    response.json({"message": "Hello from Python!"})
