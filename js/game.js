import { showStarterChoice, rules } from './pokemon.js';
import { openPokedex } from './pokedex.js';
import { openShop } from './shop.js';
import { openBackpack, findItems } from './backpack.js';
import { playerInfo } from './ash.js';

const top = document.querySelector(".top");
const message = document.querySelector(".message");
const bottom = document.querySelector(".bottom");
const gameContainer = document.querySelector(".game-container");

function startGame() {
    const pokemons = JSON.parse(localStorage.getItem("pokemons") || "[]");

        if (pokemons.length > 0) {
            rules(pokemons[0]);
        } else {
        const box = document.createElement("article");
        box.id = "question";
        box.classList.add("box");
        message.appendChild(box);

        const question = document.createElement("p");
        question.textContent = "What's your name ?";
        box.appendChild(question);

        const inputContainer = document.createElement("article");
        inputContainer.classList.add("inputContainer");
        box.appendChild(inputContainer);

        const inputName = document.createElement("input");
        inputName.type = "text";
        inputName.id = "name";
        inputName.classList.add("input");
        const btnSubmit = document.createElement("button");
        btnSubmit.type = "submit";
        btnSubmit.classList.add("btnSubmit");
        btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i>';
        inputContainer.appendChild(inputName);
        inputContainer.appendChild(btnSubmit);

        const professorOak = document.createElement("img");
        professorOak.src = "assets/images/professorOak.png";
        professorOak.classList.add("professor");
        bottom.appendChild(professorOak);

        const playerName = localStorage.getItem("playerName");

        if (playerName) {
            chooseStarter(playerName);
        } else {
            askName();
        }
    }
}

function askName() {
    const inputName = document.querySelector(".input");
    const btnSubmit = document.querySelector(".btnSubmit");

    btnSubmit.addEventListener("click", function() {
        const playerName = inputName.value;
        localStorage.setItem("playerName", playerName);
        chooseStarter(playerName);
    });
}

function chooseStarter(playerName) {
    const question = document.getElementById("question");
    const professor = document.querySelector(".professor");
    message.removeChild(question);
    bottom.removeChild(professor);

    const hello = document.createElement("p");
    hello.classList.add("box");
    hello.id = "hello";
    hello.innerHTML = `Hello ${playerName},<br> let's choose your starter.`;
    message.appendChild(hello);

    showStarterChoice(message);
}

function displayMenu(message) {
    const shop = document.createElement("img");
    shop.classList.add("shop");
    shop.src = "assets/images/shop.png";
    shop.alt = "shop";
    shop.id = "shop";
    message.appendChild(shop);

    const backpack = document.createElement("img");
    backpack.classList.add("backpack");
    backpack.src = "assets/images/backpack.png";
    backpack.alt = "backpack";
    backpack.id = "backpack";
    message.appendChild(backpack);

    const pokedex = document.createElement("img");
    pokedex.classList.add("pokedex");
    pokedex.src = "assets/images/pokedex.png";
    pokedex.alt = "pokedex";
    pokedex.id = "pokedex";
    message.appendChild(pokedex);

    const ash = document.createElement("img");
    ash.classList.add("ash");
    ash.src = "assets/images/ash.png";
    ash.alt = "ash";
    ash.id = "ash";
    message.appendChild(ash);

    pokedex.addEventListener('click', () => {
        const clickSound = new Audio("assets/sounds/click.mp3");
        clickSound.play();
        openPokedex();
    });
    shop.addEventListener('click', () => {
        const clickSound = new Audio("assets/sounds/click.mp3");
        clickSound.play();
        openShop();
    });
    backpack.addEventListener('click', () => {
        const clickSound = new Audio("assets/sounds/click.mp3");
        clickSound.play();
        openBackpack();
    });
    ash.addEventListener('click', () => {
        const clickSound = new Audio("assets/sounds/click.mp3");
        clickSound.play();
        playerInfo();
    });
}

export function animatePokedollar(item = "pokedollar") {
    const imageSrc = item === "pokedollar" ? "assets/images/pokedollar.png" : item.image;
    const altText = item === "pokedollar" ? "Pokédollar" : item.name;
    const classItem = item === "pokedollar" ? "pokedollar-img" : "item-img";

    const pokedollarImg = document.createElement("img");
    pokedollarImg.src = imageSrc;
    pokedollarImg.alt = altText;
    pokedollarImg.classList.add(classItem);

    pokedollarImg.style.position = "absolute";
    const randomLeft = Math.random() * (245 - 30) + 30;
    pokedollarImg.style.left = `${randomLeft}px`;
    pokedollarImg.style.top = `75px`;
    pokedollarImg.style.transform = "translateY(-75px)";
    pokedollarImg.style.transition = "transform 0.5s ease, opacity 0.5s ease";
    top.appendChild(pokedollarImg);

    setTimeout(() => {
        pokedollarImg.style.transform = "scale(1)";
        pokedollarImg.style.opacity = "0";
    }, 10);

    setTimeout(() => {
        pokedollarImg.remove();
    }, 500);
}

function playMusic() {
    const mediaPlayer = document.createElement("section");
    mediaPlayer.classList.add("mediaPlayer");

    const backwardBtn = document.createElement("p");
    backwardBtn.innerHTML = '<i class="fa-solid fa-backward"></i>';
    backwardBtn.classList.add("mediaPlayerBtn");
    const playPauseBtn = document.createElement("p");
    playPauseBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    playPauseBtn.classList.add("mediaPlayerBtn");
    const forwardBtn = document.createElement("p");
    forwardBtn.innerHTML = '<i class="fa-solid fa-forward"></i>';
    forwardBtn.classList.add("mediaPlayerBtn");

    mediaPlayer.appendChild(backwardBtn);
    mediaPlayer.appendChild(playPauseBtn);
    mediaPlayer.appendChild(forwardBtn);

    const playlist = [
        "assets/sounds/01 Opening (part 1).mp3",
        "assets/sounds/02 Opening (part 2).mp3",
        "assets/sounds/03 To Bill's Origin ~ From Cerulean.mp3",
        "assets/sounds/04 Pallet Town's Theme.mp3",
        "assets/sounds/05 Pokemon Center.mp3",
        "assets/sounds/06 Pokemon Gym.mp3"
    ];

    let currentTrack = 0;
    let isPlaying = false;
    let music = new Audio(playlist[currentTrack]);

    function playPreviousTrack() {
        if (music) {
            music.pause();
            music.currentTime = 0;
        }

        currentTrack = (currentTrack - 1) % playlist.length;
        music = new Audio(playlist[currentTrack]);
        music.play();
    }

    function playNextTrack() {
        if (music) {
            music.pause();
            music.currentTime = 0;
        }
        
        currentTrack = (currentTrack + 1) % playlist.length;
        music = new Audio(playlist[currentTrack]);
        music.addEventListener("ended", playNextTrack);
        music.play();
    }

    backwardBtn.addEventListener("click", () => {
        playPreviousTrack();
    });

    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) {
            music.pause();
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
            music.play();
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';

            music.addEventListener("ended", playNextTrack);
        }
    });

    forwardBtn.addEventListener("click", () => {
        playNextTrack();
    });

    top.appendChild(mediaPlayer);
}

export function play(pokemonClicker) {
    const counter = document.createElement("p");
    counter.classList.add("box");
    counter.id = "pokedollars";

    let firstClick = true;

    pokemonClicker.addEventListener("click", () => {
        const rulesMessage = document.getElementById("rulesMessage");
        if (rulesMessage) {
            rulesMessage.remove();
        }
        const clickSound = new Audio("assets/sounds/money.mp3");
        clickSound.play();

        let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
        counter.textContent = `Pokédollars: ${pokedollars}₽`;
        pokedollars++;
        counter.textContent = `Pokédollars: ${pokedollars}₽`;
        localStorage.setItem("pokedollars", pokedollars);

        if (firstClick) {
            top.appendChild(counter);
            displayMenu(message);
            firstClick = false;

            const itemsFinderActive = JSON.parse(localStorage.getItem("itemsFinderActive"));
            if (itemsFinderActive) {
                findItems();
            }
        }

        animatePokedollar();
    });
}

startGame();
playMusic();