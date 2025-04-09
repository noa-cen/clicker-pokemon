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
            const pokemonWrapper = document.createElement("article");
            pokemonWrapper.classList.add("pokemonWrapper");

            const element = createPokemonElement(pokemon, "pokemonPokedex");
            const pokedexInfo = document.createElement("article");
            pokedexInfo.classList.add("pokedexInfo");
            const name = document.createElement("p");
            name.textContent = `${pokemon.number}: ${pokemon.name.english}`;
            name.classList.add("name");
            const type = document.createElement("p");
            type.textContent = `type: ${pokemon.type}`;

            pokedexInfo.appendChild(name);
            pokedexInfo.appendChild(type);
            pokemonWrapper.appendChild(element);
            pokemonWrapper.appendChild(pokedexInfo);
            pokedexModal.appendChild(pokemonWrapper);
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