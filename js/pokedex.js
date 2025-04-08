import { getPokemon, createPokemonElement } from './pokemon.js';

const top = document.querySelector(".top");
const message = document.querySelector(".message");
const bottom = document.querySelector(".bottom");

export function openPokedex() {
    getPokemon().then(pokemons => {
        const pokedexContainer = document.createElement("section");
        pokedexContainer.classList.add("pokedexContainer");
        message.appendChild(pokedexContainer);

        pokemons.forEach(pokemon => {
            const element = createPokemonElement(pokemon);
            pokedexContainer.appendChild(element);
        });
    });
}