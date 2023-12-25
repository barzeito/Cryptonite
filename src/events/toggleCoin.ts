const selectedCoins = [];

// =================== Add coin to the array ================
export function addCoinToArray(e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
      const element = e.target as HTMLElement;
      if (element.id.startsWith("checked-")) {
        const coinId = element.id.substring("checked-".length);
        console.log('Clicked on',coinId);
        const checkbox = document.querySelector(`#checked-${coinId}`) as HTMLInputElement;
        const span = document.querySelector(`#span-${coinId}`) as HTMLSpanElement;
  
        if (checkbox.checked) {
          if (selectedCoins.length < 5) {
            // Add the coin to the array
            selectedCoins.push(coinId);
            console.log('Added',coinId,'to the array.');
            showNotification(`Coin ${coinId} added.`);

            //Get the coins symbol and add it to sessionStorage.
            const spanText = span.textContent;
            saveData(spanText);

          } else {
            selectedCoins.push(coinId);
            const spanText = span.textContent;
            saveData(spanText);
            showNotification(`Coin ${coinId} added.`);
            showToggleLimit();
          }
        } else {
          // Remove the coin from the array
          const index = selectedCoins.findIndex(
            (selectedCoin) => selectedCoin === coinId
          );
          selectedCoins.splice(index, 1);
          const spanText = span.textContent;
          removeData(spanText)
          console.log('Removed',coinId,'from the array.');
          showNotification(`Coin ${coinId} removed.`);
        }
        console.log(selectedCoins);
      }
    }
  }

// =================== Popup when user added more then 5 coins ================
  function showToggleLimit() {
    try {
      document.getElementById(`toggle-popup-box`).innerHTML = `
                  <div class="toggle-popup">
                      <div class="toggle-popup-content">
                          <div class="toggle-popup-header">
                              <div>You can select only 5 coins, choose 1 to remove</div>
                              <div class="toggle-popup-icon">
                                  <button id="close" class="close-btn"><i class="bi bi-x"></i></button>
                              </div>
                          </div>
                          <div class="toggle-popup-info">
                          </div>
                      </div>
                  </div>
              `;
      const popupInfo = document.querySelector(".toggle-popup-info");
      selectedCoins.forEach((coin) => {
        const coinElement = document.createElement("div");
        coinElement.innerHTML = `
                    <div class="toggle-pop-main-container">
                      <span id="coinName-${coin}">${coin}</span>
                      <div class="clickMe">Click my button, if you want to remove me.</div>
                      <div id="pop-toggle-container-${coin}">
                          <input class="pop-checkedInput" type="checkbox" id="pop-checked-${coin}" checked>
                          <label for="pop-checked-${coin}" class="pop-checkedButton"></label>
                      </div>
                    </div>
                  `;
        popupInfo.appendChild(coinElement);
      });
      const showBox = document.getElementById(`toggle-popup-box`);
      showBox.classList.add("show");
    } catch (error) {
      // 1Move Token coin for example can't get the info about.
      document.getElementById(`error`).innerHTML = `Couldn't get the data about this coin! try again later`;
    }
  }
  
  export function closeToggleLimit(e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
      const element = e.target as HTMLElement;
      const closeBtn = element.closest(".close-btn");
      if (closeBtn && selectedCoins.length > 5) {
        alert("Please remove at least 1 coin to continue.");
        return;
      }
        if (closeBtn) {
        const showBox = document.getElementById(`toggle-popup-box`);
        showBox.classList.remove("show");
      }
    }
  }

// =================== Add coin to the array inside the popUp ================
export function addCoinToArrayToggle(e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
      const element = e.target as HTMLElement;
      if (element.id.startsWith("pop-checked-")) {
        const coinId = element.id.substring("pop-checked-".length);
        console.log('Clicked on',coinId);
        const span = document.querySelector(`#span-${coinId}`) as HTMLSpanElement;
        const checkbox = document.querySelector(`#pop-checked-${coinId}`) as HTMLInputElement;
        if (checkbox) {
          if (checkbox.checked) {
            // Add the coin to the array
            selectedCoins.push(coinId);
            const spanText = span.textContent;
            saveData(spanText);
            console.log('Added',coinId,'to the array.');
            showNotification(`Coin ${coinId} added.`);
            (document.querySelector(`#checked-${coinId}`) as HTMLInputElement).checked = true;
          } else {
            // Remove the coin from the array
            const index = selectedCoins.findIndex(
              (selectedCoin) => selectedCoin === coinId
            );
            selectedCoins.splice(index, 1);
            const spanText = span.textContent;
            removeData(spanText);
            console.log('Removed',coinId,'from the array.');
            showNotification(`Coin ${coinId} removed.`);
            (document.querySelector(`#checked-${coinId}`) as HTMLInputElement).checked = false;
          }
          console.log(selectedCoins);
        }
      }
    }
  }
  
// =================== Notifications + Save ================
export function showNotification(message) {
    const notificationContainer = document.getElementById("notification-container");
    notificationContainer.textContent = message;
    if (notificationContainer) {
      notificationContainer.style.display = "block";
    }
    setTimeout(() => {
      notificationContainer.style.display = "none";
    }, 2000);
  }

  // Save/Remove data to seassion storage to show it in the chart.
function saveData(spanText: string) {
    const savedDataString = sessionStorage.getItem('selectedCoins');
    const savedData: string[] = savedDataString
      ? JSON.parse(savedDataString)
      : [];
    savedData.push(spanText);
    const savedDataStringUpdated = JSON.stringify(savedData);
    sessionStorage.setItem('selectedCoins', savedDataStringUpdated);
  }

  function removeData(spanText: string) {
    const savedDataString = sessionStorage.getItem('selectedCoins');
    if (!savedDataString) {
      console.log('No data to remove')
      return;
    }
    const savedData: string[] = JSON.parse(savedDataString);
      const index = savedData.indexOf(spanText);
      if (index !== -1) {
      savedData.splice(index, 1);
      const savedDataStringUpdated = JSON.stringify(savedData);
      sessionStorage.setItem('selectedCoins', savedDataStringUpdated);
    }
  }