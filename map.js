function initMap() {

  console.log("OVERPASS VERSION");

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

      // 現在地
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

      // コンビニ・自販機検索
      const query = `
[out:json];
(
  node["shop"="convenience"]
    (around:5000,${userPos.lat},${userPos.lng});

  node["amenity"="vending_machine"]
    (around:5000,${userPos.lat},${userPos.lng});

  node["shop"="supermarket"]
    (around:5000,${userPos.lat},${userPos.lng});
);
`;

      console.log("fetch開始");

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

          console.log(place);

          if (
            typeof place.lat === "undefined" ||
            typeof place.lon === "undefined"
          ) {
            return;
          }

          console.log(
            "座標:",
            place.lat,
            place.lon
          );

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
                "スポット",

              icon: {
                url:
                  "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              }
            });

          const info =
            new google.maps.InfoWindow({
              content:
                `${icon} ${
                  place.tags?.name ||
                  "名称不明"
                }`
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