import { getItems } from './shop.js';
import { animatePokedollar, updateExpBar, finishGame } from './game.js';
import { getPokemon, createPokemonElement, evolutionPokemon } from './pokemon.js';
import { playSound, playSoundThen } from './music.js';

const gameContainer = document.querySelector(".game-container");

export async function findItems() {
    const items = await getItems();

    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
    const hasItemsFinder = backpack && backpack["itemFinder"];
  
    if (!window.itemsFinderInterval && hasItemsFinder) {
        window.itemsFinderInterval = setInterval(() => {  
        const randomChoice = Math.random() < 0.95;
  
            if (randomChoice) {
                const currentPokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
                let newPokedollars;
                if (JSON.parse(localStorage.getItem("doubleSpeed")) === true) {
                    newPokedollars = currentPokedollars + 2;
                } else {
                    newPokedollars = currentPokedollars + 1;
                }
                localStorage.setItem("pokedollars", newPokedollars);
        
                const counter = document.getElementById("pokedollars");
                if (counter) {
                    counter.textContent = `${newPokedollars}₽`;
                }
        
                playSound("assets/sounds/money.mp3", 0.6);
                animatePokedollar();
            } else {
                const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
                const itemsFinder = items.find(item => item.name === "itemFinder");

                function getRandomWeightedItem(items) {
                    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
                    const random = Math.random() * totalWeight;
                    let cumulativeWeight = 0;
                    
                    for (const item of items) {
                        cumulativeWeight += item.weight;
                        
                        // If the cumulative weight exceeds the random number, select this item
                        if (random <= cumulativeWeight) {
                            return item;
                        }
                    }
                    return items[items.length - 1];
                }
            
                let randomItem = getRandomWeightedItem(itemsFinder.items);

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

                playSound("assets/sounds/gainItem.mp3", 0.2);
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
            playSound("assets/sounds/exp.mp3", 0.2);
            updateExpBar(expNivel, expBar);
        }
    }, 5000);
}

export function pauseIntervals() {
    if (window.itemsFinderInterval) {
        clearInterval(window.itemsFinderInterval);
        window.itemsFinderInterval = null;
    }
    if (window.multiExpInterval) {
        clearInterval(window.multiExpInterval);
        window.multiExpInterval = null;
    }
}

export function resumeIntervals() {
    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
    if (backpack["itemFinder"]) {
        findItems();
    } else if (backpack["multi-exp"]) {
        gainExp();
    }
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

function createBall(ball) {
    const ballElement = document.createElement("img");
    ballElement.classList.add("itemImage");
    ballElement.src = `assets/images/shop/${ball}-1.png`;
    ballElement.alt = ball;
    ballElement.id = ball;

    return ballElement;
}

function pokeflute(battle) {
    pauseIntervals();

    let playerLevel = JSON.parse(localStorage.getItem("playerLevel"));
    let listPokemonId = [];

    if (playerLevel <= 10) {
        listPokemonId = [10, 13, 16, 19, 21, 23, 41]; // max 20 pokemons
    } else if (playerLevel > 10 && playerLevel <= 20) {
        listPokemonId = [10, 13, 16, 19, 21, 23, 41, 25, 27, 29, 32, 43, 46, 50]; // max 39 pokemons
    } else if (playerLevel > 20 && playerLevel <= 30) {
        listPokemonId = [25, 27, 29, 32, 37, 39, 43, 46, 50, 35, 39, 48, 52, 54, 56, 58]; // max 57 pokemons
    } else if (playerLevel > 30 && playerLevel <= 40) {
        listPokemonId = [25, 27, 29, 32, 37, 39, 43, 46, 50, 35, 39, 48, 52, 54, 56, 58, 1, 4, 7, 
            60, 63, 66, 69]; // max 71 pokemons
    } else if (playerLevel > 40 && playerLevel <= 50) {
        listPokemonId = [1, 4, 7, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84]; // max 85 pokemons
    } else if (playerLevel > 50 && playerLevel <= 60) {
        listPokemonId = [72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100]; // max 101 pokemons
    } else if (playerLevel > 60 && playerLevel <= 70) {
        listPokemonId = [86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 
            115, 116, 118]; // max 119 pokemons
    } else if (playerLevel > 70 && playerLevel <= 80) {
        listPokemonId = [102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 
            125, 127, 128, 129, 133]; // max 134 pokemons
    } else if (playerLevel > 80 && playerLevel <= 90) {
        listPokemonId = [102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 
            125, 127, 128, 129, 133, 131, 132, 137, 138, 140, 142, 143]; // max 143 pokemons
    } else if (playerLevel > 90 && playerLevel <= 99) {
        listPokemonId = [10, 13, 16, 19, 21, 23, 41, 25, 27, 29, 32, 43, 46, 50, 35, 39, 48, 52, 54, 56, 
            58, 1, 4, 7, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 
            102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 127, 
            128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 144, 145, 146, 147, 150]; // max 150 pokemons
    } else if (playerLevel === 99) {
        listPokemonId = [151]; // Mew
    }
    
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
        playSound(`assets/sounds/pokemon's call/${wildPokemon.id}.mp3`);

        const ashBack = document.createElement("img");
        ashBack.src = "https://i.imgur.com/pTfAsiG.png";
        ashBack.alt = "Ash fighting";
        ashBack.id = "ashBack";
        ashBack.classList.add("ashBack");

        wildPokemonContainer.appendChild(wildPokemon);
        wildPokemonContainer.appendChild(ashBack);
        wildPokemonContainer.appendChild(wildPokemonText);

        gameContainer.appendChild(wildPokemonContainer);

        setTimeout(() => {
            wildPokemonText.remove();
            const capturePokemonContainer = document.createElement("section");
            capturePokemonContainer.classList.add("box", "capturePokemonContainer");

            const ballsContainer = document.createElement("article");
            ballsContainer.classList.add("ballsContainer");

            const backpack = JSON.parse(localStorage.getItem("backpack"));

            const pokeballInfo = document.createElement("article");
            pokeballInfo.classList.add("ballInfo");
            const pokeball = createBall("pokeball");
            let pokeballQuantity = backpack["pokeball"] ?? 0;
            const pokeballQuantityElement = document.createElement("p");
            pokeballQuantityElement.id = "pokeballQuantityElement";
            pokeballQuantityElement.textContent = `x ${pokeballQuantity}`;
            pokeballInfo.appendChild(pokeball);
            pokeballInfo.appendChild(pokeballQuantityElement);

            const greatballInfo = document.createElement("article");
            greatballInfo.classList.add("ballInfo");
            const greatball = createBall("greatball");
            let greatballQuantity = backpack["greatball"] ?? 0;
            const greatballQuantityElement = document.createElement("p");
            greatballQuantityElement.id = "greatballQuantityElement";
            greatballQuantityElement.textContent = `x ${greatballQuantity}`;
            greatballInfo.appendChild(greatball);
            greatballInfo.appendChild(greatballQuantityElement);

            const ultraballInfo = document.createElement("article");
            ultraballInfo.classList.add("ballInfo");
            const ultraball = createBall("ultraball");
            let ultraballQuantity = backpack["ultraball"] ?? 0;
            const ultraballQuantityElement = document.createElement("p");
            ultraballQuantityElement.id = "ultraballQuantityElement";
            ultraballQuantityElement.textContent = `x ${ultraballQuantity}`;
            ultraballInfo.appendChild(ultraball);
            ultraballInfo.appendChild(ultraballQuantityElement);

            const masterballInfo = document.createElement("article");
            masterballInfo.classList.add("ballInfo");
            const masterball = createBall("masterball");
            let masterballQuantity = backpack["masterball"] ?? 0;
            const masterballQuantityElement = document.createElement("p");
            masterballQuantityElement.id = "masterballQuantityElement";
            masterballQuantityElement.textContent = `x ${masterballQuantity}`;
            masterballInfo.appendChild(masterball);
            masterballInfo.appendChild(masterballQuantityElement);

            ballsContainer.appendChild(pokeballInfo);
            ballsContainer.appendChild(greatballInfo);
            ballsContainer.appendChild(ultraballInfo);
            ballsContainer.appendChild(masterballInfo);
            
            const run = document.createElement("p");
            run.id = "run";
            run.textContent = "RUN";

            capturePokemonContainer.appendChild(ballsContainer);
            capturePokemonContainer.appendChild(run);
            
            wildPokemonContainer.appendChild(capturePokemonContainer);

            capturePokemon(battle);

            run.addEventListener("click", () => {
                if (battle) {
                    battle.pause();
                    battle.currentTime = 0;
                    battle.src = "";
                    battle.load();
                    battle = null;
                }

                resumeIntervals();
                blackOverlayPokeflute.remove();
                wildPokemonContainer.remove();
            });
        }, 3000);
    });
}

function capturePokemon(battle) {
    const backpack = JSON.parse(localStorage.getItem("backpack"));

    const pokeball = document.getElementById("pokeball");
    let pokeballQuantity = backpack["pokeball"] ?? 0;
    const pokeballQuantityElement = document.getElementById("pokeballQuantityElement");

    if (pokeball) {
        pokeball.addEventListener("click", () => {
            if (pokeballQuantity === 0) {
                return;
            } else {
                pokeballQuantity--;
                pokeballQuantityElement.textContent = `x ${pokeballQuantity}`;

                if (pokeballQuantity === 0) {
                    delete backpack["pokeball"];
                } else {
                    backpack["pokeball"] = pokeballQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));
                animatedCapture("pokeball", battle);
            }
        });
    }

    const greatball = document.getElementById("greatball");
    let greatballQuantity = backpack["greatball"] ?? 0;
    const greatballQuantityElement = document.getElementById("greatballQuantityElement");

    if (greatball) {
        greatball.addEventListener("click", () => {
            if (greatballQuantity === 0) {
                return;
            } else {
                greatballQuantity--;
                greatballQuantityElement.textContent = `x ${greatballQuantity}`;

                if (greatballQuantity === 0) {
                    delete backpack["greatball"];
                } else {
                    backpack["greatball"] = greatballQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));
                animatedCapture("greatball", battle);
            }
        });
    }

    const ultraball = document.getElementById("ultraball");
    let ultraballQuantity = backpack["ultraball"] ?? 0;
    const ultraballQuantityElement = document.getElementById("ultraballQuantityElement");

    if (ultraball) {
        ultraball.addEventListener("click", () => {
            if (ultraballQuantity === 0) {
                return;
            } else {
                ultraballQuantity--;
                ultraballQuantityElement.textContent = `x ${ultraballQuantity}`;

                if (ultraballQuantity === 0) {
                    delete backpack["ultraball"];
                } else {
                    backpack["ultraball"] = ultraballQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));
                animatedCapture("ultraball", battle);
            }
        });
    }

    const masterball = document.getElementById("masterball");
    let masterballQuantity = backpack["masterball"] ?? 0;
    const masterballQuantityElement = document.getElementById("masterballQuantityElement");

    if (masterball) {
        masterball.addEventListener("click", () => {
            if (masterballQuantity === 0) {
                return;
            } else {
                masterballQuantity--;
                masterballQuantityElement.textContent = `x ${masterballQuantity}`;

                if (masterballQuantity === 0) {
                    delete backpack["masterball"];
                } else {
                    backpack["masterball"] = masterballQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));
                animatedCapture("masterball", battle);
            }
        });
    }
}

function animatedCapture(ball, battle) {
    const wildPokemonElement = document.querySelector(".wildPokemon");
    const pokemonName = wildPokemonElement.alt;
    const ballImg = document.createElement("img");
    ballImg.src = `assets/images/shop/${ball}-1.png`;
    ballImg.classList.add("wildPokemon", "ballImg");

    let pokemondId;
    getPokemon().then(pokemons => {
        const pokemon = pokemons.find(p => p.name.english === pokemonName);
        pokemondId = pokemon.id;

        let captureRate;

        if (pokemondId === 151) {
            switch (ball) {
                case "pokeball":
                case "greatball":
                case "ultraball":
                    captureRate = 0;
                    break;
                case "masterball":
                    captureRate = 1;
            }
        } else {
            switch (ball) {
                case "pokeball":
                    captureRate = 0.25;
                    break;
                case "greatball":
                    captureRate = 0.5;
                    break;
                case "ultraball":
                    captureRate = 0.75;
                    break;
                case "masterball":
                    captureRate = 1;
            }
        }

        wildPokemonElement.replaceWith(ballImg);

        ballImg.animate([
            { transform: 'translateX(-30px)' },
            { transform: 'translateX(30px)' },
            { transform: 'translateX(-20px)' },
            { transform: 'translateX(20px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
        ], {
            duration: 800,
            easing: 'ease',
        });

        setTimeout(() => {
            const wildPokemonContainer = document.querySelector(".wildPokemonContainer");
            const blackOverlayPokeflute = document.getElementById("blackOverlayPokeflute");
            const capture = Math.random() < captureRate;

            if (capture) {
                const pokemonCaptured = pokemons.find(p => p.name.english === pokemonName);
                const pokemonCapturedId = pokemonCaptured.id;
                let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || [];
                if (!pokemonsCaptured.includes(pokemonCapturedId)) {
                    pokemonsCaptured.push(pokemonCapturedId);
                    localStorage.setItem("pokemons", JSON.stringify(pokemonsCaptured));
                }

                if (battle) {
                    battle.pause();
                    battle.currentTime = 0;
                    battle.src = "";
                    battle.load();
                    battle = null;
                }

                const ballsContainer = document.querySelector(".ballsContainer");
                const run = document.getElementById("run");
                ballsContainer.remove();
                run.remove();

                const captureMessage = document.createElement("p");
                captureMessage.textContent = `All right, ${pokemonName} was caught!`;
                const capturePokemonContainer = document.querySelector(".capturePokemonContainer");
                capturePokemonContainer.appendChild(captureMessage);

                let pokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
                const counter = document.getElementById("pokedollars");
                pokedollars += JSON.parse(localStorage.getItem("doubleSpeed")) ? 1000 : 500;
                counter.textContent = `${pokedollars}₽`;
                localStorage.setItem("pokedollars", pokedollars);

                playSound("assets/sounds/pokemon-capture.mp3");

                setTimeout(() => {
                    if (pokemonCapturedId === 151) {
                        finishGame();
                    }
                    resumeIntervals();
                    blackOverlayPokeflute.remove();
                    wildPokemonContainer.remove();
                }, 3000); 
            } else {
                ballImg.replaceWith(wildPokemonElement);
            }
        }, 1500);
    });
}

export async function openBackpack() {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const backpackModal = document.createElement("section");
    backpackModal.classList.add("modal", "box");

    const playerName = localStorage.getItem("playerName");
    const myBag = document.createElement("h2");
    myBag.textContent = `${playerName}'s bag`;
    backpackModal.appendChild(myBag);

    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
    const itemNames = Object.keys(backpack);
    
    const items = await getItems();
    const itemsFinder = items.find(i => i.name === "itemFinder");
    
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
        overlay.remove();
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    overlay.appendChild(backpackModal);
    gameContainer.appendChild(overlay);

    const itemsFinderElement = document.getElementById("itemFinder");
    if (itemsFinderElement && !itemsFinderElement.dataset.listenerAttached) {
        itemsFinderElement.dataset.listenerAttached = "true";

        let itemsFinderActive = JSON.parse(localStorage.getItem("itemsFinderActive")) || false;

        itemsFinderElement.addEventListener("click", () => {
            itemsFinderActive = !itemsFinderActive;
            localStorage.setItem("itemsFinderActive", JSON.stringify(itemsFinderActive));

            playSound(itemsFinderActive ? "assets/sounds/activated.mp3" : "assets/sounds/deactivated.mp3", 0.5);

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

            playSound(multiExpActive ? "assets/sounds/activated.mp3" : "assets/sounds/deactivated.mp3", 0.5);

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
            overlay.remove();
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
                playSound("assets/sounds/deactivated.mp3", 0.5);
            } else {
                localStorage.setItem("doubleSpeed", JSON.stringify(true));
                playSound("assets/sounds/activated.mp3", 0.5);
            }
        });
    }

    const pokefluteElement = document.getElementById("pokeflute");
    if (pokefluteElement) {
        pokefluteElement.addEventListener("click", () => {
            const backpack = JSON.parse(localStorage.getItem("backpack"));
            let pokefluteQuantity = backpack["pokeflute"];
            pokefluteQuantity--;
            if (pokefluteQuantity === 0) {
                delete backpack["pokeflute"];
            } else {
                backpack["pokeflute"] = pokefluteQuantity;
            }
            localStorage.setItem("backpack", JSON.stringify(backpack));

            const blackOverlayPokeflute = document.createElement("section");
            blackOverlayPokeflute.id = "blackOverlayPokeflute";
            gameContainer.appendChild(blackOverlayPokeflute);


            const battle = playSound("assets/sounds/battle.mp3", 0.9, true);
            if (battle) {
                battle.loop = true;
                battle.play().catch(() => {});
            }

            setTimeout(() => {
                blackOverlayPokeflute.classList.add("expandSpiral");
            }, 0);

            blackOverlayPokeflute.addEventListener("animationend", () => {
                overlay.remove();
                pokeflute(battle);
            });
        });
    }

    const leafStone = document.getElementById("leaf stone");
    if (leafStone) {
        leafStone.addEventListener("click", () => {
            const pokemonId = parseInt(localStorage.getItem("clickerId"));
            const listIdLeaf = [44, 70, 102];
            if (listIdLeaf.includes(pokemonId)) {
                const backpack = JSON.parse(localStorage.getItem("backpack"));
                let leafStoneQuantity = backpack["leaf stone"];
                leafStoneQuantity--;
                if (leafStoneQuantity === 0) {
                    delete backpack["leaf stone"];
                } else {
                    backpack["leaf stone"] = leafStoneQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));

                playSoundThen("assets/sounds/stoneActivated.mp3", () => {
                    localStorage.setItem("leafStone", JSON.stringify(true));
                    evolutionPokemon();
                    overlay.remove();
                });
            } else {
                playSound("assets/sounds/error.mp3");
            }
        });
    }

    const thunderStone = document.getElementById("thunder stone");
    if (thunderStone) {
        thunderStone.addEventListener("click", () => {
            const pokemonId = parseInt(localStorage.getItem("clickerId"));
            const listIdThunder = [25, 133];
            if (listIdThunder.includes(pokemonId)) {
                const backpack = JSON.parse(localStorage.getItem("backpack"));
                let thunderStoneQuantity = backpack["thunder stone"];
                thunderStoneQuantity--;
                if (thunderStoneQuantity === 0) {
                    delete backpack["thunder stone"];
                } else {
                    backpack["thunder stone"] = thunderStoneQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));

                playSoundThen("assets/sounds/stoneActivated.mp3", () => {
                    localStorage.setItem("leafStone", JSON.stringify(true));
                    evolutionPokemon();
                    overlay.remove();
                });
            } else {
                playSound("assets/sounds/error.mp3");
            }
        });
    }

    const waterStone = document.getElementById("water stone");
    if (waterStone) {
        waterStone.addEventListener("click", () => {
            const pokemonId = parseInt(localStorage.getItem("clickerId"));
            const listIdWater = [61, 90, 120, 133];
            if (listIdWater.includes(pokemonId)) {
                const backpack = JSON.parse(localStorage.getItem("backpack"));
                let waterStoneQuantity = backpack["water stone"];
                waterStoneQuantity--;
                if (waterStoneQuantity === 0) {
                    delete backpack["water stone"];
                } else {
                    backpack["water stone"] = waterStoneQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));

                playSoundThen("assets/sounds/stoneActivated.mp3", () => {
                    localStorage.setItem("leafStone", JSON.stringify(true));
                    evolutionPokemon();
                    overlay.remove();
                });
            } else {
                playSound("assets/sounds/error.mp3");
            }
        });
    }

    const moonStone = document.getElementById("moon stone");
    if (moonStone) {
        moonStone.addEventListener("click", () => {
            const pokemonId = parseInt(localStorage.getItem("clickerId"));
            const listIdMoon = [30, 33, 35, 39];
            if (listIdMoon.includes(pokemonId)) {
                const backpack = JSON.parse(localStorage.getItem("backpack"));
                let moonStoneQuantity = backpack["moon stone"];
                moonStoneQuantity--;
                if (moonStoneQuantity === 0) {
                    delete backpack["moon stone"];
                } else {
                    backpack["moon stone"] = moonStoneQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));

                playSoundThen("assets/sounds/stoneActivated.mp3", () => {
                    localStorage.setItem("leafStone", JSON.stringify(true));
                    evolutionPokemon();
                    overlay.remove();
                });
            } else {
                playSound("assets/sounds/error.mp3");
            }
        });
    }

    const fireStone = document.getElementById("fire stone");
    if (fireStone) {
        fireStone.addEventListener("click", () => {
            const pokemonId = parseInt(localStorage.getItem("clickerId"));
            const listIdFire = [37, 58, 133];
            if (listIdFire.includes(pokemonId)) {
                const backpack = JSON.parse(localStorage.getItem("backpack"));
                let fireStoneQuantity = backpack["fire stone"];
                fireStoneQuantity--;
                if (fireStoneQuantity === 0) {
                    delete backpack["fire stone"];
                } else {
                    backpack["fire stone"] = fireStoneQuantity;
                }
                localStorage.setItem("backpack", JSON.stringify(backpack));

                playSoundThen("assets/sounds/stoneActivated.mp3", () => {
                    localStorage.setItem("leafStone", JSON.stringify(true));
                    evolutionPokemon();
                    overlay.remove();
                });
            } else {
                playSound("assets/sounds/error.mp3");
            }
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
            itemsFinderParam = items.find(i => i.name === "itemFinder");
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