import {fetchCoins } from "./api/rest.js";
import { reduceCoins } from "./reducers/reducer.js";
import { displayCoins} from "./ui/vcoins.js";
import { setupAndUpdateChart } from "./chart.js";
import { coinInfoClicked, coinInfoClose } from "./events/coinInfo.js";
import { addCoinToArray, addCoinToArrayToggle, closeToggleLimit, showNotification } from "./events/toggleCoin.js";


// =================== Display all coins ================
async function getAllCoins(): Promise<void> {
  try {
    // Loading Animation
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.display = "block";
    }
    //const getCoins = await fetchCoins('https://api.coingecko.com/api/v3/coins/list'); //Enable to use the API.
    const getCoins = await fetchCoins("coins.json"); //Enable to use the json file.
    const coins = getCoins.slice(0, 100);
    const reducedCoins = reduceCoins(coins);
    displayCoins(reducedCoins);
  } finally {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.display = "none";
    }
  }
}

// =================== Display coins by name================
async function getCoinByName(): Promise<void> {
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const coinName = searchInput.value.trim();

  if (coinName) {
    try {
      // Loading Animation
      const loading = document.getElementById("loading");
      if (loading) {
        loading.style.display = "block";
      }
      const getCoins = await fetchCoins("coins.json");
      const filteredCoins = coinName ? getCoins.filter((coin) =>coin.name.toLowerCase().includes(coinName.toLowerCase())): getCoins;
      if (filteredCoins.length === 0) {
        showNotification("No coins found for the entered value.");
        console.log('No coins found for the entered value.')
      } else {
        const reducedCoins = reduceCoins(filteredCoins);
        displayCoins(reducedCoins);
      }
    } finally {
      const loading = document.getElementById("loading");
      if (loading) {
        loading.style.display = "none";
      }
    }
  }
}

// =================== Search when click the search icon ================
const searchByName = document.getElementById("search-btn");
searchByName.addEventListener("click", function (e) {
  e.preventDefault();
  getCoinByName();
});

(async () => {
  document.getElementById("coins-sections").addEventListener("click", coinInfoClicked);
  document.getElementById("isPopUp").addEventListener("click", coinInfoClose);
  document.getElementById("coins-sections").addEventListener("click", addCoinToArray);
  document.getElementById("toggle-popup-box").addEventListener("click", closeToggleLimit);
  document.getElementById("toggle-popup-box").addEventListener("click", addCoinToArrayToggle);
  getAllCoins();
  setupAndUpdateChart();
})();
