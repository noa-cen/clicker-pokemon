import { getPokemon, createPokemonElement } from './pokemon.js';

const top = document.querySelector(".top");
const message = document.querySelector(".message");
const bottom = document.querySelector(".bottom");
const gameContainer = document.querySelector(".game-container");

export function openPokedex() {
    const pokedexModal = document.createElement("section");
    pokedexModal.classList.add("modal");
    pokedexModal.classList.add("box");

    getPokemon().then(pokemons => {
        pokemons.forEach(pokemon => {
            const element = createPokemonElement(pokemon);
            pokedexModal.appendChild(element);
        });
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-modal");
    pokedexModal.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
        pokedexModal.remove();
    });

    gameContainer.appendChild(pokedexModal);
}