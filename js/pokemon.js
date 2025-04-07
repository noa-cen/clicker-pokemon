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
                rules(element.id, gameContainer);
            });
        });
    });
}

export function rules(starter, gameContainer) {
    let hello = document.getElementById("hello");
    if (hello) {
        hello.remove();
    }

    getPokemon().then(pokemons => {
        const chosenPokemon = pokemons.find(p => p.name.english.toLowerCase() === starter.toLowerCase());

        const starters = document.querySelectorAll(".pokemon");
        starters.forEach(p => p.remove());
        document.querySelector("h1").style.display = "none";
        
        let containerStarter = document.createElement("section");
        containerStarter.classList.add("containerStarter");
        containerStarter.style.top = "530px";
        gameContainer.appendChild(containerStarter);

        const chosenElement = createPokemonElement(chosenPokemon);
        containerStarter.appendChild(chosenElement);

        let rulesMessage = document.createElement("p");
        rulesMessage.classList.add("box");
        rulesMessage.id = "rulesMessage";
        rulesMessage.style.top = "50px";
        rulesMessage.innerHTML = `
            Click on ${chosenPokemon.name.english} to gain Pokédollars. 
            Keep going to unlock surprises.<br><br>
            Ready? Let's go!
        `;

        gameContainer.appendChild(rulesMessage);
        play(gameContainer, chosenElement);
    });
}

export function play(gameContainer, pokemonClicker) {
    const counter = document.createElement("p");
    counter.classList.add("box");
    gameContainer.appendChild(counter);

    let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
    counter.textContent = `Pokédollars: ${pokedollars}₽`;

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
        gameContainer.appendChild(pokedollarImg);

        setTimeout(() => {
            pokedollarImg.style.transform = "scale(1)";
            pokedollarImg.style.opacity = "0";
        }, 10);

        setTimeout(() => {
            pokedollarImg.remove();
        }, 500);
    }

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
        animatePokedollar();
    });
}