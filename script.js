// ==== SAMPLE PLAYLIST ====
// Replace or add mp3 links (CORS-friendly). These sample links are public demo tracks.
const tracks = [
  {
    title: "Lofi Study Beat",
    artist: "Chillhop (sample)",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://i.imgur.com/7s9Y2vX.jpg"
  },
  {
    title: "Nightwalk",
    artist: "Sample Artist",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://i.imgur.com/Xq6x1sN.jpg"
  },
  {
    title: "Midnight Focus",
    artist: "Calm Studio",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://i.imgur.com/pY8rA6D.jpg"
  }
];

// ==== DOM elements ====
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverImg = document.getElementById("cover");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const trackListEl = document.getElementById("trackList");
const playlistEl = document.getElementById("playlist");
const togglePlaylistBtn = document.getElementById("togglePlaylist");

// timer elements
const countdownEl = document.getElementById("countdown");
const startTimerBtn = document.getElementById("startTimer");
const stopTimerBtn = document.getElementById("stopTimer");
const resetTimerBtn = document.getElementById("resetTimer");
const modeButtons = document.querySelectorAll(".mode");

let current = 0;
let isPlaying = false;

// Timer state (in seconds)
let timerMode = "work"; // work | short | long
const durations = { work: 25*60, short: 5*60, long: 15*60 };
let timerRemaining = durations.work;
let timerInterval = null;

// Initialize
function init() {
  renderPlaylist();
  loadTrack(current);
  audio.volume = parseFloat(volume.value);
  attachListeners();
  updateTimerDisplay();
}
function renderPlaylist(){
  trackListEl.innerHTML = "";
  tracks.forEach((t,i)=>{
    const li = document.createElement("li");
    li.innerHTML = `<div class="meta"><strong>${t.title}</strong><div style="color:#6b6b6b;font-size:0.9rem">${t.artist}</div></div>`;
    li.addEventListener("click", ()=> { current = i; loadTrack(current); playAudio(); highlightActive();});
    if(i===current) li.classList.add("active");
    trackListEl.appendChild(li);
  });
}
function highlightActive(){
  [...trackListEl.children].forEach((li,idx)=> {
    li.classList.toggle("active", idx===current);
  });
}

function loadTrack(index){
  const t = tracks[index];
  audio.src = t.src;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;
  coverImg.src = t.cover || "";
  // reset UI
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "--:--";
  highlightActive();
}

// Player controls
function playAudio(){
  audio.play().then(()=> {
    isPlaying = true;
    playBtn.textContent = "⏸";
  }).catch(e=> {
    console.error("Playback error:", e);
    isPlaying = false;
  });
}
function pauseAudio(){
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶️";
}
playBtn.addEventListener("click", ()=>{
  if(isPlaying) pauseAudio(); else playAudio();
});
prevBtn.addEventListener("click", ()=> {
  current = (current-1 + tracks.length) % tracks.length;
  loadTrack(current); playAudio();
});
nextBtn.addEventListener("click", ()=> {
  current = (current+1) % tracks.length;
  loadTrack(current); playAudio();
});

// progress and time updates
audio.addEventListener("loadedmetadata", ()=> {
  durationEl.textContent = formatTime(Math.floor(audio.duration));
  progress.max = Math.floor(audio.duration);
});
audio.addEventListener("timeupdate", ()=> {
  progress.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(Math.floor(audio.currentTime));
});
progress.addEventListener("input", ()=> {
  audio.currentTime = progress.value;
  currentTimeEl.textContent = formatTime(progress.value);
});
audio.addEventListener("ended", ()=> {
  nextBtn.click();
});

// volume
volume.addEventListener("input", ()=> {
  audio.volume = parseFloat(volume.value);
});

// playlist toggle
togglePlaylistBtn.addEventListener("click", ()=> {
  playlistEl.classList.toggle("hidden");
  togglePlaylistBtn.textContent = playlistEl.classList.contains("hidden") ? "📜 Playlist" : "✖ Close";
});

// helper
function formatTime(sec){
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec/60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2,"0")}`;
}

// ===== Timer Logic =====
function updateTimerDisplay(){
  countdownEl.textContent = formatTime(timerRemaining);
}
function startTimer(){
  if(timerInterval) return;
  timerInterval = setInterval(()=>{
    if(timerRemaining <= 0){
      clearInterval(timerInterval);
      timerInterval = null;
      // auto switch to next mode (optional)
      alert("Timer finished! Take a break or resume focus.");
      return;
    }
    timerRemaining--;
    updateTimerDisplay();
  },1000);
}
function stopTimer(){
  if(timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}
function resetTimer(){
  timerRemaining = durations[timerMode];
  updateTimerDisplay();
}
modeButtons.forEach(btn => btn.addEventListener("click", (e)=>{
  modeButtons.forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");
  timerMode = e.target.dataset.mode;
  timerRemaining = durations[timerMode];
  updateTimerDisplay();
}));

startTimerBtn.addEventListener("click", startTimer);
stopTimerBtn.addEventListener("click", stopTimer);
resetTimerBtn.addEventListener("click", resetTimer);

function attachListeners(){
  // allow spacebar to toggle play/pause when focused on body
  document.body.addEventListener("keydown", e=>{
    if(e.code === "Space"){ e.preventDefault(); if(isPlaying) pauseAudio(); else playAudio(); }
  });
}

init();
