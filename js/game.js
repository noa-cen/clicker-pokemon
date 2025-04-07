import { showStarterChoice, play } from './pokemon.js';

const gameContainer = document.querySelector(".game-container");

function startGame() {
    const starter = localStorage.getItem("starter");

    if (starter) {
        play(starter, gameContainer);
    } else {
        const box = document.createElement("article");
        box.id = "question";
        box.classList.add("box");
        gameContainer.appendChild(box);

        const question = document.createElement("p");
        question.textContent = "What's your name ?";
        box.appendChild(question);

        const inputContainer = document.createElement("article");
        inputContainer.classList.add("container");
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
        gameContainer.appendChild(professorOak);

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
    gameContainer.removeChild(question);
    gameContainer.removeChild(professor);

    const hello = document.createElement("p");
    hello.classList.add("box");
    hello.innerHTML = `Hello ${playerName},<br> let's choose your starter.`;
    gameContainer.appendChild(hello);

    showStarterChoice(gameContainer);
}

startGame();