function initMap() {

  navigator.geolocation.getCurrentPosition(
    (position) => {

      const current = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      const map = new google.maps.Map(
        document.getElementById("map"),
        {
          center: current,
          zoom: 16
        }
      );

      new google.maps.Marker({
        position: current,
        map: map,
        title: "現在地"
      });

    },
    (error) => {
      console.error(error);
    }
  );

}