const cat = document.getElementById("billi");
const music = document.getElementById("music");

cat.addEventListener("click", () => {
  music.currentTime = 0.5; // start from desired second
  music.play();
});