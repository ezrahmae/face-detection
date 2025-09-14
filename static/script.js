// Make functions global
window.showUpload = function() {
    document.getElementById("upload-form").style.display = "block";
    document.getElementById("camera-section").style.display = "none";
    document.getElementById("result").innerHTML = "";
};

window.showCamera = async function() {
    document.getElementById("upload-form").style.display = "none";
    document.getElementById("camera-section").style.display = "block";
    document.getElementById("result").innerHTML = "";

    let video = document.getElementById("video");

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
    } catch (err) {
        alert("Camera access denied. Please allow it.");
        console.error(err);
    }
};

// Update filename when selecting file
document.getElementById("file-input").addEventListener("change", function() {
    document.getElementById("file-name").textContent =
        this.files[0] ? this.files[0].name : "No file chosen";
});

const BACKEND_URL = "https://face-detection-6gx3.onrender.com";

// Upload form submit
document.getElementById("upload-form").onsubmit = async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    document.getElementById("result").innerHTML = "Processing...";

    const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    document.getElementById("result").innerHTML = `
        <p>Number of faces detected: <strong>${data.num_faces}</strong></p>
        <img src="${BACKEND_URL}${data.output_path}?t=${new Date().getTime()}" width="500"/>
    `;
};

// Capture from camera
document.getElementById("capture-btn").addEventListener("click", function() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "captured.png");
        document.getElementById("result").innerHTML = "Processing...";

        const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        document.getElementById("result").innerHTML = `
            <p>Number of faces detected: <strong>${data.num_faces}</strong></p>
            <img src="${BACKEND_URL}${data.output_path}?t=${new Date().getTime()}" width="500"/>
        `;
    }, "image/png");
});
