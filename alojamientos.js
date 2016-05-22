// Show accomodations from a JSON file in a map.
// JSON file with accomodations is an adaption of the XML file
// with accomodations in Madrid from the open data portal of
// Ayuntamiento de Madrid (as of April 2016)
// Simple version. Doesn't work well if some of the fields are not defined.
// (for example, if there are no pictures)

// Stringfy
//
var markers = []
var colecciones = {}
var google = {}
var dgeneral = {}
var coleccion_selecionada = undefined
var apiKey = 'AIzaSyD3ufxXtcSydhozFQgxeLFMw-eYToi8bIc ';
var HotelSelecionado = undefined
function actulizar_google() {
  html_google = "<p>Hotel selecionado " + accomodations[HotelSelecionado].basicData.name + "</p> <ul>"
  var arr = google[HotelSelecionado]
  for(var foo in google ){
    if(HotelSelecionado==foo){
      console.log(foo)
      var arr = google [foo]
      for (var i = 0 ;i<arr.length;i++) {
        html_google += "<li id='"+arr[i].name+"'><img class='imgGoogle' src='"+ arr[i].img +"'>" + arr[i].name + "</li>"
      }
      
    }
  }
  html_google+="</ul>"
  $("#google").html(html_google)
}

  //html += "<li id='"+resp.displayName+"'>" + resp.displayName + "</li>"

function crearIdGoogle(id_google){
    gapi.client.setApiKey(apiKey);
    name=id_google  
    gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
          'userId': name
        });
        request.execute(function(resp) {
          //image.src = resp.image.url;
          var object = {name:resp.displayName,img:resp.image.url}
          var arr = []
          arr = google[HotelSelecionado]
          if(arr == undefined){
            arr = []
          }
          arr.push(object)          
          google[HotelSelecionado] = arr
          actulizar_google()
        });
      });
}

function sendGoogle() {
  id_google = $("#idGoogle").val()
  var arr = []
    for(no in google){
      if(no == HotelSelecionado){
        arr = google[no]
        for (var i = 0; i < google[no].length; i++) {
          if(id_google == arr[i]){
            alert("id ya almacenado")
            return
          }else{
            crearIdGoogle(id_google)
            /*arr.push(id_google)
            google[no]=arr
            actulizar_google()*/
            return
          }
        }
      }
    }
    crearIdGoogle(id_google)
}


function info_alojados(no) {
  var accomodation = accomodations[no];
  var name = accomodation.basicData.name;
  var desc = accomodation.basicData.body;
  var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
  var html=""

  if (accomodation.extradata.categorias.categoria.subcategorias != undefined){
      var subcat = accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text'];
  }else{
    subcat=""
  }

  html+= '<h2 id="'+no+'">' + name + '</h2>';
  html+= '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>' + desc ;
  $("#infohotel").html(html);
  actulizar_google()

}



function info(no) {
  var accomodation = accomodations[no];
  var name = accomodation.basicData.name;
  var desc = accomodation.basicData.body;
  var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
  var html=""

  if (accomodation.extradata.categorias.categoria.subcategorias != undefined){
      var subcat = accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text'];
  }else{
    subcat=""
  }

  html+= '<div class="infohotel"> <div class="row"> <div class="col-md-6 col-xs-12"><h2 id="'+no+'">' + name + '</h2>';
  html+= '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>' + desc ;
  html+=  '</div> <div class="col-md-6 col-xs-12">';

  return html;
}


function cargar_info(no){
  var accomodation = accomodations[no];
  var html=""

  info_alojados(no)
  html=info(no)
  if (accomodation.multimedia.media != undefined) {
    if(accomodation.multimedia.media.length != undefined){
      html+= '<div id="myCarousel" class="carousel slide" data-ride="carousel"> <ol class="carousel-indicators">'
      html += '<li data-target="#myCarousel"  data-slide-to="0" class="active"></li>'
      if(accomodation.multimedia.media.length != 1){
        for(var i =1; i < accomodation.multimedia.media.length; i++){
          html+= '<li data-target="#myCarousel" data-slide-to="' + i +'"></li>'
        }
      }

      html+= '</ol> <div class="carousel-inner" role="listbox"> <div class="item active">'
      html+= '<img class="imgCarrousel" src="' + accomodation.multimedia.media[0].url + '" alt="Chania"></div>'
      if(accomodation.multimedia.media.length != 1){
        for(var i=1;i < accomodation.multimedia.media.length;i++){
          html+= '<div class="item"> <img class="imgCarrousel" src="' + accomodation.multimedia.media[i].url +   '" alt="Chania"> </div>'
        }
      html+= '</div><a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">'
      html+=  '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'
      html+=  '<span class="sr-only">Previous</span></a>'
      html+= '<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">'
      html+=  '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'
      html+= '<span class="sr-only">Next</span></a>'
      }
    }else{
      html+= '<img src="images/not-found.jpg">';
    }
  }else{
    html+= '<img src="/images/not-found.jpg">';
  }
  html+=  ('</div></div></div></div>');
  $('#desc').html(html);
  $("#desc").css("display", "");
}

function load(){
  $("#formLoad").show()
}

function load_git(){
    colecciones = {}
    google={}
    $.getJSON($("#url").val(), function(data) {
      for(name in data){
        console.log(data)
        console.log(name)
          if(name="colecciones"){
            for(nameC in data[name]){
              newData = data[name]
              colecciones[nameC] = newData[nameC]
            }
          }
          if (name="google"){
            console.log("rellenamoss google")
            for(nameG in data[name]){
              newData = data[name]
              google[nameG] = newData[nameG]
            }
          }
      }
      $("#droppable").show()
      MostrarColecciones()
    })
    $("#formLoad").hide()
}


function save_git(){
  var token = $("#token").val()
  var repo = $("#repo").val()
  var usuario = $("#usuario").val()
  var nombreFichero = $("#fich").val()
  dgeneral["colecciones"] = colecciones
  dgeneral["google"] = google
  var github =  new Github({token:token,auth: "oauth"});
  var repo = github.getRepo(usuario, repo);
  repo.write('gh-pages', nombreFichero, JSON.stringify(dgeneral), 'colecciones', function(err) {});
  $("#formSave").hide()



}

function save(){
  $("#formSave").show()
}

function actualizar_list3(){

    var html = "<p>Colección selecionada " + coleccion_selecionada + "</p> <ul>"
    var arr = colecciones[coleccion_selecionada]
    for(var i =0;i<arr.length;i++){
      html += "<li id='"+arr[i].id+"'>" + arr[i].name+ "</li>"
    }
    html+="</ul>"
    $("#droppable").html(html)
    $("#listSelCol").html($("#droppable").html())
}

function MostrarColecciones(){
  $("#listColecciones").show();
  html="<p>COLEECIONES</p><ul id=colecciones>"
  for(nombre in colecciones){
   html +="<li id='"+ nombre +"' > " +nombre +  "</li>"
  }
  html+="</ul>"
  $("#listColecciones").html(html)
  $('#colecciones li').click(show_hotel);
}

function show_hotel(){
  id = $(this).attr('id');
  coleccion_selecionada = id;
  $("#listSelCol").css("display", "");
  $("#droppable").html("<p>Colección selecionada " + coleccion_selecionada + "</p>")
  actualizar_list3()
}

function submitColeccion(){
  var nombre = $("#formColeccion").val()
  $("#formColeccion").val("")
  for(name in colecciones){
    if(nombre == name){
      alert("Nombre no Valido")
      break;
    }
  }
  var hoteles = [];
  var idGoogle = []
  colecciones[nombre] = hoteles;


  $("#list3").show();
  $("#droppable").show();
  MostrarColecciones()

}

function del(lat,lon){

  for (var i = 0; i < markers.length; i++) {
      if (markers[i]._latlng.lat==lat && markers[i]._latlng.lng==lon){

          map.removeLayer(markers[i]);
          markers.splice(i, 1);
          break;
      }
  };
}

function show_accomodation(){
  var accomodation = accomodations[$(this).attr('no')];
  var no = $(this).attr('no');
  HotelSelecionado = no;
  var lat = accomodation.geoData.latitude;
  var lon = accomodation.geoData.longitude;
  var url = accomodation.basicData.web;
  var name = accomodation.basicData.name;
  var desc = accomodation.basicData.body;
  var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
  var markerexists= false;
  if (accomodation.extradata.categorias.categoria.subcategorias != undefined){
      var subcat = accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text'];
  }else{
    subcat=""
  }

   var marker = L.marker([lat, lon]);
   for (var i = 0; i < markers.length; i++) {
        if (markers[i]._latlng.lat==lat && markers[i]._latlng.lng==lon){
            markerexists = true;
            marker = markers[i];
            break;
        }
    }

    if (!markerexists){
      markers.push(marker);
      marker.addTo(map).bindPopup('<a no="'+ no +'" href="' + url + '">' + name + '</a><br/>' + "<a href='#desc'>+ info</a><button  class='del' onclick='del("+lat+","+lon+")'>Eliminar</button>")

    }
    marker.openPopup();
    map.setView([lat, lon], 15);


};

function get_accomodations(){
  $("#get").hide();
  $.getJSON("alojamientos.json", function(data) {
    accomodations = data.serviceList.service
    var list = '<p>(click on any of them for details and location in the map)</p>'
    list = list + '<div class="scroll "><ul id="sortable">'
    for (var i = 0; i < accomodations.length; i++) {
      list = list + '<li class="ui-state-default" no=' + i + '>' + accomodations[i].basicData.title + '</li>';
    }
    list = list + '</ul><div>';
    $('#list').html(list);

    list = list.replace("sortable","sortable2");
    $('#list2').html(list);

    $("#sortable").sortable({
      revert: true
    });

    $("#sortable2").sortable({
      revert: true
    });


    $( "#droppable" ).droppable({
      drop: function(event,ui) {
        if(coleccion_selecionada == undefined){
          alert("Ninguna coleccion selecionada")
          return
        }
        var no = ui.draggable[0].attributes[0].value;
        var accomodation = accomodations[no];
        var arr = []
        var object = {name:accomodation.basicData.name,id:no}

        arr = colecciones[coleccion_selecionada]
        arr.push(object)
        colecciones[coleccion_selecionada]= arr
        actualizar_list3()
      }
    });


    $('#sortable li').click(show_accomodation);
  });
};

$(document).ready(function() {
  map = L.map('map').setView([40.4175, -3.708], 11);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  $("#get").click(get_accomodations);
  $("#load").click(load);
  $("#save").click(save);
  $("#tabs").tabs();
  map.on("popupopen",function(){
    cargar_info($(this._popup._content).attr('no'))
  })

});
