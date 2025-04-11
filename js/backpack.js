import { getItems } from './shop.js';
import { animatePokedollar, play, updateExpBar } from './game.js';
import { getPokemon, createPokemonElement } from './pokemon.js';
import { playSound, pauseAllSounds } from './music.js';

const gameContainer = document.querySelector(".game-container");

export async function findItems() {
    const items = await getItems();

    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
    const hasItemsFinder = backpack && backpack["items finder"];
  
    if (!window.itemsFinderInterval && hasItemsFinder) {
        window.itemsFinderInterval = setInterval(() => {  
        const randomChoice = Math.random() < 0.99;
        const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
  
            if (randomChoice) {
                const currentPokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
                const newPokedollars = currentPokedollars + 1;
                localStorage.setItem("pokedollars", newPokedollars);
        
                const counter = document.getElementById("pokedollars");
                if (counter) {
                    counter.textContent = `${newPokedollars}₽`;
                }
        
                playSound("assets/sounds/money.mp3");
                animatePokedollar();
            } else {
                const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
                const itemsFinder = items.find(item => item.name === "items finder");
                const randomItemId = Math.floor(Math.random() * itemsFinder.items.length);
                let randomItem = itemsFinder.items[randomItemId];

                if (randomItem.name === "bike voucher" && backpack["bicycle"]) {
                    return;
                } else if (randomItem.name === "masterball" || randomItem.name === "bike voucher") {
                    if (!backpack.hasOwnProperty(randomItem.name)) {
                        backpack[randomItem.name] = 1;
                        localStorage.setItem("backpack", JSON.stringify(backpack));
                    } else {
                        return;
                    }
                } else if (randomItem.name === "nugget") {
                    const currentPokedollars = parseInt(localStorage.getItem("pokedollars"));
                    const newPokedollars = currentPokedollars + 5000;
                    localStorage.setItem("pokedollars", newPokedollars);
        
                    const counter = document.getElementById("pokedollars");
                    if (counter) {
                        counter.textContent = `${newPokedollars}₽`;
                    }
                } else {
                    backpack[randomItem.name] = backpack[randomItem.name] ? backpack[randomItem.name] + 1 : 1;
                    localStorage.setItem("backpack", JSON.stringify(backpack));
                }

                playSound("assets/sounds/gainItem.mp3");
                animatePokedollar(randomItem);
            }
        }, 1000);
    }
}

export function gainExp() {
    window.multiExpInterval = setInterval(() => {
        const expBar = document.querySelector(".expBar");
        let expNivel = parseInt(localStorage.getItem("expNivel")) || 0;
        if (expNivel < 100) {
            expNivel++;
            localStorage.setItem("expNivel", expNivel);
            playSound("assets/sounds/exp.mp3");
            updateExpBar(expNivel, expBar);
        }
    }, 5000);
}

function rareCandy() {
    const expBar = document.querySelector(".expBar");
    let expNivel = parseInt(localStorage.getItem("expNivel")) || 0;
    if (expNivel < 100) {
        expNivel = expNivel + 10;
        localStorage.setItem("expNivel", expNivel);
        playSound("assets/sounds/levelUp.mp3");
        updateExpBar(expNivel, expBar);
    }
}

function pokeflute() {
    pauseAllSounds();

    const listPokemonId = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 144, 145, 146, 147, 150];
    const randomId = Math.floor(Math.random() * listPokemonId.length);
    const pokemonId = listPokemonId[randomId];

    getPokemon().then(pokemons => {
        const pokemon = pokemons.find(p => p.id === pokemonId);

        const wildPokemonContainer = document.createElement("section");
        wildPokemonContainer.classList.add("wildPokemonContainer");

        const wildPokemonText = document.createElement("h3");
        wildPokemonText.classList.add("box", "wildPokemonText");
        wildPokemonText.textContent = `Wild ${pokemon.name.english} appeared!`;

        const wildPokemon = createPokemonElement(pokemon, "wildPokemon");
        wildPokemon.src = `assets/images/pokemon/color/${pokemon.id}.png`;

        const ashBack = document.createElement("img");
        ashBack.src = "assets/images/ashBack.png";
        ashBack.alt = "Ash fighting";
        ashBack.id = "ashBack";
        ashBack.classList.add("ashBack");

        wildPokemonContainer.appendChild(wildPokemon);
        wildPokemonContainer.appendChild(ashBack);
        wildPokemonContainer.appendChild(wildPokemonText);

        gameContainer.appendChild(wildPokemonContainer);
    });
}

export async function openBackpack() {
    const backpackModal = document.createElement("section");
    backpackModal.classList.add("modal", "box");

    const playerName = localStorage.getItem("playerName");
    const myBag = document.createElement("h2");
    myBag.textContent = `${playerName}'s bag`;
    backpackModal.appendChild(myBag);

    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
    const itemNames = Object.keys(backpack);
    
    const items = await getItems();
    const itemsFinder = items.find(i => i.name === "items finder");
    
    for (const itemName of itemNames) {
        let item = items.find(i => i.name === itemName);
        
        if (!item && (itemName === "masterball" || itemName === "bike voucher") && itemsFinder && itemsFinder.items) {
            const specialItem = itemsFinder.items.find(speItem => speItem.name === itemName);
            if (specialItem) {
                item = {
                    name: specialItem.name,
                    image: specialItem.image,
                };
            }
        }
        
        if (item) {
            const itemElement = await createItem(item, itemsFinder);
            backpackModal.appendChild(itemElement);
        }
    }

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-modal");
    backpackModal.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
        playSound("assets/sounds/click.mp3");
        backpackModal.remove();
    });

    gameContainer.appendChild(backpackModal);

    const itemsFinderElement = document.getElementById("items finder");
    if (itemsFinderElement && !itemsFinderElement.dataset.listenerAttached) {
        itemsFinderElement.dataset.listenerAttached = "true";

        let itemsFinderActive = JSON.parse(localStorage.getItem("itemsFinderActive")) || false;

        itemsFinderElement.addEventListener("click", () => {
            itemsFinderActive = !itemsFinderActive;
            localStorage.setItem("itemsFinderActive", JSON.stringify(itemsFinderActive));

            const clickSound = new Audio(itemsFinderActive ? "assets/sounds/activated.mp3" : "assets/sounds/error.mp3");
            clickSound.play();

            if (itemsFinderActive) {
                findItems();
            } else {
                clearInterval(window.itemsFinderInterval);
                window.itemsFinderInterval = null;
            }
        });
    }

    const multiExpElement = document.getElementById("multi-exp");
    if (multiExpElement && !multiExpElement.dataset.listenerAttached) {
        multiExpElement.dataset.listenerAttached = "true";

        let multiExpActive = JSON.parse(localStorage.getItem("multiExpActive")) || false;

        multiExpElement.addEventListener("click", () => {
            multiExpActive = !multiExpActive;
            localStorage.setItem("multiExpActive", JSON.stringify(multiExpActive));

            const clickSound = new Audio(multiExpActive ? "assets/sounds/activated.mp3" : "assets/sounds/error.mp3");
            clickSound.play();

            if (multiExpActive) {
                gainExp();
            } else {
                clearInterval(window.multiExpInterval);
                window.multiExpInterval = null;
            }
        });
    }

    const rareCandyElement = document.getElementById("rare candy");
    if (rareCandyElement) {
        rareCandyElement.addEventListener("click", () => {
            const backpack = JSON.parse(localStorage.getItem("backpack"));
            let rareCandyQuantity = backpack["rare candy"];
            rareCandyQuantity--;
    
            if (rareCandyQuantity === 0) {
                delete backpack["rare candy"];
            } else {
                backpack["rare candy"] = rareCandyQuantity;
            }
    
            localStorage.setItem("backpack", JSON.stringify(backpack));
            rareCandy();
            backpackModal.remove();
        });
    }

    const bicycleElement = document.getElementById("bicycle");
    if (bicycleElement) {
        bicycleElement.addEventListener("click", () => {
            let doubleSpeed = JSON.parse(localStorage.getItem("doubleSpeed"));

            if (doubleSpeed === null) {
                doubleSpeed = false;
            }
    
            if (doubleSpeed) {
                localStorage.setItem("doubleSpeed", JSON.stringify(false));
                playSound("assets/sounds/error.mp3");
            } else {
                localStorage.setItem("doubleSpeed", JSON.stringify(true));
                playSound("assets/sounds/activated.mp3");
            }
        });
    }

    const pokefluteElement = document.getElementById("pokeflute");
    if (pokefluteElement) {
        pokefluteElement.addEventListener("click", () => {
            const blackOverlayPokeflute = document.createElement("div");
            blackOverlayPokeflute.id = "blackOverlayPokeflute";
            gameContainer.appendChild(blackOverlayPokeflute);

            const battle = new Audio("assets/sounds/battle VS Wild Pokemon.mp3");
            battle.loop = true;
            battle.play().catch(() => {});

            battle.play().then(() => {
                setTimeout(() => {
                    blackOverlayPokeflute.classList.add("expandSpiral");
                }, 0);
    
                blackOverlayPokeflute.addEventListener("animationend", () => {
                    pokeflute();
                });
            });
        });
    }
}

async function createItem(item, itemsFinderParam) {
    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};

    const itemContainer = document.createElement("section");
    itemContainer.classList.add("itemContainer");

    const itemImage = document.createElement("img");
    itemImage.classList.add("itemImage");
    const itemName = document.createElement("h3");

    if (item.name === "masterball" || item.name === "bike voucher") {
        if (!itemsFinderParam) {
            const items = await getItems();
            itemsFinderParam = items.find(i => i.name === "items finder");
        }

        if (itemsFinderParam && itemsFinderParam.items) {
            const specialItem = itemsFinderParam.items.find(speItem => speItem.name === item.name);
            if (specialItem) {
                itemImage.src = specialItem.image;
                itemImage.alt = specialItem.name;
                itemImage.id = specialItem.name;
                itemName.textContent = specialItem.name;
            }
        }
    } else {
        itemImage.src = item.image;
        itemImage.alt = item.name;
        itemImage.id = item.name;
        itemName.textContent = item.name;
    }

    const itemQuantity = document.createElement("p");
    itemQuantity.textContent = `${backpack[item.name]}`;
    itemQuantity.classList.add("cost");

    const itemHeader = document.createElement("article");
    itemHeader.classList.add("itemHeader");
    
    itemHeader.appendChild(itemName);
    itemHeader.appendChild(itemQuantity);

    itemContainer.appendChild(itemImage);
    itemContainer.appendChild(itemHeader);

    return itemContainer;
}