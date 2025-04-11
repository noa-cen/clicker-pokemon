const top = document.querySelector(".top");

export function playMusic() {
    const mediaPlayer = document.createElement("section");
    mediaPlayer.classList.add("mediaPlayer");

    const backwardBtn = document.createElement("p");
    backwardBtn.innerHTML = '<i class="fa-solid fa-backward"></i>';
    backwardBtn.classList.add("mediaPlayerBtn");
    const playPauseBtn = document.createElement("p");
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playPauseBtn.classList.add("mediaPlayerBtn");
    const forwardBtn = document.createElement("p");
    forwardBtn.innerHTML = '<i class="fa-solid fa-forward"></i>';
    forwardBtn.classList.add("mediaPlayerBtn");
    const muteBtn = document.createElement("p");
    muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    muteBtn.classList.add("mediaPlayerBtn");

    mediaPlayer.appendChild(backwardBtn);
    mediaPlayer.appendChild(playPauseBtn);
    mediaPlayer.appendChild(forwardBtn);
    mediaPlayer.appendChild(muteBtn);

    const playlist = [
        "assets/sounds/01 Opening (part 1).mp3",
        "assets/sounds/02 Opening (part 2).mp3",
        "assets/sounds/03 To Bill's Origin ~ From Cerulean.mp3",
        "assets/sounds/04 Pallet Town's Theme.mp3",
        "assets/sounds/05 Pokemon Center.mp3",
        "assets/sounds/06 Pokemon Gym.mp3",
        "assets/sounds/07 Pewter City's Theme.mp3",
        "assets/sounds/08 Cerulean City's Theme.mp3",
        "assets/sounds/09 Celadon City's Theme.mp3",
        "assets/sounds/10 Cinnabar Island's Theme.mp3",
        "assets/sounds/11 Vermilion City's Theme.mp3",
        "assets/sounds/12 Lavender Town's Theme.mp3",
        "assets/sounds/18 The Road to Viridian City ~ from Pallet.mp3",
        "assets/sounds/19 The Road to Cerulean ~ from Mt. Moon.mp3",
        "assets/sounds/20 The Road to Lavender Town ~ from Vermilion.mp3",
        "assets/sounds/21 The Last Road.mp3"
    ];

    let currentTrack = 0;
    let isPlaying = false;
    let isMuted = JSON.parse(localStorage.getItem("mute")) || false;

    let music = new Audio(playlist[currentTrack]);
    music.volume = isMuted ? 0 : 1;

    function updateMuteIcon() {
        muteBtn.innerHTML = isMuted
            ? '<i class="fa-solid fa-volume-xmark"></i>'
            : '<i class="fa-solid fa-volume-high"></i>';
    }

    function playTrack(index) {
        if (music) {
            music.pause();
        }
        currentTrack = (index + playlist.length) % playlist.length;
        music = new Audio(playlist[currentTrack]);
        music.volume = isMuted ? 0 : 1;
        music.addEventListener("ended", playNextTrack);
        music.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }

    function playPreviousTrack() {
        playTrack(currentTrack - 1);
    }

    function playNextTrack() {
        playTrack(currentTrack + 1);
    }

    backwardBtn.addEventListener("click", playPreviousTrack);
    forwardBtn.addEventListener("click", playNextTrack);

    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) {
            music.pause();
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        } else {
            music.play();
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    });

    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        localStorage.setItem("mute", JSON.stringify(isMuted));
        music.volume = isMuted ? 0 : 1;
        updateMuteIcon();
    });

    updateMuteIcon();
    
    top.appendChild(mediaPlayer);
}

export function playSound(src, volume = 1) {
    const isMuted = JSON.parse(localStorage.getItem("mute")) || false;
    if (!isMuted) {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.play().catch(() => {});
    }
}