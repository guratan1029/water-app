self.addEventListener("install", () => {
    console.log("Service Worker installed");
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker activated");
    event.waitUntil(self.clients.claim());
  });
  
  
  // 定期チェック（Periodic Background Sync）
  self.addEventListener("periodicsync", async (event) => {
    if (event.tag === "water-reminder") {
      event.waitUntil(checkWaterReminder());
    }
  });
  
  async function checkWaterReminder() {
    // ❗ SW では保存しない。アプリ側から送られてくる値だけ使う
    const lastDrink = await getLastDrinkTime();
    if (!lastDrink) return;
  
    const diff = Date.now() - lastDrink;
    const TWO_HOURS = 2 * 60 * 60 * 1000;
  
    if (diff >= TWO_HOURS) {
      self.registration.showNotification("そろそろ水を飲みましょう！", {
        body: "前回の水分摂取から2時間経過しています",
        icon: "/icon.png"
      });
  
      
    }
  }
  
  // IndexedDB を使って保存（Chrome で確実に動く）
  function getLastDrinkTime() {
    return new Promise(resolve => {
      const req = indexedDB.open("waterDB", 1);
  
      req.onupgradeneeded = () => {
        req.result.createObjectStore("store");
      };
  
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction("store", "readonly");
        const store = tx.objectStore("store");
        const getReq = store.get("lastDrinkTime");
  
        getReq.onsuccess = () => resolve(getReq.result);
        getReq.onerror = () => resolve(null);
      };
    });
  }
  
 
  
  self.addEventListener("message", async (event) => {
    if (event.data.type === "updateLastDrink") {
      await setLastDrinkTime(event.data.time);
    }
  });
  