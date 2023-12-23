var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchCoins } from "./api/rest.js";
import { reduceCoins } from "./reducers/reducer.js";
import { displayCoins } from "./ui/vcoins.js";
import { setupAndUpdateChart } from "./chart.js";
import { coinInfoClicked, coinInfoClose } from "./events/coinInfo.js";
import { addCoinToArray, addCoinToArrayToggle, closeToggleLimit, showNotification } from "./events/toggleCoin.js";
// =================== Display all coins ================
function getAllCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Loading Animation
            const loading = document.getElementById("loading");
            if (loading) {
                loading.style.display = "block";
            }
            //const getCoins = await fetchCoins('https://api.coingecko.com/api/v3/coins/list'); //Enable to use the API.
            const getCoins = yield fetchCoins("coins.json"); //Enable to use the json file.
            const coins = getCoins.slice(0, 100);
            const reducedCoins = reduceCoins(coins);
            displayCoins(reducedCoins);
        }
        finally {
            const loading = document.getElementById("loading");
            if (loading) {
                loading.style.display = "none";
            }
        }
    });
}
// =================== Display coins by name================
function getCoinByName() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchInput = document.getElementById("search-input");
        const coinName = searchInput.value.trim();
        if (coinName) {
            try {
                // Loading Animation
                const loading = document.getElementById("loading");
                if (loading) {
                    loading.style.display = "block";
                }
                const getCoins = yield fetchCoins("coins.json");
                const filteredCoins = coinName ? getCoins.filter((coin) => coin.name.toLowerCase().includes(coinName.toLowerCase())) : getCoins;
                if (filteredCoins.length === 0) {
                    showNotification("No coins found for the entered value.");
                    console.log('No coins found for the entered value.');
                }
                else {
                    const reducedCoins = reduceCoins(filteredCoins);
                    displayCoins(reducedCoins);
                }
            }
            finally {
                const loading = document.getElementById("loading");
                if (loading) {
                    loading.style.display = "none";
                }
            }
        }
    });
}
// =================== Search when click the search icon ================
const searchByName = document.getElementById("search-btn");
searchByName.addEventListener("click", function (e) {
    e.preventDefault();
    getCoinByName();
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    document.getElementById("coins-sections").addEventListener("click", coinInfoClicked);
    document.getElementById("isPopUp").addEventListener("click", coinInfoClose);
    document.getElementById("coins-sections").addEventListener("click", addCoinToArray);
    document.getElementById("toggle-popup-box").addEventListener("click", closeToggleLimit);
    document.getElementById("toggle-popup-box").addEventListener("click", addCoinToArrayToggle);
    getAllCoins();
    setupAndUpdateChart();
}))();
