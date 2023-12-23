import CoinData from "../interfaces/coin-data";
import Cache from "../cache.js";

const cache = Cache.getInstance();

export async function getCoinData(coinId: string): Promise<CoinData> {
    const cacheResponse = await cache.getData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const coinData: CoinData = cacheResponse as CoinData;
    return coinData;
  }