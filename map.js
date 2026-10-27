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

      new google.maps.Marker({
        position: userPos,
        map: map,
        label: "現在地"
      });

      document
        .getElementById("findStore")
        .addEventListener("click", () => {

          const url =
            `https://www.google.com/maps/search/コンビニ/@${userPos.lat},${userPos.lng},16z`;

          window.location.href = url;

        });

    },

    () => {
      alert("位置情報を取得できませんでした");
    }

  );

}