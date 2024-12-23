const myImage = new Image(300, 300);
const primaryImage = document.getElementById("img1");
const backgroundImage = document.getElementById("img2");
const text = document.getElementById("metadata");

const song = document.getElementById("song");
const artist = document.getElementById("artist");
let currentSong = {
  name: "",
  artist: "",
  cover: "",
};

let initLoad = true;
let prevsURL = 0;

myImage.onload = () => {
  handleChangeSong();
};

const getUserRecent = async (user) => {
  URL = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=b956d838d88dca005908329670ad0f3c&limit=1&format=json`;
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error("could not fetch");
    }

    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

const handleRefreshDisplay = async () => {
  const data = await getUserRecent("onofel");
  const URL = data.recenttracks.track[0].url;

  console.log(URL);
  // check if it is the same song
  if (prevsURL == URL) return;
  prevsURL = URL; // set as new prevs

  const songName = data.recenttracks.track[0].name;
  const artistName = data.recenttracks.track[0].artist["#text"];
  const cover = data.recenttracks.track[0].image[3]["#text"];

  currentSong = { song: songName, artist: artistName, cover: cover };

  //   console.log(cover);
  myImage.src = currentSong.cover;
};

// const changeSongLabel = (songname, artistname) => {
//       song.innerText = songname;
//   artist.innerText = artistname;
// };

const handleChangeSong = () => {
  const { song: songname, artist: artistname, cover } = currentSong;

  handleAnimationFadeOut();
  setTimeout(
    () => {
      initLoad = false;
      song.innerText = songname;
      artist.innerText = artistname;
      handleAnimationFadeIn();

      song.innerText = songname;
      artist.innerText = artistname;
      primaryImage.src = cover;
      backgroundImage.src = cover;
    },
    initLoad ? 0 : 1500
  );
};

const initialAnimation = () => {
  primaryImage.classList.add("fade-in-1");
  backgroundImage.classList.add("fade-in-3");
};

const handleAnimationFadeOut = () => {
  primaryImage.classList.remove("fade-in-1");
  text.classList.remove("fade-in-2");
  backgroundImage.classList.remove("fade-in-3");

  primaryImage.classList.add("fade-out");
  backgroundImage.classList.add("fade-out");
  text.classList.add("fade-out");
};

const handleAnimationFadeIn = () => {
  text.classList.remove("fade-out");
  primaryImage.classList.remove("fade-out");
  backgroundImage.classList.remove("fade-out");

  text.classList.add("fade-in-2");
  primaryImage.classList.add("fade-in-1");
  backgroundImage.classList.add("fade-in-3");
};

const main = () => {
  initialAnimation();
  handleRefreshDisplay();
  setInterval(() => {
    console.log("fetching");
    handleRefreshDisplay();
  }, 3000);
};

main();
