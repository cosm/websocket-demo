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
  var api_key = "Sgu3QtSJAYrmLCRyjh9VUO1enKCnLyTnbDaEb5rrzW0";
  var counter = 0;
  var average = 0;
  var date = new Date;
  
  function formatTimestamp(ts) {
    return(ts.replace(/(\..{6}Z)$/, "").replace("T", " "));
  }

  function subscribe(ws, api_key) {
    ws.send('{"headers":{"X-PachubeApiKey":"' + api_key + '"}, "method":"subscribe", "resource":"/#"}');
  }
 
  function unsubscribe(ws, api_key) {
    ws.send('{"headers":{"X-PachubeApiKey":"' + api_key + '"}, "method":"unsubscribe", "resource":"/#"}');
  }

  function updateRecentTags(tags) {
    for(i=0;i<tags.length;i++) {
      $('<li><a href="http://www.pachube.com/tags/' + tags[i] + '">☞ ' + tags[i] + '</a></li>').prependTo('#recent_tags');
      if ($('#recent_tags > li').size() > 20) {
        $('#recent_tags > li').last().remove()
      }
    }
  }

  // Use the Pachube beta websocket server
  ws = new WebSocket("ws://beta.pachube.com:8080/");

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
      if (counter % 19 == 0) {
        if (response.body.tags != undefined) {
          updateRecentTags(response.body.tags);
        }
        $('#counter').html(counter).digits();
      }
      $('#average').html(average).digits();
    }
  }
  
});

