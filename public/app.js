$(function(){ // on ready

  var displayResults = function(url){
    $.get( url, function( data ) {
      $(".results").empty();
      $(".results").append(data);
    });
  };
  

  var postZip = function(e){
    e.preventDefault();
    // window.username = $('option:selected');
      var entry = $('.form-control').val();
      var url = window.location.origin +'/legislator/' + entry;
      console.log(entry);
      displayResults(url);
  };

  $('.btn').on('click', postZip);
});