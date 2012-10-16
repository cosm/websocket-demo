(function($){ 
  $.fn.digits = function(){ 
    return this.each(function(){ 
      $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
  }
})(jQuery);

$(document).ready(function(){

  // This is my user level GET advanced api key
  var api_key = "LLfnk2zkkn7YUTphaX-D1e-EYAySAKxpOWF5RUQzVm5TRT0g";
  var counter = 0;
  var average = 0;
  var rate = 1;
  var date = new Date;
  var stop = false;

  function updateTags(tags) {
     for(i=0;i<tags.length;i++) {
      $('<li><a href="https://cosm.com/feeds?tag=' + tags[i] + '">' + tags[i] + '</a></li>').prependTo('#recent_tags');
      if ($('#recent_tags > li').size() > 40) {
        $('#recent_tags > li').last().remove()
      }
    }
  }

  cosm.setKey(api_key);

  cosm.subscribe('firehose', function(event, data) {
    if (data) {
      counter++;
      average = (counter / (((new Date) - date)) * 1000).toFixed(2);
      if (!stop && data.tags != undefined) {
        if (counter % rate == 0) {
          updateTags(data.tags);
        }
      }
      $('#counter').html(counter).digits();
      $('#average').html(average).digits();
    }
  });

  $( "#slider" ).slider({
    value:10,
    min: 0,
    max: 11,
    step: 0.5,
    slide: function( event, ui ) {
      $( "#amount" ).val( ui.value );
    },
    change: function( event, ui ) {
              rate = 23 - (ui.value * 2);
            }
  });
  $( "#amount" ).val( $( "#slider" ).slider( "value" ) );

});

