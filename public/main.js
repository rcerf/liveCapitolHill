$(function(){ // on ready


  $('.results').css({'height': (($(window).height()*.75))+'px'});
  $(window).resize(function(){
      $('.results').css({'height': (($(window).height()*.75))+'px'});
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