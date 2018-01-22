function distance (origin, destination) {
// var arrayContaining = jasmine.arrayContaining;
// var objectContaining = jasmine.objectContaining;
  var inOneHour = new Date().getTime() + 60 * 60 * 1000;

  function expectOK(response) {
    expect(response.status).toBe(200);
    expect(response.json.status).toBe('OK');
    return response;
    console.log(response);
  }

 
  it('accepts localization options', function(done) {
    googleMaps.distanceMatrix({
      origins: [origin],
      destinations: [destination],
      language: 'en',
      units: 'metric',
      region: 'gr',
      arrival_time: inOneHour,
      mode: 'driving',
      avoid: ['tolls', 'ferries'],
      traffic_model: 'best_guess'
    })
    .asPromise()
    .then(expectOK)
    .then(done, fail);
  });
};

module.exports.distance = distance();