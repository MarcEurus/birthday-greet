document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const startScreen = document.getElementById("startScreen");

  startButton.addEventListener("click", function () {
    startScreen.style.display = "none";

    const birthdayAudio = new Audio("birthday.mp3");
    birthdayAudio.loop = true;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;

          const candle = document.querySelector(".candle");

          function isBlowing() {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);
            let sum = dataArray.reduce((a, b) => a + b, 0);
            return (sum / bufferLength) > 40;
          }

          function blowOutCandle() {
            if (isBlowing() && !candle.classList.contains("out")) {
              candle.classList.add("out");
              const flame = candle.querySelector(".flame");
              if (flame) flame.style.display = "none";
              birthdayAudio.play().catch(console.error);

              setTimeout(() => {
                document.getElementById("birthdayMessage").classList.remove("hidden");
                document.getElementById("birthdayMessage").classList.add("visible");
              }, 500);
            }
          }

          setInterval(blowOutCandle, 200);
        })
        .catch(err => console.log("Microphone error:", err));
    }
  });

  // ✅ Close modal and update instruction after it's visible
  const closeBtn = document.getElementById("closeMessage");
  const modal = document.getElementById("birthdayMessage");
  const instructionText = document.getElementById("instruction-text");

  closeBtn.addEventListener("click", function () {
    modal.classList.remove("visible");
    modal.classList.add("hidden");

    instructionText.innerHTML = "<p>🎂 Happy 19th Birthday Bubby! 🎂</p>";
  });
});