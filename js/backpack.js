import { getItems } from './shop.js';

const gameContainer = document.querySelector(".game-container");

export function openBackpack() {
    const backpackModal = document.createElement("section");
    backpackModal.classList.add("modal");
    backpackModal.classList.add("box");

    const playerName = localStorage.getItem("playerName");
    const myBag = document.createElement("h2");
    myBag.textContent = `${playerName}'s bag`;
    backpackModal.appendChild(myBag);

    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};

    getItems().then(items => {
        items.forEach(item => {
            if (backpack.hasOwnProperty(item.name)) {
                const itemElement = createItem(item);
                backpackModal.appendChild(itemElement);
            }
        });
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-modal");
    backpackModal.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
        backpackModal.remove();
    });

    gameContainer.appendChild(backpackModal);
}

function createItem(item) {
    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};

    const itemContainer = document.createElement("section");
    itemContainer.classList.add("itemContainer");

    const itemImage = document.createElement("img");
    itemImage.classList.add("itemImage");
    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemImage.id = item.name;

    const itemName = document.createElement("h3");
    itemName.textContent = item.name;
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

export function itemsFinder() {
    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};

    if (backpack["items finder"]) {
        setInterval(() => {
            const randomChoice = Math.random() < 0.8;

            if (randomChoice) {
                const currentPokedollars = parseInt(localStorage.getItem("pokedollars")) || 0;
                const newPokedollars = currentPokedollars + 1;
                localStorage.setItem("pokedollars", newPokedollars);
                let counter = document.getElementById("pokedollars");
                counter.textContent = `Pokédollars: ${newPokedollars}₽`;
            } else {
                const itemsFinder = getItems().find(item => item.name === "items finder");
                const randomItem = itemsFinder.items[Math.floor(Math.random() * itemsFinder.items.length)];

                backpack[randomItem.name] = backpack[randomItem.name] ? backpack[randomItem.name] + 1 : 1;
                localStorage.setItem("backpack", JSON.stringify(backpack));
            }
        }, 10000);
    }
}