const map = L.map('map').setView([-12.0464, -77.0428], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const heatData = [];

fetch('http://localhost:3000/reportes')
  .then(res => res.json())
  .then(data => {
    data.forEach(reporte => {
      const { lat, lng, tipo, descripcion, usuario } = reporte;

      L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: "#0077ff",
        color: "#0044aa",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      })
      .addTo(map)
      .bindPopup(`
        <strong>${tipo}</strong><br>
        ${descripcion}<br>
        <em>${usuario.nombre}</em>
      `);

      heatData.push([lat, lng, 1]);
    });

    if (heatData.length > 0) {
      L.heatLayer(heatData, {
        radius: 60,
        blur: 45,
        maxZoom: 15,
        gradient: {
          0.1: 'transparent',
          0.3: '#a5d8ff',
          0.5: '#74c0fc',
          0.7: '#339af0'
        }
      }).addTo(map);

      L.heatLayer(heatData, {
        radius: 30,
        blur: 25,
        maxZoom: 17,
        gradient: {
          0.1: 'blue',
          0.4: 'lime',
          0.7: 'orange',
          0.9: 'red'
        }
      }).addTo(map);
    }
  })
  .catch(err => console.error('❌ Error cargando reportes:', err));
