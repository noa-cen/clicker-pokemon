import { showStarterChoice, rules } from './pokemon.js';
import { openPokedex } from './pokedex.js';
import { openShop } from './shop.js';

const top = document.querySelector(".top");
const message = document.querySelector(".message");
const bottom = document.querySelector(".bottom");

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

    pokedex.addEventListener('click', openPokedex);
    shop.addEventListener('click', openShop);
}

function animatePokedollar() {
    const pokedollarImg = document.createElement("img");
    pokedollarImg.src = "assets/images/pokedollar.png";
    pokedollarImg.alt = "Pokédollar";
    pokedollarImg.classList.add("pokedollar-img");

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

export function play(pokemonClicker) {
    const counter = document.createElement("p");
    counter.classList.add("box");
    counter.id = "pokedollars";

    let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
    counter.textContent = `Pokédollars: ${pokedollars}₽`;

    let firstClick = true;

    pokemonClicker.addEventListener("click", () => {
        const rulesMessage = document.getElementById("rulesMessage");
        if (rulesMessage) {
            rulesMessage.remove();
        }
        const clickSound = new Audio("assets/sounds/money.mp3");
        clickSound.play();
        pokedollars++;
        counter.textContent = `Pokédollars: ${pokedollars}₽`;
        localStorage.setItem("pokedollars", pokedollars);

        if (firstClick) {
            top.appendChild(counter);
            displayMenu(message);
            firstClick = false;
        }

        animatePokedollar();
    });
}

startGame();
