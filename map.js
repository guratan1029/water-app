let map;

navigator.geolocation.getCurrentPosition(

  async (pos) => {

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    map = L.map('map').setView([lat, lon], 16);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);

    // 現在地マーカー
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("📍現在地");

    // Overpass API
    const query = `
      [out:json];
      (
        node["shop"="convenience"](around:1000,${lat},${lon});
      );
      out;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query
      }
    );

    const data = await response.json();

    data.elements.forEach((place) => {

      L.marker([
        place.lat,
        place.lon
      ])
      .addTo(map)
      .bindPopup(
        "🏪 " +
        (place.tags.name || "コンビニ")
      );

    });

  },

  () => {
    alert("位置情報を取得できませんでした");
  }

);