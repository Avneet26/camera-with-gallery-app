let videoElem = document.querySelector("video");
let audioElem = document.querySelector("audio");
let recordBtn = document.querySelector(".recordBtn");
let clickbtn = document.querySelector(".clickBtn");
let filterTypes = document.querySelectorAll(".filter-type");
let filter = document.querySelector(".filter");
let timings = document.querySelector(".timer");
let recordAnim = document.querySelector(".red-record");
let zoomin = document.querySelector(".zoomin");
let zoomout = document.querySelector(".zoomout");
let scaleLevel = 1;
let filterColor = "";
let counter = 0;
let stopTimer = 0;
//State of recording
let isRecording = false;

//Recording array which stores the video in parts
let recording = [];
let constraint = {
    audio: false,
    video: true,
};
let mediaRecObject;

//Here the navigator asks for permission to use camera and mic
let userMediaPromise = navigator.mediaDevices.getUserMedia(constraint);

//If the user grants permission then the promise gets resolved
//and media stream starts coming
userMediaPromise
    .then(function (stream) {
        videoElem.srcObject = stream;
        audioElem.srcObject = stream;

        //create object of Mediarecorder
        mediaRecObject = new MediaRecorder(stream);

        //when start() is invoked then ondataavailable event is fired and data
        //starts to get push in the recording array
        mediaRecObject.ondataavailable = function (e) {
            recording.push(e.data);
        };

        //when stop() function is invoked then onstop event gets fired
        mediaRecObject.onstop = function () {
            // recording array is converted into video type
            const blob = new Blob(recording, { type: "video/mp4" });
            const url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.download = "file.mp4";
            a.href = url;
            a.click();
            recording = [];
        };
    })
    //If permissoin is not granted for camera then this catch is invoked
    .catch(function (err) {
        alert("allow please !!!");
    });

recordBtn.addEventListener("click", function () {
    if (mediaRecObject == undefined) {
        alert("Select the source");
    }
    if (isRecording == false) {
        //Starts the recording and fire ondataavailable event
        mediaRecObject.start();
        startTimer();
        recordAnim.classList.add("record-anim");
    } else {
        //Stops the recording and fire onstop event
        mediaRecObject.stop();
        stopTiming();
        recordAnim.classList.remove("record-anim");
    }
    isRecording = !isRecording;
});

clickbtn.addEventListener("click", function () {
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    let tool = canvas.getContext("2d");

    var x = (tool.canvas.width / scaleLevel - videoElem.videoWidth) / 2;
    var y = (tool.canvas.height / scaleLevel - videoElem.videoHeight) / 2;

    tool.drawImage(videoElem, x, y);
    if (filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.download = "file.png";
    a.href = url;
    a.click();
    a.remove();
});

for (let i = 0; i < filterTypes.length; i++) {
    filterTypes[i].addEventListener("click", function () {
        filterColor = filterTypes[i].style.backgroundColor;
        filter.style.backgroundColor = filterColor;
    });
}

function startTimer() {
    timings.style.display = "block";
    counter = 1;
    function fn() {
        let hours = Number.parseInt(counter / 3600);
        let remSeconds = counter % 3600;
        let mins = Number.parseInt(remSeconds / 60);
        let seconds = Number.parseInt(remSeconds % 60);
        hours = hours < 10 ? `0${hours}` : hours;
        mins = mins < 10 ? `0${mins}` : mins;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        timings.innerText = `${hours}:${mins}:${seconds}`;
        counter++;
    }
    stopTimer = setInterval(fn, 1000);
}
function stopTiming() {
    timings.style.display = "none";
    clearInterval(stopTimer);
}

zoomin.addEventListener("click", function () {
    if (scaleLevel < 1.7) {
        scaleLevel = scaleLevel + 0.1;
        videoElem.style.transform = `scale(${scaleLevel})`;
    }
});

zoomout.addEventListener("click", function () {
    if (scaleLevel >= 1) {
        scaleLevel = scaleLevel - 0.1;
        videoElem.style.transform = `scale(${scaleLevel})`;
    }
});
