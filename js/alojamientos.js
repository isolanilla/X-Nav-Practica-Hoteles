// Show accomodations from a JSON file in a map.
// JSON file with accomodations is an adaption of the XML file
// with accomodations in Madrid from the open data portal of
// Ayuntamiento de Madrid (as of April 2016)
// Simple version. Doesn't work well if some of the fields are not defined.
// (for example, if there are no pictures)
//
function show_accomodation(){
  var accomodation = accomodations[$(this).attr('no')];
  var lat = accomodation.geoData.latitude;
  var lon = accomodation.geoData.longitude;
  var url = accomodation.basicData.web;
  var name = accomodation.basicData.name;
  var desc = accomodation.basicData.body;
  var img = accomodation.multimedia.media[0].url;
  var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
  var subcat = accomodation.extradata.categorias.categoria
   .subcategorias.subcategoria.item[1]['#text'];
  L.marker([lat, lon]).addTo(map)
	 .bindPopup('<a href="' + url + '">' + name + '</a><br/>')
	 .openPopup();
  map.setView([lat, lon], 15);
  $('#desc').html('<div class="infohotel"><h2>' + name + '</h2>'
   + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>'
   + desc + '<img src="' + img + '""></div>');
};

function get_accomodations(){
  $.getJSON("alojamientos.json", function(data) {
    $('#get').html('');
    accomodations = data.serviceList.service
    var list = '<p>(click on any of them for details and location in the map)</p>'
    list = list + '<div class="scroll "><ul>'
    for (var i = 0; i < accomodations.length; i++) {
      list = list + '<li no=' + i + '>' + accomodations[i].basicData.title + '</li>';
    }
    list = list + '</ul><div>';
    $('#list').html(list);
    $('li').click(show_accomodation);
  });
};

$(document).ready(function() {
  map = L.map('map').setView([40.4175, -3.708], 11);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  $("#get").click(get_accomodations);
});
