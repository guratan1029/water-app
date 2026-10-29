function initMap() {

  const map = new google.maps.Map(
    document.getElementById("map"),
    {
      center: {
        lat: 35.681236,
        lng: 139.767125
      },
      zoom: 15
    }
  );

  navigator.geolocation.getCurrentPosition(

    (pos) => {

      const userPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      const stores = [
        {
          name: "セブンイレブン",
          lat: userPos.lat + 0.001,
          lng: userPos.lng + 0.001
        },
        {
          name: "ローソン",
          lat: userPos.lat - 0.001,
          lng: userPos.lng + 0.001
        },
        {
          name: "ファミリーマート",
          lat: userPos.lat,
          lng: userPos.lng - 0.001
        }
      ];
      let nearestStore = stores[0];
let nearestDistance = Infinity;

stores.forEach((store) => {

  const distance = Math.sqrt(
    Math.pow(userPos.lat - store.lat, 2) +
    Math.pow(userPos.lng - store.lng, 2)
  );

  if (distance < nearestDistance) {
    nearestDistance = distance;
    nearestStore = store;
  }

});

console.log("最寄り店舗:", nearestStore.name);
      
      stores.forEach((store) => {
      
        const marker = new google.maps.Marker({
          position: {
            lat: store.lat,
            lng: store.lng
          },
          map: map,
          title: store.name
        });
      
        const info = new google.maps.InfoWindow({
          content: `🏪 ${store.name}`
        });
      
        marker.addListener("click", () => {
          info.open(map, marker);
        });
      
      });

      map.setCenter(userPos);

      new google.maps.Marker({
        position: userPos,
        map: map,
        label: "現在地"
      });

      console.log(
        "現在地",
        userPos.lat,
        userPos.lng
      );
      new google.maps.Marker({
        position: {
          lat: userPos.lat + 0.001,
          lng: userPos.lng + 0.001
        },
        map: map,
        title: "セブンイレブン（テスト）"
      });
      
      new google.maps.Marker({
        position: {
          lat: userPos.lat - 0.001,
          lng: userPos.lng + 0.001
        },
        map: map,
        title: "ローソン（テスト）"
      });
      
      new google.maps.Marker({
        position: {
          lat: userPos.lat,
          lng: userPos.lng - 0.001
        },
        map: map,
        title: "ファミリーマート（テスト）"
      });
      const marker = new google.maps.Marker({
        position: {
          lat: userPos.lat + 0.001,
          lng: userPos.lng + 0.001
        },
        map: map
      });
      
      const info = new google.maps.InfoWindow({
        content: "🏪 セブンイレブン"
      });
      
      marker.addListener("click", () => {
        info.open(map, marker);
      });

      document
        .getElementById("findStore")
        .addEventListener("click", () => {

          const url =
            `https://www.google.com/maps/search/コンビニ/@${userPos.lat},${userPos.lng},16z`;

          window.location.href = url;

        });

    },

    (error) => {
      console.log(error);
      alert("位置情報を取得できませんでした");
    }
    

  );
  

}