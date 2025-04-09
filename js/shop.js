const top = document.querySelector(".top");
const message = document.querySelector(".message");
const bottom = document.querySelector(".bottom");
const gameContainer = document.querySelector(".game-container");

async function getItems() {
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
    shopModal.classList.add("modal");
    shopModal.classList.add("box");
    const pokeshop = document.createElement("h2");
    pokeshop.textContent = "pokeshop";
    shopModal.appendChild(pokeshop);

    getItems().then(items => {
        items.forEach(item => {
            const itemElement = createItem(item);
            shopModal.appendChild(itemElement);
        });
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-modal");
    shopModal.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
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