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
var polyline;
var pols = [];
var popup = L.popup();

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

cancelButton = L.easyButton({
  id: 'cancel-polyline',
  states: [{
    icon: 'fa fa-times',
    title: 'Cancel Drawing',
    stateName: 'cancel-polyline',
    onClick: (btn, map) => {
      cancelPolyline();
    }
  }]
});
cancelButton.addTo(mymap);
cancelButton.disable();

finishButton = L.easyButton({
  id: 'finish-polyline',
  states: [{
    icon: 'fas fa-map',
    title: 'Finish Drawing',
    stateName: 'finish-polyline',
    onClick: (btn, map) => {
      popupForm();
    }
  }]
});
finishButton.addTo(mymap);
finishButton.disable();

function onMapClick(e) {
  if(startPolylineFlag != true){
    startPolyline();
    pols.push([e.latlng["lat"], e.latlng["lng"]]);
    polyline = L.polyline(pols).addTo(mymap);
  }
  else {
    pols.push([e.latlng["lat"], e.latlng["lng"]]);
    polyline.addLatLng(e.latlng);

    if(validateArea()){
      finishButton.enable();
    }
  }
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
  cancelButton.enable();
}

function finishPolyline(){
  startPolylineFlag = false;
  pols = [];
  polyline = undefined;
  cancelButton.disable();
  finishButton.disable();
}

function cancelPolyline(){
  if(polyline === undefined) return;
  
  mymap.removeLayer(polyline);
  finishPolyline();
}

function validateArea(){
  if(pols.length > 2){
    return true;
  }
  return false;
}

function drawArea(formValues){
  if(polyline === undefined) return;
  if(!validateArea()) return;

  randCol = '#' + (function co(lor){   return (lor +=
    [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
    && (lor.length == 6) ?  lor : co(lor); })('');
  let polygon = L.polygon([pols], {color: randCol}).addTo(mymap);

  polygon.bindPopup(`
    <b>Pemilik</b> : ${formValues.ownerName}<br>
    <b>Luas</b> : ${formValues.areaField}<br>
    <b>Tanaman</b> : ${formValues.crop}<br>
    <b>Tanggal Tanam</b> : ${formValues.plantingDate}
  `).openPopup();
  
  finishPolyline();
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
  
  if (formValues) {
    drawArea(formValues);
  }
}

mymap.on('click', onMapClick);