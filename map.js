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

      // コンビニ・自販機取得
      const query = `
[out:json];
(
  node["shop"="convenience"]
    (around:1000,${userPos.lat},${userPos.lng});

  node["amenity"="vending_machine"]
    (around:1000,${userPos.lat},${userPos.lng});
);
out;
`;

      fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: query
        }
      )
      .then(response => response.json())
      .then(data => {

        console.log(
          "取得件数:",
          data.elements.length
        );

        data.elements.forEach((place) => {

          let icon = "🏪";

          if (
            place.tags &&
            place.tags.amenity ===
            "vending_machine"
          ) {
            icon = "🥤";
          }

          const marker =
            new google.maps.Marker({
              position: {
                lat: place.lat,
                lng: place.lon
              },
              map: map,
              title:
                place.tags?.name ||
                "スポット"
            });

          const info =
            new google.maps.InfoWindow({
              content: `
                ${icon}
                ${
                  place.tags?.name ||
                  "名称不明"
                }
              `
            });

          marker.addListener(
            "click",
            () => {

              info.open({
                anchor: marker,
                map
              });

            }
          );

        });

      })
      .catch(error => {

        console.error(
          "Overpassエラー",
          error
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