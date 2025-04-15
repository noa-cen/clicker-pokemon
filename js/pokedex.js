import { pokemonPlay, updateExpBar } from './game.js';
import { playSound } from './music.js';
import { getPokemon, createPokemonElement } from './pokemon.js';

const bottom = document.querySelector(".bottom");
const gameContainer = document.querySelector(".game-container");

export function openPokedex() {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const pokedexModal = document.createElement("section");
    pokedexModal.classList.add("modal", "box");
    pokedexModal.id = "pokedexModal";

    const pokedex = document.createElement("h2");
    pokedex.textContent = "pokédex";
    pokedexModal.appendChild(pokedex);

    getPokemon().then(pokemons => {
        pokemons.forEach(pokemon => {
            const pokemonWrapper = document.createElement("article");
            pokemonWrapper.classList.add("pokemonWrapper");

            const element = createPokemonElement(pokemon, "pokemonPokedex");
            const pokedexInfo = document.createElement("article");
            pokedexInfo.classList.add("pokedexInfo");
            const name = document.createElement("p");

            if (pokemon.id === 151) {
                name.textContent = `${pokemon.number}: ???`;
            } else {
                name.textContent = `${pokemon.number}: ${pokemon.name.english}`;
            }

            name.classList.add("name");
            const type = document.createElement("p");
            
            if (pokemon.id === 151) {
                type.textContent = "type: ???";
            } else {
                type.textContent = `type: ${pokemon.type}`;
            }
            
            pokedexInfo.appendChild(name);
            pokedexInfo.appendChild(type);
            pokemonWrapper.appendChild(element);
            pokemonWrapper.appendChild(pokedexInfo);
            pokedexModal.appendChild(pokemonWrapper);

            let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || [];
            const pokemonId = pokemon.id;
            if (pokemonsCaptured.includes(pokemonId)) {
                element.addEventListener("click", () => {
                    playSound(`assets/sounds/pokemon's call/${element.id}.mp3`);
                    changePokemon(pokemonId);
                });
            }
        });
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-modal");
    pokedexModal.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
        playSound("assets/sounds/click.mp3");
        overlay.remove();
    });

    overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

    overlay.appendChild(pokedexModal);
    gameContainer.appendChild(overlay);
}

function changePokemon(pokemonId) {
    localStorage.setItem("clickerId", pokemonId);
    const currentPokemon = document.querySelector(".pokemon");
    currentPokemon.remove();

    getPokemon().then(pokemons => {
        const newPokemon = pokemons.find(p => p.id === pokemonId);
        const newPokemonElement = createPokemonElement(newPokemon);
        localStorage.setItem("clickerId", pokemonId);
        bottom.appendChild(newPokemonElement);
        const pokemonName = document.querySelector(".pokemonName");
        pokemonName.textContent = newPokemon.name.english;
        pokemonPlay(newPokemonElement);
    });

    const overlay = document.querySelector(".modal-overlay");
    overlay.remove();
    localStorage.setItem("expNivel", 0);
    updateExpBar();
}