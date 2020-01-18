var mymap = L.map('mapid').setView([-7.0252604, 110.8902910], 17);

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
    Pemilik : ${formValues.ownerName}<br>
    Luas : ${formValues.areaField}<br>
    Tanaman : ${formValues.plant}
  `);
  
  finishPolyline();
}

async function popupForm(){
  const { value: formValues } = await Swal.fire({
    title: 'Multiple inputs',
    html:
      '<input id="owner-name" class="swal2-input" placeholder="Owner Name">' +
      '<input id="area-field" class="swal2-input" placeholder="Area Field">' +
      '<input id="plant" class="swal2-input" placeholder="Plant">',
    focusConfirm: false,
    preConfirm: () => {
      return {
        ownerName: document.getElementById('owner-name').value,
        areaField: document.getElementById('area-field').value,
        plant: document.getElementById('plant').value
      }
    }
  });
  
  if (formValues) {
    drawArea(formValues);
  }
}

mymap.on('click', onMapClick);