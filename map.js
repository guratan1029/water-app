function initMap() {

  const map = new google.maps.Map(
    document.getElementById("map"),
    {
      center: { lat: 35.681236, lng: 139.767125 },
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

      // コンビニ検索
      const service =
        new google.maps.places.PlacesService(map);

      service.nearbySearch(
        {
          location: userPos,
          radius: 1000,
          keyword: "コンビニ"
        },
        (results, status) => {

          if (
            status ===
            google.maps.places.PlacesServiceStatus.OK
          ) {

            results.forEach((place) => {

              const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name
              });

              const info =
                new google.maps.InfoWindow({
                  content: `
                    <b>${place.name}</b><br>
                    ${place.vicinity || ""}
                  `
                });

              marker.addListener("click", () => {
                info.open({
                  anchor: marker,
                  map
                });
              });

            });

          }

        }
      );

    },

    (error) => {
      console.log(error);
      alert(error.message);
    }
  );

}