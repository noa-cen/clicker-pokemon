import { play, updateExpBar } from './game.js';
import { playSound } from './music.js';
import { pauseIntervals, resumeIntervals } from './backpack.js';

const bottom = document.querySelector(".bottom");
const gameContainer = document.querySelector(".game-container");

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
    let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || [];
    const hasPokemon = pokemonsCaptured.includes(pokemon.id);

    const pokemonElement = document.createElement("img");
    pokemonElement.classList.add(className);
    pokemonElement.alt = pokemon.name.english;
    pokemonElement.id = `${pokemon.name.english.toLowerCase()}`;
    pokemonElement.src = hasPokemon ? `assets/images/pokemon/color/${pokemon.id}.png` : pokemon.image;

    return pokemonElement;
}

function evolution() {
    const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
    const newPokemonId = currentPokemonId + 1;
    animatedEvolution(currentPokemonId, newPokemonId, () => {
        finishEvolution(newPokemonId);
    });
}

function finishEvolution(newPokemonId) {
    const currentPokemon = document.querySelector(".pokemon");
    if (currentPokemon) {
        currentPokemon.remove();
    }

    let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || []; 
    if (!pokemonsCaptured.includes(newPokemonId)) {
        pokemonsCaptured.push(newPokemonId);
        localStorage.setItem("pokemons", JSON.stringify(pokemonsCaptured));
    }

    getPokemon().then(pokemons => {
        const newPokemon = pokemons.find(p => p.id === newPokemonId);
        const newPokemonElement = createPokemonElement(newPokemon);
        localStorage.setItem("clickerId", newPokemonId);
        bottom.appendChild(newPokemonElement);
        play(newPokemonElement);
    });

    localStorage.setItem("expNivel", 0);
    updateExpBar();
}

export function evolutionStone() {
    const leafStone = JSON.parse(localStorage.getItem("leafStone"));
    const thunderStone = JSON.parse(localStorage.getItem("thunderStone"));
    const waterStone = JSON.parse(localStorage.getItem("waterStone"));
    const moonStone = JSON.parse(localStorage.getItem("moonStone"));
    const fireStone = JSON.parse(localStorage.getItem("fireStone"));
    let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;

    if (leafStone) {
        localStorage.setItem("leafStone", JSON.stringify(false));
        
        const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
        const newPokemonId = currentPokemonId + 1;
        animatedEvolution(currentPokemonId, newPokemonId, () => {
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 5000 : 2500;
            finishEvolution(newPokemonId);
        });
    } else if (thunderStone) {
        localStorage.setItem("thunderStone", JSON.stringify(false));
        
        const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
        const newPokemonId = currentPokemonId + 1;
        animatedEvolution(currentPokemonId, newPokemonId, () => {
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 5000 : 2500;
            finishEvolution(newPokemonId);
        });
    } else if (waterStone) {
        localStorage.setItem("waterStone", JSON.stringify(false));
        
        const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
        const newPokemonId = currentPokemonId + 1;
        animatedEvolution(currentPokemonId, newPokemonId, () => {
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 5000 : 2500;
            finishEvolution(newPokemonId);
        });
    } else if (moonStone) {
        localStorage.setItem("moonStone", JSON.stringify(false));
        
        const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
        const newPokemonId = currentPokemonId + 1;

        animatedEvolution(currentPokemonId, newPokemonId, () => {
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 5000 : 2500;
            finishEvolution(newPokemonId);
        });
    } else if (fireStone) {
        localStorage.setItem("fireStone", JSON.stringify(false));
        
        const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
        const newPokemonId = currentPokemonId + 1;
        animatedEvolution(currentPokemonId, newPokemonId, () => {
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 5000 : 2500;
            finishEvolution(newPokemonId);
        });
    }
}

export function evolutionEevee() {
    const thunderStone = JSON.parse(localStorage.getItem("thunderStone"));
    const waterStone = JSON.parse(localStorage.getItem("waterStone"));
    const fireStone = JSON.parse(localStorage.getItem("fireStone"));

     if (thunderStone) {
        localStorage.setItem("thunderStone", JSON.stringify(false));
        
        const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
        const newPokemonId = currentPokemonId + 2;
        animatedEvolution(currentPokemonId, newPokemonId, () => {
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 5000 : 2500;
            finishEvolution(newPokemonId);
        });
    } else if (waterStone) {
        localStorage.setItem("waterStone", JSON.stringify(false));
        
        const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
        const newPokemonId = currentPokemonId + 1;
        animatedEvolution(currentPokemonId, newPokemonId, () => {
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 5000 : 2500;
            finishEvolution(newPokemonId);
        });
    } else if (fireStone) {
        localStorage.setItem("fireStone", JSON.stringify(false));
        
        const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
        const newPokemonId = currentPokemonId + 3;
        animatedEvolution(currentPokemonId, newPokemonId, () => {
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 5000 : 2500;
            finishEvolution(newPokemonId);
        });
    }
}

export function evolutionPokemon() {
    let expNivel = parseInt(localStorage.getItem("expNivel")) || 0;
    const currentPokemonId = parseInt(localStorage.getItem("clickerId"));
    let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
    const counter = document.getElementById("pokedollars");

    if (expNivel >= 100) {
        const levelEvolution = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 21, 23, 27, 29, 32, 
            41, 43, 46, 48, 50,52, 54, 56, 60, 63, 64, 66, 67, 69, 72, 74, 75, 77, 79, 81, 84, 86, 
            88, 92, 93, 96, 98, 100, 104, 109, 111, 116, 118, 129, 138, 140, 147, 148];        
        const thunderStoneEvolution = [25];
        const moonStoneEvolution = [30, 33, 35, 39];
        const fireStoneEvolution = [37, 58];
        const leafStoneEvolution = [44, 70, 102];
        const waterStoneEvolution = [61, 90, 120];
        const eeveeId = 133;
        const noEvolution = [3, 6, 9, 12, 15, 18, 20, 22, 24, 26, 28, 31, 34, 36, 38, 40, 42, 45, 
            47, 49, 51, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80, 82, 85, 87, 89, 91, 94, 95, 
            97, 99, 101, 103, 105, 106, 107, 108, 110, 112, 113, 114, 115, 117, 119, 121, 122, 123, 
            124, 125, 126, 127, 128, 130, 131, 132, 134, 135, 136, 137, 139, 141, 142, 143, 144, 145, 
            146, 149, 150, 151];

        if (levelEvolution.includes(currentPokemonId)) {
            evolution();
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 4000 : 2000;
        } else if (
            thunderStoneEvolution.includes(currentPokemonId) ||
            moonStoneEvolution.includes(currentPokemonId) ||
            fireStoneEvolution.includes(currentPokemonId) ||
            leafStoneEvolution.includes(currentPokemonId) ||
            waterStoneEvolution.includes(currentPokemonId)
        ) {
            evolutionStone();
        } else if (currentPokemonId === eeveeId) {
            evolutionEevee();
        } else if (noEvolution.includes(currentPokemonId) && expNivel === 100) {
            playSound("assets/sounds/levelUp.mp3");
            pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 2000 : 1000;
        }
    
        counter.textContent = `${pokedollars}₽`;
        localStorage.setItem("pokedollars", pokedollars);
    }
}

function animatedEvolution(pokemonId, newPokemonId, onComplete) {
    pauseIntervals();

    getPokemon().then(pokemons => {
        const currentPokemon = pokemons.find(p => p.id === pokemonId);
        const evolvedPokemon = pokemons.find(p => p.id === newPokemonId);

        const evolutionContainer = document.createElement("section");
        evolutionContainer.classList.add("evolutionContainer");

        const evolutionName = document.createElement("h2");
        evolutionName.textContent = `What? ${currentPokemon.name.english} is evolving!`;
        evolutionName.classList.add("box", "evolutionName");
        evolutionContainer.appendChild(evolutionName);

        const evolutionImgContainer = document.createElement("article");
        evolutionImgContainer.classList.add("evolution-images");

        const currentImg = document.createElement("img");
        currentImg.src = `assets/images/pokemon/color/${currentPokemon.id}.png`;
        currentImg.classList.add("evolving", "current");

        const newImg = document.createElement("img");
        newImg.src = `assets/images/pokemon/color/${evolvedPokemon.id}.png`;
        newImg.classList.add("evolving", "new");
        newImg.style.opacity = 0;

        evolutionImgContainer.appendChild(currentImg);
        evolutionImgContainer.appendChild(newImg);
        evolutionContainer.appendChild(evolutionImgContainer);
        gameContainer.appendChild(evolutionContainer);

        playSound("assets/sounds/evolution.mp3");

        const flickerTimings = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200]; 

        let i = 0;
        function flicker() {
            if (i < flickerTimings.length) {
                currentImg.style.opacity = 1;
                newImg.style.opacity = 0;

                setTimeout(() => {
                    currentImg.style.opacity = 0;
                    newImg.style.opacity = 1;

                    setTimeout(() => {
                        i++;
                        flicker();
                    }, 100);
                }, flickerTimings[i]);
            } else {
                currentImg.style.opacity = 0;
                newImg.style.opacity = 1;
                evolutionName.textContent = `${currentPokemon.name.english} evolved 
                into ${evolvedPokemon.name.english}!`;

                setTimeout(() => {
                    resumeIntervals();
                    evolutionContainer.remove();
                    if (onComplete) onComplete();
                    window.location.reload();
                }, 3000);
            }
        }
        flicker();
    });
}