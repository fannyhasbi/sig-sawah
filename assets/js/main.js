var centerView = [-7.0252604, 110.8902910];
var mymap = L.map('mapid').setView(centerView, 16);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmFubnloYXNiaSIsImEiOiJjazR5NDAyeGwwN3FwM2t0YnhlbTEzazE4In0.Ki9RdnOUANwx5NeK7mHpSQ', {
  id: 'mapbox/streets-v11',
  // id: 'mapbox/satellite-v9',
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
// Check whether the drawing state by button is active
var drawingState = false;

// Balai Desa
L.marker(centerView, {
  title: "Kantor Balai Desa"
}).addTo(mymap);

centerButton = L.easyButton({
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

startDrawingButton = L.easyButton({
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

finishButton = L.easyButton({
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
    startPolyline();
    pols.push([e.latlng["lat"], e.latlng["lng"]]);
    polyline = L.polyline(pols).addTo(mymap);
  }
  else {
    pols.push([e.latlng["lat"], e.latlng["lng"]]);
    polyline.addLatLng(e.latlng);

    if(validateArea()){
      drawHelpArea();
      finishButton.enable();
    }
  }
}

function onMapMouseMove(e) {
  if(!drawingState || pols.length < 1) return;
  if(helpLine){
    mymap.removeLayer(helpLine);
  }

  let latlngs = [pols.slice(-1)[0], [e.latlng.lat, e.latlng.lng]];

  helpLine = L.polyline(latlngs, {
    color: 'grey',
    weight: 2,
    dashArray: '7',
    className: 'help-layer'
  });
  helpLine.addTo(mymap);
}

function centerizeView(){
  mymap.panTo(
    new L.LatLng(centerView[0], centerView[1]),
    {
      duration: 1
    }
  );
}

function startPolyline(){
  startPolylineFlag = true;
}

function finishPolyline(){
  removeMapLayers();

  startPolylineFlag = false;
  pols = [];
  polyline = undefined;
  
  finishButton.disable();
}

function cancelPolyline(){
  if(polyline === undefined) return;
  
  removeMapLayers();
  finishPolyline();
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

  mymap.removeLayer(helpLine);

  drawingState = false;

  randCol = '#' + (function co(lor){   return (lor +=
    [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
    && (lor.length == 6) ?  lor : co(lor); })('');
  
  polygon = L.polygon([pols], {color: randCol}).addTo(mymap);
  let popup = L.popup({
    closeButton: false,
    autoClose: false,
    closeOnEscapeKey: false,
    closeOnClick: false
  })
  .setContent(`<button onclick="cancelArea()"><i class="fa fa-times-circle"></i></button> | <button onclick="popupForm()"><i class="fa fa-check-circle"></i></button>`);

  polygon.bindPopup(popup).openPopup();
}

function drawHelpArea(){
  if(polyline === undefined) return;
  if(!validateArea()) return;
  
  if(helpPolygon){
    mymap.removeLayer(helpPolygon);
  }
  if(helpLine){
    mymap.removeLayer(helpLine);
  }

  helpPolygon = L.polygon([pols], {
    color: '#ee0',
    stroke: false,
    className: 'help-layer'
  });
  helpPolygon.addTo(mymap);
}

function cancelArea(){
  drawingState = true;
  mymap.removeLayer(polygon);
}

function removeMapLayers(){
  mymap.removeLayer(polyline);
  mymap.removeLayer(helpLine);
  mymap.removeLayer(helpPolygon);
}

async function popupForm(){
  const { value: formValues } = await Swal.fire({
    title: 'Isi Informasi Lahan',
    html: `
      <table>
        <tr>
          <th>Pemilik</th>
          <td><input type="text" id="owner-name" class="swal2-input" placeholder="Pemilik"></td>
        </tr>
        <tr>
          <th>Luas Lahan</th>
          <td><input type="text" id="area-field" class="swal2-input" placeholder="Luas Lahan"></td>
        </tr>
        <tr>
          <th>Tanaman</th>
          <td><input type="text" id="crop" class="swal2-input" placeholder="Tanaman"></td>
        </tr>
        <tr>
          <th>Tanggal Tanam</th>
          <td><input type="text" id="planting-date" class="swal2-input datepickr" placeholder="Tanggal Tanam"></td>
        </tr>
      </table>
      `,
    focusConfirm: false,
    confirmButtonText: 'Simpan',
    onOpen: () => {
      flatpickr(".datepickr", {});
    },
    preConfirm: () => {
      let v = {
        ownerName: document.getElementById('owner-name').value,
        areaField: parseInt(document.getElementById('area-field').value),
        crop: document.getElementById('crop').value,
        plantingDate: document.getElementById('planting-date').value,
      }

      if(v.ownerName === '' || v.crop === '' || v.plantingDate === ''){
        Swal.showValidationMessage(`Harap isi semua input yang ada`);
      }
      if(v.areaField < 1 || isNaN(v.areaField)){
        Swal.showValidationMessage(`Format luas lahan salah`);
      }
      if(!v.plantingDate.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/i)){
        Swal.showValidationMessage(`Format tanggal salah`);
      }

      return v;
    }
  });

  polygon.closePopup();
  polygon.unbindPopup();
  polygon.bindPopup(`
    <b>Pemilik</b> : ${formValues.ownerName}<br>
    <b>Luas</b> : ${formValues.areaField}<br>
    <b>Tanaman</b> : ${formValues.crop}<br>
    <b>Tanggal Tanam</b> : ${formValues.plantingDate}
  `).openPopup();
  
  drawingState = true;
  finishPolyline();
}

mymap.on('click', onMapClick);
mymap.addEventListener('mousemove', onMapMouseMove);