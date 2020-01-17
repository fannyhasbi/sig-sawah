var mymap = L.map('mapid').setView([-7.0252604, 110.8902910], 17);
  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmFubnloYXNiaSIsImEiOiJjazR5NDAyeGwwN3FwM2t0YnhlbTEzazE4In0.Ki9RdnOUANwx5NeK7mHpSQ', {
    id: 'mapbox/streets-v11',
    // id: 'mapbox/satellite-v9',
    accessToken: 'pk.eyJ1IjoiZmFubnloYXNiaSIsImEiOiJjazR5NDAyeGwwN3FwM2t0YnhlbTEzazE4In0.Ki9RdnOUANwx5NeK7mHpSQ'
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
        drawArea();
      }
    }]
  });
  finishButton.addTo(mymap);
  finishButton.disable();

  // polygon.bindPopup("<b>Fauzan</b><br/>Tanam : 20 Oktober 2019");

  var startPolylineFlag = false;
  var polyline;
  var pols = [];

  var popup = L.popup();
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

  function drawArea(){
    if(polyline === undefined) return;
    if(!validateArea()) return;

    randCol = '#' + (function co(lor){   return (lor +=
      [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
      && (lor.length == 6) ?  lor : co(lor); })('');
    L.polygon([pols], {color: randCol}).addTo(mymap);
    
    finishPolyline();
  }

  function keyHandler(event) {
    var x = event.which || event.keyCode;

    if(x === 97 || x === 13){ // a || Enter
      drawArea();
    }
    else if(x === 115){ // s
      cancelPolyline();
    }
  }

  mymap.on('click', onMapClick);