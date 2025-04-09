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

export function createPokemonElement(pokemon, className = "pokemon") {
    const pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || [];
    const hasPokemon = pokemonsCaptured.includes(pokemon.id);

    const pokemonElement = document.createElement("img");
    pokemonElement.classList.add(className);
    pokemonElement.alt = pokemon.name.english;
    pokemonElement.id = `${pokemon.name.english.toLowerCase()}`;

    pokemonElement.src = hasPokemon
        ? `assets/images/pokemon/color/${pokemon.id}.png`
        : pokemon.image;

    return pokemonElement;
}

export function showStarterChoice() {
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
                let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || [];
            
                if (!pokemonsCaptured.includes(pokemon.id)) {
                    pokemonsCaptured.push(pokemon.id);
                    localStorage.setItem("pokemons", JSON.stringify(pokemonsCaptured));
            
                    element.src = `assets/images/pokemon/color/${pokemon.id}.png`;
                }
            
                rules(pokemon.id);
            });                     
        });
    });
}

export function rules(pokemon) {
    document.querySelector("h1").style.display = "none";
    let hello = document.getElementById("hello");
    if (hello) {
        hello.remove();
    }

    getPokemon().then(pokemons => {
        const chosenPokemon = pokemons.find(p => p.id === Number(pokemon));

        const starters = document.querySelectorAll(".pokemon");
        starters.forEach(p => p.remove());

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