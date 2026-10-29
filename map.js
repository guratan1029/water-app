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