$(function(){ // on ready

  var $results = $('.results');
  var $footer = $('.footer-container');
  var $button = $('.btn-primary');




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
  
  //removes data on modal upon close so new zip code can be entered
  $('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
  });
  
  //initiated Zip lookup on button click
  $button.on('click', postZip);


  //resizes results dynamically w/ screen size
  $results.css({'height': (($(window).height()*.74))+'px'});
  $(window).resize(function(){
      $results.css({'height': (($(window).height()*.74))+'px'});
  });

  //resizes footer dynamically with screen size
  $footer.css({'height': (($(window).height()*.005))+'px'});
  $(window).resize(function(){
      $footer.css({'height': (($(window).height()*.005))+'px'});
  });

  //Hack Reactor sash
  $('body').append(
    '<a href="http://hackreactor.com"> \
    <img style="position: fixed; top: 3.5em; right: 0; border: 0;" \
    src="http://i.imgur.com/x86kKmF.png" \
    alt="Built at Hack Reactor"> \
    </a>');
});