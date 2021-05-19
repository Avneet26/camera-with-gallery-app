let videoElem = document.querySelector("video");
            let audioElem = document.querySelector("audio");
            let recordBtn = document.querySelector("button");
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
            let userMediaPromise =
                navigator.mediaDevices.getUserMedia(constraint);

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
                    recordBtn.innerText = "Recording....";
                } else {
                    //Stops the recording and fire onstop event
                    mediaRecObject.stop();
                    recordBtn.innerText = "Record";
                }
                isRecording = !isRecording;
            });