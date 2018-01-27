
      (function() {
        /**
         * Decimal adjustment of a number.
         *
         * @param {String}  type  The type of adjustment.
         * @param {Number}  value The number.
         * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
         * @returns {Number} The adjusted value.
         */
        function decimalAdjust(type, value, exp) {
          // If the exp is undefined or zero...
          if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
          }
          value = +value;
          exp = +exp;
          // If the value is not a number or the exp is not an integer...
          if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
          }
          // If the value is negative...
          if (value < 0) {
            return -decimalAdjust(type, -value, exp);
          }
          // Shift
          value = value.toString().split('e');
          value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
          // Shift back
          value = value.toString().split('e');
          return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        }
      
        // Decimal round
        if (!Math.round10) {
          Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
          };
        }
        // Decimal floor
        if (!Math.floor10) {
          Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
          };
        }
        // Decimal ceil
        if (!Math.ceil10) {
          Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
          };
        }
      })();
      
      
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: 38.076785, lng: 23.814697},
          zoom: 13
        });

        new AutocompleteDirectionsHandler(map);
      }

       /**
        * @constructor
       */
      function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'DRIVING';
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
      }

  

      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
        });

      };

      AutocompleteDirectionsHandler.prototype.route = function() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
          return;
        }
        var me = this;

        this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
        

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [{'placeId': this.originPlaceId}],
            destinations: [{'placeId': this.destinationPlaceId}],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status) {
            if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                window.origin = response.originAddresses;
                window.destination = response.destinationAddresses;
                window.distance = response.rows[0].elements[0].distance.text;
                window.duration = response.rows[0].elements[0].duration.text;
                window.distance_number = (response.rows[0].elements[0].distance.value)/1000;
                window.price = 0;
                console.log(response);
                if (distance_number<=4) {
                    price = 5.99;
                } else {
                    price =Math.ceil10((5.99 + ((((response.rows[0].elements[0].distance.value)/1000)-4)*0.6)), -1);
                }
                // var test = JSON.stringify(response);
                var dvDistance = document.getElementById("dvDistance");
                var dvPrice = document.getElementById("dvPrice");
      
                dvDistance.innerHTML = "";
                dvPrice.innerHTML = "";
              //  dvDistance.innerHTML += "Παραλαβή από: " + test ;
                dvDistance.innerHTML += "Παραλαβή από: " + origin + "<br />";
                dvDistance.innerHTML += "Παράδοση σε: " + destination + "<br />";
                dvDistance.innerHTML += "Distance: " + distance + "<br />";
                dvDistance.innerHTML += "Duration:" + duration + "<br />";
                dvPrice.innerHTML += "Κόστος μεταφοράς : " + price +"€";
                document.getElementById("button").style.display='block';
              
                document.getElementById("button").addEventListener("click", approvedCustomer);
                
                function approvedCustomer() {
                  var socket = io();
                  socket.on('connect', function () {
                      console.log('Connected to server');
                    
                      socket.emit('createMessage', {
                        origin: origin,
                        destination: destination,
                        distance: distance,
                        duration: duration

                      
                      });

                      socket.on('newApproved', function (approved) {
                      console.log(approved);
                      var driverMessage = approved.approved.message;
                      var dvApproved = document.getElementById("dvApproved");
                      dvApproved.innerHTML = "";
                      dvApproved.innerHTML += driverMessage;
                      });
                    });
                  };



            } else {
                alert("Unable to find the distance via road.");
            }
        });

      };
