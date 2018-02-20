// VALIDATION ΣΤΑ MODAL

(function() {
  'use strict';
window.addEventListener('load', function() {
  var formDestination = document.getElementById('needs-validation-origin');
  formDestination.addEventListener('click', function(event) {
    if (formDestination.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    formDestination.classList.add('was-validated');
  }, false);
}, false);
})();

(function() {
  'use strict';
window.addEventListener('load', function() {
  var formDestination = document.getElementById('needs-validation-destination');
  formDestination.addEventListener('click', function(event) {
    if (formDestination.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    formDestination.classList.add('was-validated');
  }, false);
}, false);
})();

//AUTOCOMPLETE

  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    postal_code: 'short_name'
  };

var placesOrigin = new google.maps.places.Autocomplete(document.getElementById('origin'));
var placesDestination = new google.maps.places.Autocomplete(document.getElementById('destination'));

  google.maps.event.addDomListener(window, 'load', function () {
    google.maps.event.addListener(placesOrigin, 'place_changed', function () {
        var place = placesOrigin.getPlace();
        // console.log(place);
        $("#modalOrigin").modal();
        for (var component in componentForm) {
            document.getElementById(component  + 'Origin').value = '';
          }
          
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
              var val = place.address_components[i][componentForm[addressType]];
              document.getElementById(addressType + 'Origin').value = val;
              var streetOrigin = (document.getElementById('routeOrigin').value);
              document.getElementById('nameOrigin').value = place.name;
              if (place.name === streetOrigin || place.name === (streetOrigin + ' ' + document.getElementById('street_numberOrigin').value)) {
                document.getElementById('nameOrigin').value = ''; 
               } if (typeof place.formatted_phone_number != 'undefined' && place.formatted_phone_number) { 
                document.getElementById('phoneOrigin').value = place.formatted_phone_number;

            }
          } 
        }
    });
    google.maps.event.addListener(placesDestination, 'place_changed', function () {
      var place = placesDestination.getPlace();
      $("#modalDestination").modal();
      for (var component in componentForm) {
          document.getElementById(component  + 'Destination').value = '';
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType + 'Destination').value = val;
            var streetDestination = (document.getElementById('routeDestination').value);
            document.getElementById('nameDestination').value = place.name;
            if (place.name === streetDestination || place.name === (streetDestination + ' ' + document.getElementById('street_numberDestination').value)) {
              document.getElementById('nameDestination').value = ''; 
             } if (typeof place.formatted_phone_number != 'undefined' && place.formatted_phone_number) { 
              document.getElementById('phoneDestination').value = place.formatted_phone_number;
            }
            
          } 
        }   
  });
});



function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      placesOrigin.setBounds(circle.getBounds());
      placesDestination.setBounds(circle.getBounds());
    });
  }
};  





// distance matrix

window.addEventListener('load', function distance() {
  var origin = document.getElementById('origin').value;
  var destination = document.getElementById('destination').value;

  // var destination = document.getElementById('routeDestination').value + " " + document.getElementById('street_numberDestination').value + " " + document.getElementById('localityDestination').value + " " + document.getElementById('postal_codeDestination').value;
  var geocoder = new google.maps.Geocoder;
  var service = new google.maps.DistanceMatrixService;
  if (origin !=='' && destination !== '') {
  service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: true,
    avoidTolls: true
  }, function(response, status) {
    console.log(response.rows[0].elements[0].status);
    if (response.rows[0].elements[0].status == 'OK') {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
      var outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '';

      for (var i = 0; i < originList.length; i++) {
        var results = response.rows[i].elements;
        console.log(results);
          for (var j = 0; j < results.length; j++) {
            if ((results[j].distance.value-5000) < 0) {
              outputDiv.innerHTML +=  '<label for="distance">Απόσταση</label><input class="form-control" id="disatance" name="distance" type="text" value="' + results[j].distance.text + '" disabled><label for="duration">Διάρκεια διαδρομής</label><input class="form-control" id="duration" name="duration" type="text" value="' + results[j].duration.text +'" disabled><label for="price">Αξία διαδρομής</label><input class="form-control" id="pice" name="price" type="text" value="5,9€" disabled>';
            } else {
              outputDiv.innerHTML +=  '<label for="distance">Απόσταση</label><input class="form-control" id="disatance" name="distance" type="text" value="' + results[j].distance.text + '" disabled><label for="duration">Διάρκεια διαδρομής</label><input class="form-control" id="duration" name="duration" type="text" value="' + results[j].duration.text +'" disabled><label for="price">Αξία διαδρομής</label><input class="form-control" id="pice" name="price" type="text" value="' + (((results[j].distance.value-5000)/2000)+5,9) + '€" disabled>';
            }
        }
      }
    } else {
      alert('η διαδρομή που ζητήσατε δεν υπάρχει');
    }
  });
}
});


function approvedCustomer() {
  // var socket = io();
  // socket.on('connect', function () {
  //     console.log('Connected to server');
    
  //     socket.emit('createMessage', {
  //       origin: origin,
  //       destination: destination,
  //       distance: distance,
  //       duration: duration

      
  //     });

  //     socket.on('newApproved', function (approved) {
  //     console.log(approved);
  //     var driverMessage = approved.approved.message;
  //     var dvApproved = document.getElementById("dvApproved");
  //     dvApproved.innerHTML = "";
  //     dvApproved.innerHTML += driverMessage;
  //     });
  //   });
  };