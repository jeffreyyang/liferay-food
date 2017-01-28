var gmarkers1 = [];
var gmarkers2 = [];
var markers1 = [];
var markers2 = [];
var infowindow;

// Our markers
markers1 = [
    ['0', 'Liferay', 33.997673, -117.814438, 'Diamond Bar']
];

var currentOffice = markers1[0][4];

/**
 * Function to init map
 */

function initialize() {
    var center = new google.maps.LatLng(33.997673, -117.814438);
    var mapOptions = {
        zoom: 12,
        center: center,
        mapTypeId: google.maps.MapTypeId.MAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    for (i = 0; i < markers1.length; i++) {
        addMarker(markers1[i]);
    }
    // infowindow = new google.maps.InfoWindow({
    //   content: ''
    // });
    loadJSON()
}

function loadJSON() {
  fetch("https://spreadsheets.google.com/feeds/list/16Sn_e_Glme84dDs4x1sBW8W6Ig83J6mQhGl-Py64r4Y/1/public/values?alt=json").then(function(response){
    return response.json();
  }).then(function(response){
    var jsonEntryData = response.feed.entry;
    console.log(jsonEntryData)
    console.log(jsonEntryData[0].gsx$whatistheclosestoffice.$t)
    // console.log(currentOffice)
    for (i = 0; i < jsonEntryData.length; i++) {
      if (jsonEntryData[i].gsx$whatistheclosestoffice.$t == currentOffice) {
        markers2.push([jsonEntryData[i].gsx$whatistheclosestoffice.$t, jsonEntryData[i].gsx$whatistheaddress.$t, jsonEntryData[i].gsx$wheredidyoueat.$t, jsonEntryData[i].gsx$whattypeoffoodisit.$t])
      }
    }
    console.log(markers2)
    for (i = 0; i < markers2.length; i++) {
      // console.log(markers2[i])
      addRestaurantMarker(markers2[i]);
    }
  });
}

/**
 * Function to add marker to map
 */

function addMarker(marker) {
    var category = marker[4];
    var title = marker[1];
    var pos = new google.maps.LatLng(marker[2], marker[3]);
    var content = marker[1];

    marker1 = new google.maps.Marker({
        title: title,
        position: pos,
        category: category,
        map: map
    });
    gmarkers1.push(marker1);


    // Marker click listener
    google.maps.event.addListener(marker1, 'click', (function (marker1, content) {
        return function () {
            console.log('Gmarker 1 gets pushed');
            infowindow.setContent(content);
            infowindow.open(map, marker1);
            map.panTo(this.getPosition());
            map.setZoom(15);
        }
    })(marker1, content));
}

function addRestaurantMarker(marker) {
  var url ="https://maps.googleapis.com/maps/api/geocode/json?address=" + marker[1].replace(/\s/g, "+") + "&key=";

  // console.log(url)

  var location = [];
  fetch(url).then(function(response){
      return response.json();
    }).then(function(response){
      // console.log(response.results[0].geometry.location.lat);
      // console.log(response.results[0].geometry.location.lng);
      lat = response.results[0].geometry.location.lat
      lng = response.results[0].geometry.location.lng

      var type = marker[3];
      var title = marker[2];
      var pos = new google.maps.LatLng(lat, lng);
      var office = marker[0];

      marker1 = new google.maps.Marker({
        title: title,
        position: pos,
        type: type,
        map: map
      });
    })

  console.log("adding restaurant marker")
  gmarkers2.push(marker1);
}

function getLatLngFromAddress(address) {


}

/**
 * Function to filter markers by category
 */

filterMarkers = function (category) {
    currentOffice =  document.getElementById('type').value;
    loadJSON()

    for (i = 0; i < markers1.length; i++) {
        marker = gmarkers1[i];
        // If is same category or category not picked
        if (marker.category == category || category.length === 0) {
            marker.setVisible(true);
        }
        // Categories don't match
        else {
            marker.setVisible(true);
        }
    }
}

// Init map
initialize();