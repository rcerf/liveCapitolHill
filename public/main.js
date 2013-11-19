$(function(){ // on ready

  var $results = $('.results');
  var $footer = $('.footer-container');
  var $button = $('.btn-primary');
  var $form = $('.form-control');
  var $modal = $('#myModal');

  var postZip = function(e){
    e.preventDefault();
    // window.username = $('option:selected');
      var entry = $('.form-control').val();
      var url = window.location.origin +'/' + entry;
      $modal.modal({
          keyboard: true,
          remote: url
      });
  };

  // var bindLegislator = function(){
  //   $('.legislator-name').on('click', function (e) {
  //     e.preventDefault();
  //     console.log("clicked");
  //     var bioguide = $(this).data('bioguide');
  //     console.log(bioguide);
  //     var url = window.location.origin + '/legislator/' + bioguide;
  //     displayResults(url);
  //   });
  // };


  // var displayResults = function(url){
  // $.get( url, function( data ) {
  //     $(".results").empty();
  //     $(".results").append(data);
  //   });
  // };

  //initiated zip lookup on button click
  $button.on('click', postZip);

  //initiate zip lookup on enter
  $form.on('keyup', function(e){
    e.preventDefault();
    if(e.which === 13){
      postZip(e);
    }
  });
 
  //removes data on modal upon close so new zip code can be entered
  $('body').on('hidden.bs.modal', '.modal', function (e) {
    e.preventDefault();
    $(this).removeData('bs.modal');
  });

  //resizes results dynamically w/ screen size
  $results.css({'height': (($(window).height()*.68))+'px'});
  $(window).resize(function(){
      $results.css({'height': (($(window).height()*.68))+'px'});
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