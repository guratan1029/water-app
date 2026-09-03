function initMap() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
  
        const map = new google.maps.Map(document.getElementById("map"), {
          center: userPos,
          zoom: 15
        });
  
        new google.maps.Marker({
          position: userPos,
          map: map,
          label: "あなた"
        });
  
        const service = new google.maps.places.PlacesService(map);
  
        const request = {
          location: userPos,
          radius: 500,
          keyword: "自販機 コンビニ"
        };
  
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
              new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name
              });
            });
          }
        });
      },
      () => {
        alert("位置情報が取得できませんでした。設定を確認してください。");
      }
    );
  }
  