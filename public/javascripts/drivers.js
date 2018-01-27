var socket = io();
socket.on('newMessage', function (message) {
console.log(message);
var dvInquiry = document.getElementById("dvInquiry");
var driverDestination = message.message.destination[0];
var driverOrigin = message.message.origin[0];
var driverDuration = message.message.duration;
var driverDistance = message.message.distance;
dvInquiry.innerHTML += "Νέο αίτημα <br />";
dvInquiry.innerHTML += "Παραλαβή " + driverOrigin + "<br />";
dvInquiry.innerHTML += "Παράδοση " + driverDestination + "<br />";
dvInquiry.innerHTML += "Χρόνος " + driverDuration + "<br />";
dvInquiry.innerHTML += "Απόσταση " + driverDistance + "<br />";
document.getElementById("button").style.display='block';

  document.getElementById("button").addEventListener("click", approvedDriver);
  
  function approvedDriver() {
    var socket = io();
    socket.on('connect', function () {
        console.log('Connected to server');
        socket.emit('driverApproved', {
          message: "Ο Οδηγός έρχεται"
        });
      });
  };
});
