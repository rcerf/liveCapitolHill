$(function(){ // on ready


  $('.results').css({'height': (($(window).height()*.76))+'px'});
  $(window).resize(function(){
      $('.results').css({'height': (($(window).height()*.76))+'px'});
  });

  $('.heading').css({'height': (($(window).height()*.08))+'px'});
  $(window).resize(function(){
      $('.heading').css({'height': (($(window).height()*.08))+'px'});
  });

  $('.footer-container').css({'height': (($(window).height()*.005))+'px'});
  $(window).resize(function(){
      $('.footer-container').css({'height': (($(window).height()*.005))+'px'});
  });


  // $(document).bind('DOMNodeInserted', function(event) {
  //   $('.legislator').on('click', function (e) {
  //     e.preventDefault();
  //     var bioguide = $(this).data('bioguide');
  //   }

  //     );
  // }); 

  // var displayResults = function(url){
  //   $.get( url, function( data ) {
  //       $(".results").empty();
  //       $(".results").append(data);
  //   });
  // };


  

  var postZip = function(e){
    e.preventDefault();
    // window.username = $('option:selected');
      var entry = $('.form-control').val();
      var url = window.location.origin +'/' + entry;
      console.log(entry);
      $('#myModal').modal({
          keyboard: true,
          remote: url
      });
  };

  $('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
  });

  $('.btn-primary').on('click', postZip);
});