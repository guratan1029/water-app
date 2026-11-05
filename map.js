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
    
      map.setCenter(userPos);

      // 現在地マーカー
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

      // テスト店舗
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

      // 店舗表示
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
          info.open({
            anchor: marker,
            map
          });
        });

      });

      // 最寄り店舗判定
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

      console.log(
        "最寄り店舗:",
        nearestStore.name
      );
            // ボタン押下
            document
            .getElementById("findStore")
            .addEventListener("click", () => {
          
              console.log("ボタン押された");
          
            
              const directionsService =
                new google.maps.DirectionsService();
    
              const directionsRenderer =
                new google.maps.DirectionsRenderer();
    
              directionsRenderer.setMap(map);
    
              directionsService.route(
                {
                  origin: userPos,
                  destination: {
                    lat: nearestStore.lat,
                    lng: nearestStore.lng
                  },
                  travelMode:
                    google.maps.TravelMode.WALKING
                },
    
                (result, status) => {
    
                  console.log(
                    "Directions status:",
                    status
                  );
    
                  if (status === "OK") {
    
                    directionsRenderer.setDirections(result);
    
                    const route =
                      result.routes[0].legs[0];
    
                    alert(
                      `最寄り: ${nearestStore.name}
    距離: ${route.distance.text}
    時間: ${route.duration.text}`
                    );
    
                  }
    
                }
    
              );
    
            });
          },

          (error) => {
      
            console.log(error);
      
            alert(
              "位置情報を取得できませんでした"
            );
      
          }
      
        );
      
      }