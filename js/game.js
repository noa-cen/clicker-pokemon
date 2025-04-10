import { getPokemon, createPokemonElement, evolutionPokemon } from './pokemon.js';
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
        playSound("assets/sounds/click.mp3");
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

function showStarterChoice() {
    document.querySelector("h1").style.display = "none";

    getPokemon().then(pokemons => {
        const containerStarter = document.createElement("section");
        containerStarter.classList.add("containerStarter");
        bottom.appendChild(containerStarter);

        const starters = ["Bulbasaur", "Charmander", "Squirtle"];
        starters.forEach(name => {
            const pokemon = pokemons.find(p => p.name.english === name);
            const element = createPokemonElement(pokemon);
            containerStarter.appendChild(element);

            element.addEventListener("click", () => {
                let pokemondSound;
                
                if (pokemon.name.english === "Bulbasaur") {
                    pokemondSound = "assets/sounds/bulbasaur.mp3";
                } else if (pokemon.name.english === "Charmander") {
                    pokemondSound = "assets/sounds/charmander.mp3";
                } else if (pokemon.name.english === "Squirtle") {
                    pokemondSound = "assets/sounds/squirtle.mp3";
                }
            
                const clickSound = new Audio(pokemondSound);
            
                clickSound.addEventListener("ended", () => {
                    let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || [];
                
                    if (!pokemonsCaptured.includes(pokemon.id)) {
                        pokemonsCaptured.push(pokemon.id);
                        localStorage.setItem("pokemons", JSON.stringify(pokemonsCaptured));
                        localStorage.setItem("clickerId", pokemonsCaptured);
                
                        element.src = `assets/images/pokemon/color/${pokemon.id}.png`;
                    }
                
                    rules();
                });
            
                clickSound.play();
            });                               
        });
    });
}

function rules() {
    document.querySelector("h1").style.display = "none";
    let hello = document.getElementById("hello");
    if (hello) {
        hello.remove();
    }

    const pokemonId = parseInt(localStorage.getItem("clickerId"));
    getPokemon().then(pokemons => {
        const chosenPokemon = pokemons.find(p => p.id === pokemonId);
        const playerName = localStorage.getItem("playerName");

        const starters = document.querySelectorAll(".pokemon");
        starters.forEach(p => p.remove());

        const chosenElement = createPokemonElement(chosenPokemon);

        const ashElement = document.createElement("img");
        ashElement.classList.add("ash");
        ashElement.src = "assets/images/ash.png";
        ashElement.alt = "Ash";
        ashElement.id = "ash";

        bottom.appendChild(ashElement);
        bottom.appendChild(chosenElement);

        let rulesMessage = document.createElement("p");
        rulesMessage.classList.add("box");
        rulesMessage.id = "rulesMessage";
        rulesMessage.innerHTML = `
            Click on ${chosenPokemon.name.english} to gain exp and on ${playerName} to gain 
            pokédollars.<br>
            Keep going to unlock surprises.<br><br>
            Ready? Let's go!
        `;
        message.appendChild(rulesMessage);

        play(ashElement, chosenElement);
    });
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

    const player = document.createElement("img");
    player.classList.add("player");
    player.src = "assets/images/player.png";
    player.alt = "player";
    player.id = "player";
    message.appendChild(player);

    pokedex.addEventListener('click', () => {
        playSound("assets/sounds/click.mp3");
        openPokedex();
    });
    shop.addEventListener('click', () => {
        playSound("assets/sounds/click.mp3");
        openShop();
    });
    backpack.addEventListener('click', () => {
        playSound("assets/sounds/click.mp3");
        openBackpack();
    });
    player.addEventListener('click', () => {
        playSound("assets/sounds/click.mp3");
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

export function play(ashElement, pokemonElement) {
    const expPoke = document.createElement("section");
    expPoke.classList.add("box");
    expPoke.classList.add("expPoke");

    const counter = document.createElement("p");
    counter.id = "pokedollars";

    const pokemonId = parseInt(localStorage.getItem("clickerId"));
    const pokemonName = document.createElement("h2");

    getPokemon().then(pokemons => {
        const pokemon = pokemons.find(p => p.id === pokemonId);
        pokemonName.classList.add("pokemonName");
        pokemonName.textContent = `${pokemon.name.english} :`;
    });

    const expContainer = document.createElement("section");
    expContainer.classList.add("expContainer");
    const expBar = document.createElement("article");
    expBar.classList.add("expBar");
    expContainer.appendChild(expBar);

    expPoke.appendChild(counter);
    expPoke.appendChild(pokemonName);
    expPoke.appendChild(expContainer);

    let expNivel = parseInt(localStorage.getItem("expNivel")) || 0;
    const maxExp = 100;
    const updateExpBar = () => {
        const expPercentage = (expNivel / maxExp) * 100;
        expBar.style.width = `${Math.min(expPercentage, 100)}%`;
        localStorage.setItem("expNivel", expNivel);
    };

    let firstClick = true;

    ashElement.addEventListener("click", () => {
        const rulesMessage = document.getElementById("rulesMessage");
        if (rulesMessage) {
            rulesMessage.remove();
        }
        playSound("assets/sounds/money.mp3");

        let expNivel = parseInt(localStorage.getItem("expNivel")) || 0;
        updateExpBar();

        let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
        counter.textContent = `${pokedollars}₽`;
        pokedollars++;
        counter.textContent = `${pokedollars}₽`;
        localStorage.setItem("pokedollars", pokedollars);

        if (firstClick) {
            top.appendChild(expPoke);
            displayMenu(message);
            firstClick = false;

            const itemsFinderActive = JSON.parse(localStorage.getItem("itemsFinderActive"));
            if (itemsFinderActive) {
                findItems();
            }
        }

        animatePokedollar();
    });

    pokemonElement.addEventListener("click", () => {
        const rulesMessage = document.getElementById("rulesMessage");
        if (rulesMessage) {
            rulesMessage.remove();
        }
        playSound("assets/sounds/exp.mp3");

        let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
        counter.textContent = `${pokedollars}₽`;

        expNivel++;
        updateExpBar();

        if (firstClick) {
            top.appendChild(expPoke);
            displayMenu(message);
            firstClick = false;
        }

        evolutionPokemon(ashElement, pokemonElement);
    });
}

startGame();
playMusic();