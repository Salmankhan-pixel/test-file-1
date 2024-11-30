let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function GetSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let A = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < A.length; index++) {
    const element = A[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  let SongUl = document
    .querySelector(".library-slots")
    .getElementsByTagName("ul")[0];
  SongUl.innerHTML = "";
  for (const song of songs) {
    SongUl.innerHTML =
      SongUl.innerHTML +
      `<li><img class="invert Music-logo-library" src="./icons/music.logo.svg"
alt="music logo"/>
<div class="info">
<div class="song-name-info">${song.replaceAll("%20", " ")}</div>
<div class="song-info-dis">Unknown Artist</div>
</div>
<img class="invert plAY-library" src="./icons/play.svg" alt="play" />
</li>`;
  }
  Array.from(
    document.querySelector(".library-slots").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
}
const playMusic = (audioTrack, pause = false) => {
  if (!audioTrack) return;

  currentSong.src = `/${currFolder}/` + audioTrack;
  if (!pause) {
    currentSong.play();
    play.src = "./icons/pause.svg";
  } else {
    play.src = "./icons/play.svg";
  }
  document.querySelector(".SongInfo").innerHTML = decodeURI(audioTrack);
  document.querySelector(".SongTime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  console.log("displaying albums");
  let a = await fetch(`songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".card-container");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("songs/") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];
      // Get the metadata of the folder
      let a = await fetch(`/songs/`);
      let response = [];
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`;
    }
  }
}
displayAlbums();
async function main() {
  await GetSongs("songs/");
  playMusic(songs[0], true);
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./icons/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./icons/play.svg";
    }
    currentSong.addEventListener("timeupdate", () => {
      document.querySelector(
        ".SongTime"
      ).innerHTML = `${secondsToMinutesSeconds(
        currentSong.currentTime
      )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
      document.querySelector(".circle").style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
    document.querySelector(".seekbar").addEventListener("click", (e) => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left =
        (e.offsetX / e.target.getBoundingClientRect().width) * percent + "%";
      currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
  });
  document.querySelector(".Menu").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length - 0) {
      playMusic(songs[index + 1]);
    }
  });
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });
}

main();
