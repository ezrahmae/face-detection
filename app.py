from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    file_path = os.path.join('static', 'uploaded.jpg')
    file.save(file_path)
    
    
    
    output_path, num_faces = detect_faces(file_path)

    response = {
        'output_path': f"/{output_path}",  
        'num_faces': num_faces
    }
    return jsonify(response)

def detect_faces(image_path):
    img = cv2.imread(image_path)

    if img is None:
        return None, 0  

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=4, minSize=(30, 30))
    faces = list(faces)

    print(f"Detected faces: {faces}")  

    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 3)

    output_path = os.path.join('static', 'output.png')
    cv2.imwrite(output_path, img)

    return output_path, len(faces)

if __name__ == '__main__':
    app.run(debug=True)
