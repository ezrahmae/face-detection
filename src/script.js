document.getElementById("file-input").addEventListener("change", function () {
  let fileName = this.files[0] ? this.files[0].name : "No file chosen";
  document.getElementById("file-name").textContent = fileName;
});

document.getElementById("upload-form").onsubmit = async function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  
  // clear result before uploading a new image
  document.getElementById("result").innerHTML = "Processing...";

  let response = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  let result = await response.json();
  
  if (result.error) {
    alert("Error: " + result.error);
    return;
  }

  // processed image
  document.getElementById("result").innerHTML = `
    <p>Number of faces detected: <strong>${result.num_faces}</strong></p>
    <img width="500px" src="${result.output_path}" alt="Processed Image" />
  `;
};

// to show upload form and hide camera section
function showUpload() {
  document.getElementById("upload-form").style.display = "block";
  document.getElementById("camera-section").style.display = "none";

  // clear result when switching to upload mode
  document.getElementById("result").innerHTML = "";
}

// to show camera section and request camera access
async function showCamera() {
  document.getElementById("upload-form").style.display = "none";
  document.getElementById("camera-section").style.display = "block";

  // clear results when switching to camera mode
  document.getElementById("result").innerHTML = "";

  let video = document.getElementById("video");

  // one video stream active
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }

  try {
    // request camera access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    console.error("Camera access denied: ", error);
    alert("⚠️ Camera access was denied. Please allow it in browser settings.");
  }
}

// capture photo from video stream and send to backend
document.getElementById("capture-btn").addEventListener("click", function () {
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // draw the video frame on the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // convert canvas to image blob
  canvas.toBlob((blob) => {
    let formData = new FormData();
    formData.append("file", blob, "captured-image.png");

    // clear result before sending new image
    document.getElementById("result").innerHTML = "Processing...";

    fetch('/api/detect')
      .then(res => res.json())
      .then(data => console.log(data));

    // send captured image to backend
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          alert("Error: " + result.error);
          return;
        }

        document.getElementById("result").innerHTML = "";

        let img = document.createElement("img");
        img.src = result.output_path + "?t=" + new Date().getTime();
        img.alt = "Processed Image";
        img.width = 500;

        let faceCount = document.createElement("p");
        faceCount.innerHTML = `Number of faces detected: <strong>${result.num_faces}</strong>`;

        document.getElementById("result").appendChild(faceCount);
        document.getElementById("result").appendChild(img);
    })
    .catch((error) => console.error("Error:", error));
}, "image/png");
});
