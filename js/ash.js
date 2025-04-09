const gameContainer = document.querySelector(".game-container");

export function ash() {
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