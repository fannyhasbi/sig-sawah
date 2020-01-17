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

  var polygon = L.polygon([
    [-7.026037, 110.88796],
    [-7.025148, 110.888196],
    [-7.025217, 110.888486],
    [-7.02544, 110.888432],
    [-7.025526, 110.888641],
    [-7.025771, 110.888615],
    [-7.026202, 110.888523]
  ], {color: "#eee"}).addTo(mymap);

  var polygon2 = L.polygon([
    [-7.025771, 110.888636],
    [-7.025834, 110.888856],
    [-7.026271, 110.888733],
    [-7.026202, 110.888523]
  ], {color: "#0f1"}).addTo(mymap);

  var polygon3 = L.polygon([
    [-7.026271, 110.888733],
    [-7.025691, 110.888937],
    [-7.025717, 110.889232],
    [-7.025786, 110.889328],
    [-7.026042, 110.889296],
    [-7.02609, 110.889403],
    [-7.026138, 110.889505],
    [-7.026479, 110.88943]
  ]).addTo(mymap);

  polygon.bindPopup("<b>Fauzan</b><br/>Tanam : 20 Oktober 2019");

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
    }
  }

  function startPolyline(){
    startPolylineFlag = true;
    cancelButton.enable();
    finishButton.enable();
  }
  
  function finishPolyline(){
    startPolylineFlag = false;
    pols = [];
    polyline = undefined;
    cancelButton.disable();
  }

  function cancelPolyline(){
    mymap.removeLayer(polyline);
    finishPolyline();
  }

  function drawArea(){
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