import { getCoinData } from "../utils/getCoinsData.js";

export async function coinInfoClicked(e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
      const element = e.target as HTMLElement;
      if (element.id.startsWith("info-button-")) {
        const coinId = element.id.substring("info-button-".length);
        try {
          const loadingElement = document.getElementById("loading");
          if (loadingElement) {
            loadingElement.style.display = "block";
          }
          const coinData = await getCoinData(coinId);
          document.getElementById(`popup-box-${coinId}`).innerHTML = `
                    <div class="popup">
                        <div class="popup-content">
                            <div class="popup-header">
                                <span>${coinId} Information</span>
                                <img src="${coinData.image.thumb}"/>
                                <div class="popup-icon">
                                    <button id="close-${coinId}" class="close-btn"><i class="bi bi-x"></i></button>
                                </div>
                            </div>
                            <div class="popup-info">
                                <span>USD: $${coinData.market_data.current_price.usd}</span>
                                <span>EUR: €${coinData.market_data.current_price.eur}</span>
                                <span>NIS: ₪${coinData.market_data.current_price.ils}</span>
                            </div>
                        </div>
                    </div>
                `;
          const showBox = document.getElementById(`popup-box-${coinId}`);
          showBox.classList.add("show");
        } catch (error) {
          // 1Move Token coin for example no info about.
          document.getElementById(`error-${coinId}`).innerHTML = `
              Couldn't get the data about this coin! try again later`;
        } finally {

          const loading = document.getElementById("loading");
          if (loading) {
            loading.style.display = "none";
          }
        }
      }
    }
  }
  
export function coinInfoClose(e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
      const element = e.target as HTMLElement;
      const closeBtn = element.closest(".close-btn");
      if (closeBtn) {
        const coinId = closeBtn.id.substring("close-".length);
        const showBox = document.getElementById(`popup-box-${coinId}`);
        showBox.classList.remove("show");
      }
    }
  }