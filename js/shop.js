import { playSound } from './music.js';

const top = document.querySelector(".top");
const message = document.querySelector(".message");
const bottom = document.querySelector(".bottom");
const gameContainer = document.querySelector(".game-container");

export async function getItems() {
    try {
        const response = await fetch('assets/items.json');
        const items = await response.json();
        return items;
    } catch (error) {
        console.error("Error loading: ", error);
        return [];
    }
}

export function openShop() {
    const shopModal = document.createElement("section");
    shopModal.classList.add("modal", "box");
    const pokeshop = document.createElement("h2");
    pokeshop.textContent = "pokéshop";
    shopModal.appendChild(pokeshop);

    getItems().then(items => {
        items.forEach(item => {
            const itemElement = createItem(item);
            shopModal.appendChild(itemElement);

            const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
            const itemAlreadyPurchased = backpack.hasOwnProperty(item.name);

            if (itemAlreadyPurchased && item.quantity === 1) {
                itemElement.classList.add("disabled");
                itemElement.style.pointerEvents = "none";
            } else {
                itemElement.addEventListener("click", () => {
                    const currentPokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
                    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
                
                    if (item.name === "bicycle" && backpack["bike voucher"]) {
                        playSound("assets/sounds/buyItem.mp3");
                        backpack["bicycle"] = 1;
                        delete backpack["bike voucher"];
                        localStorage.setItem("backpack", JSON.stringify(backpack));

                        const bicycle = document.getElementById("bicycle");
                        bicycle.classList.add("disabled");
                        bicycle.style.pointerEvents = "none";
                    } else if (item.cost > currentPokedollars) {
                        playSound("assets/sounds/error.mp3");
                        return;
                    } else {
                        playSound("assets/sounds/buyItem.mp3");
                        
                        if (backpack[item.name]) {
                            backpack[item.name]++;
                        } else {
                            backpack[item.name] = 1;
                        }
                        localStorage.setItem("backpack", JSON.stringify(backpack));
                
                        const newPokedollars = currentPokedollars - item.cost;
                        let counter = document.getElementById("pokedollars");
                        counter.textContent = `${newPokedollars}₽`;
                        localStorage.setItem("pokedollars", newPokedollars);

                        if (item.quantity === 1) {
                            itemElement.classList.add("disabled");
                            itemElement.style.pointerEvents = "none";
                        }
                    }
                });  
            }      
        });
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-modal");
    shopModal.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
        playSound("assets/sounds/click.mp3");
        shopModal.remove();
    });

    gameContainer.appendChild(shopModal);
}

function createItem(item) {
    const itemContainer = document.createElement("section");
    itemContainer.classList.add("itemContainer");

    const itemImage = document.createElement("img");
    itemImage.classList.add("itemImage");
    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemImage.id = item.name;

    const itemInfo = document.createElement("article");
    itemInfo.classList.add("itemInfo");
    const itemName = document.createElement("h3");
    itemName.textContent = item.name;
    const itemCost = document.createElement("p");
    itemCost.textContent = item.cost === "" ? "???" : `${item.cost}₽`;
    itemCost.classList.add("cost");

    const itemHeader = document.createElement("article");
    itemHeader.classList.add("itemHeader");
    itemHeader.appendChild(itemName);
    itemHeader.appendChild(itemCost);

    const itemDescription = document.createElement("p");
    itemDescription.textContent = item.description;
    itemDescription.classList.add("itemDescription");
    itemInfo.appendChild(itemHeader);
    itemInfo.appendChild(itemDescription);

    itemContainer.appendChild(itemImage);
    itemContainer.appendChild(itemInfo);

    return itemContainer;
}