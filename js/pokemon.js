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
        gameContainer.appendChild(containerStarter);

        const starters = ["Bulbasaur", "Charmander", "Squirtle"];
        starters.forEach(name => {
            const pokemon = pokemons.find(p => p.name.english === name);
            const element = createPokemonElement(pokemon);
            containerStarter.appendChild(element);

            element.addEventListener("click", () => {
                localStorage.setItem("starter", element.id);
                play(element.id, gameContainer);
            });
        });
    });
}

export function play(starter, gameContainer) {
    getPokemon().then(pokemons => {
        const chosenPokemon = pokemons.find(p => p.name.english.toLowerCase() === starter.toLowerCase());

        const starters = document.querySelectorAll(".pokemon");
        starters.forEach(p => p.remove());

        let containerStarter = document.querySelector(".containerStarter");

        if (!containerStarter) {
            containerStarter = document.createElement("section");
            containerStarter.classList.add("containerStarter");
            gameContainer.appendChild(containerStarter);
        }

        const chosenElement = createPokemonElement(chosenPokemon);
        containerStarter.appendChild(chosenElement);

        const rulesMessage = document.querySelector(".box");
        document.querySelector(".box").style.top = "100px";
        document.querySelector(".containerStarter").style.top = "342px";
        rulesMessage.innerHTML = `
            Click on ${chosenPokemon.name.english} to make it stronger. 
            Each click helps it evolve. Keep going to unlock surprises.<br>
            Ready? Let's go!
        `;
    });
}