const audio = document.getElementById("audio");
const title = document.getElementById("track-title");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const tracks = [
  { title: "Lofi Study Beat", src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_cba55b76d9.mp3?filename=lofi-study-112191.mp3" },
  { title: "Midnight Jazz Chill", src: "https://cdn.pixabay.com/download/audio/2021/09/01/audio_3c5e3f8f07.mp3?filename=lofi-hip-hop-1096.mp3" },
  { title: "Rainy Day Vibes", src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_36d6b7eb23.mp3?filename=lofi-relaxing-112191.mp3" }
];

let currentTrack = 0;

function loadTrack(index) {
  const track = tracks[index];
  title.textContent = track.title;
  audio.src = track.src;
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
});

nextBtn.addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
});

prevBtn.addEventListener("click", () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
});

loadTrack(currentTrack);

// TIMER SECTION
let timer;
let timeLeft = 25 * 60;
const timeDisplay = document.getElementById("time");
const startTimerBtn = document.getElementById("start-timer");
const resetTimerBtn = document.getElementById("reset-timer");

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

startTimerBtn.addEventListener("click", () => {
  if (timer) return;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      timer = null;
      alert("Focus session complete! ✨");
    }
  }, 1000);
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  timeLeft = 25 * 60;
  updateTimerDisplay();
});

updateTimerDisplay();
