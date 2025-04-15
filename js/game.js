import { getPokemon, createPokemonElement, evolutionPokemon } from './pokemon.js';
import { openPokedex } from './pokedex.js';
import { openShop } from './shop.js';
import { openBackpack, findItems, gainExp } from './backpack.js';
import { playerInfo } from './ash.js';
import { playMusic, playSound } from './music.js';

const gameContainer = document.querySelector(".game-container");
const top = document.querySelector(".top");
const message = document.querySelector(".message");
const bottom = document.querySelector(".bottom");
let isMenuDisplayed = false;
let firstClick = true;

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
            element.src = `assets/images/pokemon/color/${pokemon.id}.png`;
            containerStarter.appendChild(element);

            element.addEventListener("click", () => {
                let pokemondCall;
                
                if (pokemon.name.english === "Bulbasaur") {
                    pokemondCall = "assets/sounds/pokemon's call/bulbasaur.mp3";
                } else if (pokemon.name.english === "Charmander") {
                    pokemondCall = "assets/sounds/pokemon's call/charmander.mp3";
                } else if (pokemon.name.english === "Squirtle") {
                    pokemondCall = "assets/sounds/pokemon's call/squirtle.mp3";
                }
            
                const clickSound = new Audio(pokemondCall);
            
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

        const rulesMessage = document.createElement("p");
        rulesMessage.classList.add("box");
        rulesMessage.id = "rulesMessage";
        rulesMessage.innerHTML = `
            Click on ${chosenPokemon.name.english} to gain experience and on ${playerName} to gain 
            pokédollars.<br>
            Keep going to unlock surprises.<br><br>
            Ready? Let's go!
        `;
        message.appendChild(rulesMessage);

        play(chosenElement);
    });
}

function displayMenu() {
    const menu = document.createElement("section");
    menu.classList.add("menu");

    const shop = document.createElement("img");
    shop.classList.add("shop");
    shop.src = "assets/images/shop.png";
    shop.alt = "shop";
    shop.id = "shop";
    menu.appendChild(shop);

    const backpack = document.createElement("img");
    backpack.classList.add("backpack");
    backpack.src = "assets/images/backpack.png";
    backpack.alt = "backpack";
    backpack.id = "backpack";
    menu.appendChild(backpack);

    const pokedex = document.createElement("img");
    pokedex.classList.add("pokedex");
    pokedex.src = "assets/images/pokedex.png";
    pokedex.alt = "pokedex";
    pokedex.id = "pokedex";
    menu.appendChild(pokedex);

    const player = document.createElement("img");
    player.classList.add("player");
    player.src = "assets/images/player.png";
    player.alt = "player";
    player.id = "player";
    menu.appendChild(player);

    gameContainer.appendChild(menu);

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
    const randomLeft = (Math.random() * 30 - 15) + "%"; 
    pokedollarImg.style.left = `calc(50% + ${randomLeft})`;
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
    }, 1000);
}

export function updateExpBar() {
    const expBar = document.querySelector(".expBar");
    let expNivel = parseInt(localStorage.getItem("expNivel")) || 0;

    const maxExp = 100;
    const expPercentage = (expNivel / maxExp) * 100;
    if (expBar) {
        expBar.style.width = `${Math.min(expPercentage, 100)}%`;
    }
    localStorage.setItem("expNivel", expNivel);
}

function ashPlay(counter, expPoke) {  
    const ashElement = document.getElementById("ash");
    
    ashElement.addEventListener("click", () => {
        const rulesMessage = document.getElementById("rulesMessage");
        if (rulesMessage) {
            rulesMessage.remove();
        }
        playSound("assets/sounds/money.mp3", 0.6);

        updateExpBar();

        let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;

        if (JSON.parse(localStorage.getItem("doubleSpeed")) === true) {
            pokedollars += 2;
        } else {
            pokedollars++;
        }

        counter.textContent = `${pokedollars}₽`;
        localStorage.setItem("pokedollars", pokedollars);

        if (firstClick) {
            top.appendChild(expPoke);

            if (!isMenuDisplayed) {
                displayMenu();
                isMenuDisplayed = true;
            }
            
            firstClick = false;

            const itemsFinderActive = JSON.parse(localStorage.getItem("itemsFinderActive"));
            if (itemsFinderActive) {
                findItems();
            }
            const multiExpActive = JSON.parse(localStorage.getItem("multiExpActive"));
            if (multiExpActive) {
                gainExp();
            }
        }

        animatePokedollar();
    });
}

export function pokemonPlay(pokemonElement, counter, expPoke) {
    const menuExists =
    document.getElementById("shop") &&
    document.getElementById("backpack") &&
    document.getElementById("pokedex") &&
    document.getElementById("player");

    if (menuExists) {
        isMenuDisplayed = true;
    }

    pokemonElement.addEventListener("click", () => {
        const rulesMessage = document.getElementById("rulesMessage");
        if (rulesMessage) {
            rulesMessage.remove();
        }

        let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
        if (counter) { 
            counter.textContent = `${pokedollars}₽`;
        }

        let expNivel = parseInt(localStorage.getItem("expNivel")) || 0;
        if (expNivel <= 100) {
            if (JSON.parse(localStorage.getItem("doubleSpeed")) === true) {
                expNivel += 2;
            } else {
                expNivel++;
            }

            localStorage.setItem("expNivel", expNivel);
            updateExpBar();

            if (expNivel < 100) {
                playSound("assets/sounds/exp.mp3", 0.2);
            }
        }

        if (firstClick) {
            top.appendChild(expPoke);

            if (!isMenuDisplayed && !menuExists) {
                displayMenu();
                isMenuDisplayed = true;
            }

            firstClick = false;

            const itemsFinderActive = JSON.parse(localStorage.getItem("itemsFinderActive"));
            if (itemsFinderActive) {
                findItems();
            }
            const multiExpActive = JSON.parse(localStorage.getItem("multiExpActive"));
            if (multiExpActive) {
                gainExp();
            }
        }

        evolutionPokemon();
    });
}

export function play(pokemonElement) {
    const oldExpPoke = document.querySelector(".expPoke");
    if (oldExpPoke) {
        oldExpPoke.remove();
    }

    const expPoke = document.createElement("section");
    expPoke.classList.add("box", "expPoke");

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
    const expNivel = parseInt(localStorage.getItem("expNivel")) || 0;
    const maxExp = 100;
    const expPercentage = (expNivel / maxExp) * 100;
    expBar.style.width = `${Math.min(expPercentage, 100)}%`;

    expPoke.appendChild(counter);
    expPoke.appendChild(pokemonName);
    expPoke.appendChild(expContainer);
    
    ashPlay(counter, expPoke);
    pokemonPlay(pokemonElement, counter, expPoke);
}

startGame();
playMusic();