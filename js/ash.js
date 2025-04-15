import { playSound } from './music.js';
import { pauseIntervals } from './backpack.js';

const gameContainer = document.querySelector(".game-container");

export function playerInfo() {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const playerModal = document.createElement("section");
    playerModal.classList.add("modal", "playerModal", "box");

    const playerName = localStorage.getItem("playerName");
    const name = document.createElement("h2");
    name.textContent = playerName;
    playerModal.appendChild(name);

    const currentPokedollars = localStorage.getItem("pokedollars")|| 0;;
    const counter = document.createElement("p");
    counter.classList.add("playerInfo");
    counter.textContent = `pokédollars: ${currentPokedollars}₽`;
    playerModal.appendChild(counter);

    let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || [];
    const pokemonCount = pokemonsCaptured.length || 1;
    const pokedex = document.createElement("p");
    pokedex.classList.add("playerInfo");
    pokedex.textContent = `pokédex: ${pokemonCount}`;
    playerModal.appendChild(pokedex);

    const playerLevelValue = Math.floor((pokemonCount / 151) * 100);
    const playerLevel = document.createElement("p");
    playerLevel.classList.add("playerInfo");
    playerLevel.textContent = `level: ${playerLevelValue}`;
    localStorage.setItem("playerLevel", playerLevelValue);
    playerModal.appendChild(playerLevel);

    const resetAll = document.createElement("button");
    resetAll.textContent = "reset all";
    resetAll.classList.add("reset");

    resetAll.addEventListener("click", () => {
        const blackOverlay = document.createElement("div");
        blackOverlay.id = "blackOverlay";
        document.body.appendChild(blackOverlay);

        const clickSound = new Audio("assets/sounds/gameOver.mp3");

        clickSound.play().then(() => {
            setTimeout(() => {
                blackOverlay.style.opacity = 1;
            }, 0);

            clickSound.addEventListener("ended", () => {
                pauseIntervals();
                localStorage.clear();
                location.reload();
            });
        });
    });

    playerModal.appendChild(resetAll);

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-modal");
    playerModal.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
        playSound("assets/sounds/click.mp3");
        overlay.remove();
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    overlay.appendChild(playerModal);
    gameContainer.appendChild(overlay);
}