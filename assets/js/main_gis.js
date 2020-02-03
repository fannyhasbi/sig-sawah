"use strict"

var url = "http://localhost/sig-sawah/";
var centerView = new L.LatLng(-7.0252604, 110.8902910);
var mymap = L.map('mapid').setView(centerView, 17);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmFubnloYXNiaSIsImEiOiJjazR5NDAyeGwwN3FwM2t0YnhlbTEzazE4In0.Ki9RdnOUANwx5NeK7mHpSQ', {
  // id: 'mapbox/streets-v11',
  id: 'mapbox/satellite-v9',
  accessToken: 'pk.eyJ1IjoiZmFubnloYXNiaSIsImEiOiJjazR5NDAyeGwwN3FwM2t0YnhlbTEzazE4In0.Ki9RdnOUANwx5NeK7mHpSQ'
}).addTo(mymap);

/**
 * Singleton Variables
 * for better sharable state
 */
var startPolylineFlag = false;
var polyline = undefined;
var pols = [];
var polygon = undefined;
var helpLine = undefined;
var helpPolygon = undefined;
var firstPoint = L.circleMarker();
// Check whether the drawing state by button is active
var drawingState = false;

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

var startDrawingButton = L.easyButton({
  id: 'start-drawing-button',
  states: [{
    icon: 'fa fa-pen',
    title: 'Mulai Menggambar',
    stateName: 'start-polyline',
    onClick: (btn, map) => {
      btn.button.style.backgroundColor = "#f00";
      btn.button.style.color = "#fff";
      document.getElementById("mapid").style.cursor = "crosshair";
      
      btn.state('cancel-polyline');
      drawingState = true;
    }
  }, {
    icon: 'fa fa-times',
    title: 'Batalkan Menggambar',
    stateName: 'cancel-polyline',
    onClick: (btn, map) => {
      btn.button.style.backgroundColor = "#fff";
      btn.button.style.color = "#000";
      document.getElementById("mapid").style.cursor = "grab";
      
      btn.state('start-polyline');
      cancelPolyline();
      drawingState = false;
    }
  }]
});
startDrawingButton.addTo(mymap);

var undoButton = L.easyButton({
  id: 'undo-polyline',
  states: [{
    icon: 'fa fa-undo',
    ttle: 'Batalkan titik terakhir',
    stateName: 'undo-polyline',
    onClick: (btn, map) => {
      undoPoint();
    }
  }]
});
undoButton.addTo(mymap);
undoButton.disable();

var finishButton = L.easyButton({
  id: 'finish-polyline',
  states: [{
    icon: 'fas fa-map',
    title: 'Selesai Menggambar',
    stateName: 'finish-polyline',
    onClick: (btn, map) => {
      drawArea();
    }
  }]
});
finishButton.addTo(mymap);
finishButton.disable();

function onMapClick(e) {
  if(!drawingState) return;

  if(startPolylineFlag != true){
    startPolyline(e.latlng);
    pols.push([e.latlng["lat"], e.latlng["lng"]]);
    polyline = L.polyline(pols, {
      color: '#ee3'
    }).addTo(mymap);
  }
  else {
    pols.push([e.latlng["lat"], e.latlng["lng"]]);
    polyline.addLatLng(e.latlng);
    undoButton.enable();

    if(validateArea()){
      drawHelpArea();
      finishButton.enable();
    }
  }
}

function onMapMouseMove(e) {
  if(!drawingState || pols.length < 1) return;
  
  let latlngs = [pols[pols.length - 1], [e.latlng.lat, e.latlng.lng]];
  
  if(helpLine){
    helpLine.setLatLngs(latlngs);
  }
  else {
    helpLine = L.polyline(latlngs, {
      color: 'grey',
      weight: 2,
      dashArray: '7',
      className: 'help-layer'
    });
    helpLine.addTo(mymap);
  }
}

function onKeyDownEscape(){
  cancelPolyline();
}

function onKeyDownEnter(){
  drawArea();
}

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

function startPolyline(latlng){
  placeFirstPoint(latlng);
  startPolylineFlag = true;
}

function finishPolyline(){
  removeMapLayers();

  startPolylineFlag = false;
  pols = [];
  polygon = undefined;
  polyline = undefined;
  helpLine = undefined;
  helpPolygon = undefined;
  
  finishButton.disable();
  undoButton.disable();
}

function cancelPolyline(){
  if(polyline === undefined) return;
  
  removeMapLayers();
  finishPolyline();
}

function undoPoint(){
  if(!drawingState) return;
  if(pols.length == 0) return;

  pols.pop();
  
  polyline.setLatLngs(pols);
  helpPolygon.setLatLngs(pols);

  if(!validateArea()){
    finishButton.disable();
  }

  if(pols.length == 0){
    finishPolyline();
    undoButton.disable();
  }
}

function validateArea(){
  if(pols.length > 2){
    return true;
  }
  return false;
}

function drawArea(){
  if(polyline === undefined) return;
  if(!validateArea()) return;

  drawingState = false;

  let randCol = '#' + (function co(lor){   return (lor +=
    [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
    && (lor.length == 6) ?  lor : co(lor); })('');
  
  polygon = L.polygon([pols], {
    color: randCol,
    fillOpacity: 0.4
  }).addTo(mymap);
  let popup = L.popup({
    closeButton: false,
    autoClose: false,
    closeOnEscapeKey: false,
    closeOnClick: false,
  })
  .setContent(`<button onclick="cancelArea()"><i class="fa fa-times-circle"></i></button> | <button onclick="confirmArea('${randCol}')"><i class="fa fa-check-circle"></i></button>`);

  polygon.bindPopup(popup).openPopup();
}

function drawHelpArea(){
  if(polyline === undefined) return;
  if(!validateArea()) return;
  
  if(helpPolygon){
    helpPolygon.setLatLngs(pols)
  }
  else {
    helpPolygon = L.polygon([pols], {
      color: '#ee0',
      stroke: false,
      className: 'help-layer'
    });
    helpPolygon.addTo(mymap);
  }
}

function cancelArea(){
  drawingState = true;
  mymap.removeLayer(polygon);
}

function confirmArea(color){
  popupForm(color);
}

function removeMapLayers(){
  mymap.removeLayer(polyline);
  mymap.removeLayer(helpLine);
  mymap.removeLayer(helpPolygon);
  mymap.removeLayer(firstPoint);
}

function placeFirstPoint(latlng){
  let icon = L.divIcon({
    className: 'first-point',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });

  firstPoint = L.marker(latlng, {icon: icon});
  firstPoint.addTo(mymap);
  firstPoint.on('click', function(){
    if(validateArea()){
      drawArea();
    }
  });
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

async function popupForm(color){
  const { value: formValues, dismiss } = await Swal.fire({
    title: 'Isi Informasi Lahan',
    html: `
      <div id="field-form">
        <table>
          <tr>
            <th>Pemilik</th>
            <td><input type="text" id="owner-name" class="swal2-input" placeholder="Pemilik"></td>
          </tr>
          <tr>
            <th>Tanaman</th>
            <td><input type="text" id="crop" class="swal2-input" placeholder="Tanaman"></td>
          </tr>
          <tr>
            <th>Dusun</th>
            <td><input type="text" id="hamlet" class="swal2-input" placeholder="Dusun"></td>
          </tr>
          <tr>
            <th>Tanggal Tanam</th>
            <td><input type="text" id="planting-date" class="swal2-input datepickr" placeholder="Tanggal Tanam"></td>
          </tr>
        </table>
      </div>
      `,
    focusConfirm: false,
    confirmButtonText: 'Simpan',
    confirmButtonColor: '#0c0',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showCancelButton: true,
    cancelButtonText: 'Batalkan',
    onOpen: () => {
      flatpickr(".datepickr", {});
    },
    preConfirm: () => {
      let v = {
        ownerName: document.getElementById('owner-name').value,
        crop: document.getElementById('crop').value,
        hamlet: document.getElementById('hamlet').value,
        plantingDate: document.getElementById('planting-date').value,
      }

      // check empty value
      for (let [, val] of Object.entries(v)) {
        if(val === ''){
          Swal.showValidationMessage(`Harap isi semua input yang ada`);
        }
      }

      if(!v.plantingDate.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/i)){
        Swal.showValidationMessage(`Format tanggal salah`);
      }

      return v;
    }
  });

  polygon.closePopup();
  polygon.unbindPopup();

  if(dismiss === Swal.DismissReason.cancel){
    cancelArea();
    return;
  }

  polygon.bindPopup(getPopupContent(formValues)).openPopup();

  let sendData = {
    color: color,
    ownerName: formValues.ownerName,
    crop: formValues.crop,
    hamlet: formValues.hamlet,
    plantingDate: formValues.plantingDate
  }
  sendPolygonJSON(sendData);
  
  drawingState = true;
  finishPolyline();
}

function sendPolygonJSON(data){
  let polygonGeoJSON = polygon.toGeoJSON(15);
  polygonGeoJSON.properties = {
    color: data.color,
    popupContent: {
      ownerName: data.ownerName,
      crop: data.crop,
      hamlet: data.hamlet,
      planting_date: data.plantingDate
    }
  }

  console.log(data);

  $.ajax({
    url: `${url}api/sawah`,
    type: 'POST',
    cache: false,
    data: {
      color: data.color,
      owner: data.ownerName,
      crop: data.crop,
      hamlet: data.hamlet,
      planting_date: data.plantingDate,
      coordinates: JSON.stringify(polygonGeoJSON.geometry.coordinates)
    },
    error: function(err){
        console.log('Error sending data', err);
    },
    success: function(response){ 
      console.log(response);
      Swal.fire({
        icon: 'success',
        text: 'Lahan berhasil disimpan',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 4000,
      });
    }
  });
}

function getGeoJSONData(){
  let yoyoy;

  $.ajax({
    url: `${url}api/sawah`,
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

// event listeners
mymap.on('click', onMapClick);
mymap.addEventListener('mousemove', onMapMouseMove);
document.onkeydown = (e) => {
  if(!drawingState) return;
  
  switch(e.keyCode){
    case 13: onKeyDownEnter(); break;
    case 27: onKeyDownEscape(); break;
  }
};

L.geoJSON(getGeoJSONData(), {
  style: function(feature){
    return {color: feature.properties.color}
  },
  onEachFeature: onEachFeatureCallback
}).addTo(mymap);