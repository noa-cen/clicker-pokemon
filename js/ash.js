const gameContainer = document.querySelector(".game-container");

export function playerInfo() {
    const playerModal = document.createElement("section");
    playerModal.classList.add("playerModal");
    playerModal.classList.add("box");

    const playerName = localStorage.getItem("playerName");
    const name = document.createElement("h2");
    name.textContent = playerName;
    playerModal.appendChild(name);

    const currentPokedollars = localStorage.getItem("pokedollars");
    const counter = document.createElement("p");
    counter.classList.add("playerInfo");
    counter.textContent = `Pokédollars: ${currentPokedollars}₽`;
    playerModal.appendChild(counter);

    let pokemonsCaptured = JSON.parse(localStorage.getItem("pokemons")) || [];
    const pokemonCount = pokemonsCaptured.length;
    const pokedex = document.createElement("p");
    pokedex.classList.add("playerInfo");
    pokedex.textContent = `Pokédex: ${pokemonCount}`;
    playerModal.appendChild(pokedex);

    const resetAll = document.createElement("button");
    resetAll.textContent = "reset all";
    resetAll.classList.add("reset");
    resetAll.addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    })
    playerModal.appendChild(resetAll);

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-modal");
    playerModal.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
        playerModal.remove();
    });

    gameContainer.appendChild(playerModal);
}