import { play } from './game.js';

const top = document.querySelector(".top");
const message = document.querySelector(".message");
const bottom = document.querySelector(".bottom");

export async function getPokemon() {
    try {
        const response = await fetch('assets/pokemon.json');
        const pokemons = await response.json();
        return pokemons;
    } catch (error) {
        console.error("Error loading: ", error);
        return [];
    }
}

export function createPokemonElement(pokemon) {
    const pokemonElement = document.createElement("img");
    pokemonElement.classList.add("pokemon");
    pokemonElement.src = pokemon.image;
    pokemonElement.alt = pokemon.name.english;
    pokemonElement.id = `${pokemon.name.english.toLowerCase()}`;
    return pokemonElement;
}

export function showStarterChoice(gameContainer) {
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
                localStorage.setItem("starter", element.id);
                rules(element.id);
            });
        });
    });
}

export function rules(starter) {
    document.querySelector("h1").style.display = "none";
    let hello = document.getElementById("hello");
    if (hello) {
        hello.remove();
    }

    getPokemon().then(pokemons => {
        const chosenPokemon = pokemons.find(p => p.name.english.toLowerCase() === starter.toLowerCase());

        const starters = document.querySelectorAll(".pokemon");
        starters.forEach(p => p.remove());
        document.querySelector("h1").style.display = "none";

        const counter = document.createElement("p");
        counter.classList.add("box");
        counter.id = "pokedollars";

        const chosenElement = createPokemonElement(chosenPokemon);
        bottom.appendChild(chosenElement);

        let rulesMessage = document.createElement("p");
        rulesMessage.classList.add("box");
        rulesMessage.id = "rulesMessage";
        rulesMessage.innerHTML = `
            Click on ${chosenPokemon.name.english} to gain Pokédollars. 
            Keep going to unlock surprises.<br><br>
            Ready? Let's go!
        `;

        message.appendChild(rulesMessage);

        play(chosenElement);
    });
}