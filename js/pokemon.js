import { play } from './game.js';
import { playSound } from './music.js';

const top = document.querySelector(".top");
const message = document.querySelector(".message");
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

export function evolutionPokemon(ashElement, pokemonElement) {
    let expNivel = parseInt(localStorage.getItem("expNivel")) || 0;
    const currentPokemon = document.getElementById(pokemonElement.id);

    if (expNivel >= 100) {
        const pokemonName = pokemonElement.alt;
        getPokemon().then(pokemons => {
            const foundPokemon = pokemons.find(p => p.name.english === pokemonName);
            if (foundPokemon) {
                const pokemonId = foundPokemon.id;
                const newPokemonId = pokemonId + 1;

                function evolution(pokemonId, newPokemonId) {
                    animatedEvolution(pokemonId, newPokemonId, () => {
                        finishEvolution(newPokemonId);
                    });
                }               
                
                function finishEvolution(newPokemonId) {
                    currentPokemon.remove();
                
                    let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || []; 
                    pokemonsCaptured.push(newPokemonId);
                    localStorage.setItem("pokemons", JSON.stringify(pokemonsCaptured));
                
                    const newPokemon = pokemons.find(p => p.id === newPokemonId);
                    const newPokemonElement = createPokemonElement(newPokemon);
                    localStorage.setItem("clickerId", newPokemonId);
                
                    bottom.appendChild(newPokemonElement);
                
                    let firstClick = true;
                    localStorage.setItem("expNivel", 0);
                    let ashPlayed = true;
                    play(ashElement, newPokemonElement, firstClick);
                }

                switch (pokemonId) {
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 11:
                    case 13:
                    case 14:
                    case 16:
                    case 17:
                    case 19:
                    case 21:
                    case 23:
                    case 25: // Pikachu thunder stone
                    case 27:
                    case 29:
                    case 30: // Nidorina moon stone
                    case 32:
                    case 33: // Nidorino moon stone
                    case 35: // Clefairy moon stone
                    case 37: // Vulpix fire stone
                    case 39: // Jigglypuff moon stone
                    case 41:
                    case 43:
                    case 44: // Gloom leaf stone
                    case 46:
                    case 48:
                    case 50:
                    case 52:
                    case 54:
                    case 56:
                    case 58: // Growlithe fire stone
                    case 60:
                    case 61: // Poliwhirl water stone
                    case 63:
                    case 64:
                    case 66:
                    case 67:
                    case 69:
                    case 70: // Weepinbell leaf stone
                    case 72:
                    case 74:
                    case 75:
                    case 77:
                    case 79:
                    case 81:
                    case 84:
                    case 86:
                    case 88:
                    case 90: // Shellder water stone
                    case 92:
                    case 93:
                    case 96:
                    case 98:
                    case 100:
                    case 102: // Exeggcute leaf stone
                    case 104:
                    case 109:
                    case 111:
                    case 116:
                    case 118:
                    case 120: // Staryu water stone
                    case 129:
                    case 133: // Eevee thunder stone - water stone - fire stone
                    case 138:
                    case 140:
                    case 147:
                    case 148:
                        evolution(pokemonId, newPokemonId);
                        break;
                }
            }
        });
    }
}

function animatedEvolution(pokemonId, newPokemonId, onComplete) {
    getPokemon().then(pokemons => {
        const currentPokemon = pokemons.find(p => p.id === pokemonId);
        const evolvedPokemon = pokemons.find(p => p.id === newPokemonId);

        const evolutionContainer = document.createElement("section");
        evolutionContainer.classList.add("modal", "evolutionContainer");

        const evolutionName = document.createElement("h2");
        evolutionName.textContent = `What? ${currentPokemon.name.english} is evolving!`;
        evolutionName.classList.add("box");
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
                    evolutionContainer.remove();
                    if (onComplete) onComplete();
                }, 3000);
            }
        }

        flicker();
    });
}