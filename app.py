from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import cv2
import os

app = Flask(__name__)
CORS(app)

# ensure static folder exists
if not os.path.exists("static"):
    os.makedirs("static")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        file_path = os.path.join('static', 'uploaded.jpg')
        file.save(file_path)

        output_path, num_faces = detect_faces(file_path)
        if output_path is None:
            return jsonify({"error": "Failed to process image"}), 500

        response = {
            'output_path': f"/{output_path}",
            'num_faces': num_faces
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def detect_faces(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None, 0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )

    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.2, minNeighbors=4, minSize=(30, 30)
    )
    faces = list(faces)

    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 3)

    output_path = os.path.join('static', 'output.png')
    cv2.imwrite(output_path, img)

    return output_path, len(faces)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
