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

      
        

    },

    (error) => {
      console.log(error);
      alert("位置情報を取得できませんでした");
    }

  );
  let nearestPlace = null;
let nearestDistance = Infinity;

results.forEach((place) => {

  const lat =
    place.geometry.location.lat();

  const lng =
    place.geometry.location.lng();

  const distance =
    Math.sqrt(
      Math.pow(userPos.lat - lat, 2) +
      Math.pow(userPos.lng - lng, 2)
    );

  if (distance < nearestDistance) {
    nearestDistance = distance;
    nearestPlace = place;
  }

});document
.getElementById("findStore")
.addEventListener("click", () => {

  const destination =
    nearestPlace.name;

  const url =
`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=walking`;

  window.location.href = url;

});

}
