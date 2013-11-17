$(function(){ // on ready

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

  $('.btn-primary').on('click', postZip);
});