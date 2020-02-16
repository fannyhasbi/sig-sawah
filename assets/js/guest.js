"use strict"

var url = "http://localhost/sig-sawah/";
var centerView = new L.LatLng(-7.0252604, 110.8902910);
var mymap = L.map('mapid').setView(centerView, 17);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmFubnloYXNiaSIsImEiOiJjazR5NDAyeGwwN3FwM2t0YnhlbTEzazE4In0.Ki9RdnOUANwx5NeK7mHpSQ', {
  // id: 'mapbox/streets-v11',
  id: 'mapbox/satellite-v9',
  accessToken: 'pk.eyJ1IjoiZmFubnloYXNiaSIsImEiOiJjazR5NDAyeGwwN3FwM2t0YnhlbTEzazE4In0.Ki9RdnOUANwx5NeK7mHpSQ'
}).addTo(mymap);

// Balai Desa
L.marker(centerView, {
  title: "Kantor Balai Desa"
}).addTo(mymap);

var centerButton = L.easyButton({
  id: 'center-view-button',
  states: [{
    icon: 'fas fa-map-marker-alt',
    title: 'Center to Kantor Balai Desa',
    stateName: 'center-view',
    onClick: (btn, map) => {
      centerizeView();
    }
  }]
}).addTo(mymap);

function centerizeView(){
  let zoomLevel = 17;
  zoomLevel = mymap.getZoom() < zoomLevel ? zoomLevel : mymap.getZoom();

  mymap.setView(
    centerView,
    zoomLevel,
    {
      animate: true,
      duration: 1.0
    }
  );
}

function getPopupContent(field){
  return `
    <table>
      <tr>
        <th>Pemilik</th>
        <td>${field.ownerName}</td>
      </tr>
      <tr>
        <th>Tanaman</th>
        <td>${field.crop}</td>
      </tr>
      <tr>
        <th>Dusun</th>
        <td>${field.hamlet}</td>
      </tr>
      <tr>
        <th>Tanggal tanam</th>
        <td>${field.plantingDate}</td>
      </tr>
    </table>
  `
}

function getGeoJSONData(){
  let yoyoy;

  $.ajax({
    url: url,
    type: 'GET',
    async: false,
    cache: false,
    error: function(err){
        console.log(err);
    },
    success: function(response){ 
      yoyoy = response.data;
    }
  });
  
  return yoyoy;
}

function onEachFeatureCallback(feature, layer){
  if (feature.properties && feature.properties.popupContent) {
    let { ownerName, crop, hamlet, plantingDate } = feature.properties.popupContent;
    let content = {
      ownerName: ownerName,
      crop: crop,
      hamlet: hamlet,
      plantingDate: plantingDate
    }
    
    layer.bindPopup(getPopupContent(content));
  }
}

L.geoJSON(getGeoJSONData(), {
  style: function(feature){
    return {color: feature.properties.color}
  },
  onEachFeature: onEachFeatureCallback
}).addTo(mymap);