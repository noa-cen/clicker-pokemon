import { getItems } from './shop.js';
import { animatePokedollar } from './game.js';

const gameContainer = document.querySelector(".game-container");

export async function openBackpack() {
    const backpackModal = document.createElement("section");
    backpackModal.classList.add("modal");
    backpackModal.classList.add("box");

    const playerName = localStorage.getItem("playerName");
    const myBag = document.createElement("h2");
    myBag.textContent = `${playerName}'s bag`;
    backpackModal.appendChild(myBag);

    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};
    const itemNames = Object.keys(backpack);
    
    // Récupérer tous les items une seule fois
    const items = await getItems();
    // Trouver l'items finder pour accéder aux items spéciaux
    const itemsFinder = items.find(i => i.name === "items finder");
    
    for (const itemName of itemNames) {
        // Chercher d'abord dans la liste principale des items
        let item = items.find(i => i.name === itemName);
        
        // Si l'item n'est pas trouvé et qu'il s'agit d'un item spécial (masterball ou bike voucher)
        if (!item && (itemName === "masterball" || itemName === "bike voucher") && itemsFinder && itemsFinder.items) {
            // Créer un objet item basé sur l'item spécial dans items finder
            const specialItem = itemsFinder.items.find(speItem => speItem.name === itemName);
            if (specialItem) {
                item = {
                    name: specialItem.name,
                    image: specialItem.image,
                    // Ajouter d'autres propriétés si nécessaire
                    id: specialItem.id
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
        const clickSound = new Audio("assets/sounds/click.mp3");
        clickSound.play();
        backpackModal.remove();
    });

    gameContainer.appendChild(backpackModal);
}

// Modifier la fonction createItem pour accepter itemsFinder en paramètre optionnel
async function createItem(item, itemsFinderParam) {
    const backpack = JSON.parse(localStorage.getItem("backpack")) || {};

    const itemContainer = document.createElement("section");
    itemContainer.classList.add("itemContainer");

    const itemImage = document.createElement("img");
    itemImage.classList.add("itemImage");
    const itemName = document.createElement("h3");

    if (item.name === "masterball" || item.name === "bike voucher") {
        // Utiliser itemsFinderParam s'il est fourni, sinon le chercher
        let itemsFinder = itemsFinderParam;
        if (!itemsFinder) {
            const items = await getItems();
            itemsFinder = items.find(i => i.name === "items finder");
        }

        if (itemsFinder && itemsFinder.items) {
            const specialItem = itemsFinder.items.find(speItem => speItem.name === item.name);
            if (specialItem) {
                itemImage.src = specialItem.image;
                itemImage.alt = specialItem.name;
                itemImage.id = specialItem.name;
                itemName.textContent = specialItem.name;
            } else {
                // Fallback si l'item spécial n'est pas trouvé
                itemImage.src = item.image;
                itemImage.alt = item.name;
                itemImage.id = item.name;
                itemName.textContent = item.name;
            }
        } else {
            // Fallback si itemsFinder n'est pas disponible
            itemImage.src = item.image;
            itemImage.alt = item.name;
            itemImage.id = item.name;
            itemName.textContent = item.name;
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

export async function itemsFinder() {
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
                counter.textContent = `Pokédollars: ${newPokedollars}₽`;
            }
    
            const clickSound = new Audio("assets/sounds/money.mp3");
            clickSound.play().catch(() => {});
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
            const itemSound = new Audio("assets/sounds/success.mp3");
            itemSound.play().catch(() => {});
            animatePokedollar(randomItem);
            }
        }, 1000);
    }
}