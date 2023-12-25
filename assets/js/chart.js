var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let chartInstance = null;
let dataIndex = 0;
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}
function createMultiAxisChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Price in USD'
                    }
                }
            },
        }
    });
}
function fetchDataForCoin(coinSymbol) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinSymbol}&tsyms=USD`);
            const data = yield response.json();
            // console.log(`API Response for ${coinSymbol}:`, data);
            const coinData = data[Object.keys(data)[0]];
            // console.log(data[Object.keys(data)[0]])
            // console.log(coinData)
            if (!coinData || !coinData.USD === undefined || !coinData.USD === null) {
                console.error(`No valid price data for ${coinSymbol}`);
                return null;
            }
            return { coin: coinSymbol, price: coinData.USD };
        }
        catch (error) {
            console.error('Error fetching data for coin:', coinSymbol, error);
            return null;
        }
    });
}
function updateChartData(chart, coins) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield Promise.all(coins.map(coinSymbol => fetchDataForCoin(coinSymbol)));
        results.forEach((result) => {
            if (!result)
                return;
            let dataset = chart.data.datasets.find(d => d.label === `${result.coin} Price`);
            if (dataset) {
                dataset.data.push({ x: dataIndex, y: result.price });
            }
            else {
                chart.data.datasets.push({
                    label: `${result.coin} Price`,
                    data: [{ x: dataIndex, y: result.price }],
                    yAxisID: 'y',
                    borderColor: getRandomColor(),
                    fill: false
                });
            }
        });
        dataIndex++;
        chart.update();
    });
}
export function setupAndUpdateChart() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = document.getElementById('chartContainer').getContext('2d');
        if (!chartInstance) {
            chartInstance = createMultiAxisChart(ctx);
        }
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            let storedCoins = JSON.parse(sessionStorage.getItem('selectedCoins') || '[]');
            console.log('Stored Coins:', storedCoins);
            if (Array.isArray(storedCoins)) {
                console.log('Updating the chart with the coins:', storedCoins);
                yield updateChartData(chartInstance, storedCoins);
            }
            else {
                console.error('Stored coins is not an array:', storedCoins);
            }
        }), 2000);
    });
}
