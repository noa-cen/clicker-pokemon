import { getItems } from './shop.js';
import { animatePokedollar } from './game.js';
import { playSound } from './music.js';

const gameContainer = document.querySelector(".game-container");

export async function findItems() {
    const items = await getItems();

    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
    const hasItemsFinder = backpack && backpack["items finder"];
  
    if (!window.itemsFinderInterval && hasItemsFinder) {
        window.itemsFinderInterval = setInterval(() => {
        const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
  
        const randomChoice = Math.random() < 0.99;
  
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
            const itemsFinder = items.find(item => item.name === "items finder");
            const randomItemId = Math.floor(Math.random() * itemsFinder.items.length);
            let randomItem = itemsFinder.items[randomItemId];
    
            if (randomItem.name === "masterball" || randomItem.name === "bike voucher") {
                if (backpack[randomItem.name]) {
                randomItem = null;
                return;
                } else {
                backpack[randomItem.name] = 1;
                localStorage.setItem("backpack", JSON.stringify(backpack));
                }
            } else if (randomItem.name === "nugget") {
                const currentPokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
                const newPokedollars = currentPokedollars + 5000;
                localStorage.setItem("pokedollars", newPokedollars);
    
                const counter = document.getElementById("pokedollars");
                if (counter) {
                counter.textContent = `Pokédollars: ${newPokedollars}₽`;
                }
            } else {
                backpack[randomItem.name] = backpack[randomItem.name]
                ? backpack[randomItem.name] + 1
                : 1;
    
                localStorage.setItem("backpack", JSON.stringify(backpack));
            }
            playSound("assets/sounds/gainItem.mp3");
            animatePokedollar(randomItem);
            }
        }, 1000);
    }
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

            const clickSound = new Audio(itemsFinderActive ? "assets/sounds/itemsFinder.mp3" : "assets/sounds/error.mp3");
            clickSound.play();

            if (itemsFinderActive) {
                findItems();
            } else {
                clearInterval(window.itemsFinderInterval);
                window.itemsFinderInterval = null;
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