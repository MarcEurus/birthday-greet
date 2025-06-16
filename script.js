document.addEventListener("DOMContentLoaded", function () {
  // Close button handler for fading out popup
  const closeBtn = document.getElementById("closeMessage");
  const modal = document.getElementById("birthdayMessage");
  const instructionText = document.getElementById("instruction-text");

  closeBtn.addEventListener("click", function () {
  modal.classList.remove("visible");
  modal.classList.add("hidden");
    instructionText.innerHTML = "<p class='fade-in'>🎂 Happy 19th Birthday Bubby! 🎂</p>";
    });
  
  const candle = document.querySelector(".candle");

  let audioContext;
  let analyser;
  let microphone;

  const birthdayAudio = new Audio("birthday.mp3");
  birthdayAudio.preload = "auto";
  birthdayAudio.loop = true;

  

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }

    let average = sum / bufferLength;
    return average > 40; // Adjust this threshold if needed
  }

  function blowOutCandle() {
    if (isBlowing()) {
      if (!candle.classList.contains("out")) {
        candle.classList.add("out"); // Add "out" class to indicate it's blown out
        const flame = candle.querySelector(".flame");
        if (flame) flame.style.display = "none"; // Hide the flame visually

        birthdayAudio.play().catch(err => {
            console.log("Audio play failed:", err);            
        });

        // Delay showing the birthday message by 3 seconds (3000 ms)
        setTimeout(() => {
        const message = document.getElementById("birthdayMessage");
        message.classList.remove("hidden");
        message.classList.add("visible");
        }, 500);
      }
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandle, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});