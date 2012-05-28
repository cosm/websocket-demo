(function($){ 
  $.fn.digits = function(){ 
    return this.each(function(){ 
      $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
  }
})(jQuery);

$(document).ready(function(){

  if(!("WebSocket" in window)) {
    alert("I'm afraid your browser does not support WebSockets.\nTry the latest build of Chrome.");
    return;
  }
 
  // This is my user level GET advanced api key
  var api_key = "df-kQrokOLB5zFK1FFC6sT6rTpsvaONPj6nQDZxvU8_a-a7mDET3ptrFphRg8Lgf";
  var counter = 0;
  var average = 0;
  var rate = 1;
  var date = new Date;
  var stop = false;
  
  function formatTimestamp(ts) {
    return(ts.replace(/(\..{6}Z)$/, "").replace("T", " "));
  }

  function subscribe(ws, api_key) {
    ws.send('{"headers":{"X-PachubeApiKey":"' + api_key + '"}, "method":"subscribe", "resource":"/#"}');
  }
 
  function unsubscribe(ws, api_key) {
    ws.send('{"headers":{"X-PachubeApiKey":"' + api_key + '"}, "method":"unsubscribe", "resource":"/#"}');
  }

  function updateTags(tags) {
     for(i=0;i<tags.length;i++) {
      $('<li><a href="http://www.pachube.com/tags/' + tags[i] + '">' + tags[i] + '</a></li>').prependTo('#recent_tags');
      if ($('#recent_tags > li').size() > 40) {
        $('#recent_tags > li').last().remove()
      }
    }
  }

  // Use the Pachube beta websocket server
  ws = new WebSocket("ws://api.cosm.com:8080/");

  ws.onerror = function(evt) {
    alert("Could not open WebSocket connection.");
  }

  ws.onclose = function(evt) {
    alert("WebSocket connection closed. Try refreshing your browser.");
  }

  ws.onopen = function(evt) {
    $('#counter_start').html(date.toUTCString());
    subscribe(ws, api_key);
  }

  ws.onmessage = function(evt) {
    data = evt.data;
    response = JSON.parse(data);
    if (response.body) {
      counter++;
      average = (counter / (((new Date) - date)) * 1000).toFixed(2);
      if (!stop && response.body.tags != undefined) {
        if (counter % rate == 0) {
          updateTags(response.body.tags);
        }
      }
      $('#counter').html(counter).digits();
      $('#average').html(average).digits();
    }
  }

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

  $("#recent_tags a").livequery("mouseover", function() {
    stop = true;
  });

  $("#recent_tags a").livequery("mouseout", function() {
    stop = false;
  });

});

