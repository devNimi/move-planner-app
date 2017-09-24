
function loadData() {

    // $ sign is simply used to identify objects as jQuery objects
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $wikiHeaderElem = $('#wikipedia-header')
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // API KEYS
    streetviewKEY = 'AIzaSyB18dAe6j7gfNhJZl0LWyf09SEnsDTlGQI';
    nyTimesKEY = '36c7788cda3b49e4a434e90eb03f98e3';

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    // change the greeting message
    $greeting.text('So, you want to live at ' + address + '!');


    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '?key=' + streetviewKEY ;
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // load nytimes
    var nyTimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    nyTimesUrl += '?' + $.param({
      'api-key': nyTimesKEY,
      'q': cityStr,
      'sort': 'newest'
    });
    $.getJSON( nyTimesUrl, function( data ) {

      if(cityStr){
          $nytHeaderElem.text('New York Times Articles About ' + cityStr)
      } else {
          $nytHeaderElem.text('New York Times Articles')
      }

      // data is the entire JSON passed by NY Times
      var newsArray = data.response.docs;
      // iterate over news array to extract the required info and display it to the page
    	newsArray.forEach(function(news){
        var newsHeadline = news.headline.main;
        var newsUrl = news.web_url;
        var newsContent = news.snippet;
        $('#nytimes-articles').append('<a href="' + newsUrl + ' ">' + newsHeadline + '</a>' );
        $('#nytimes-articles').append('<p>' + newsContent + '</p>' );
    	})
    }).error(function(e){
        //NOTE: As of jQuery 1.8, .error() is deprecated. Use .fail() instead, for higher versions
        $nytHeaderElem.text('New York Times Articles could not be loaded');
    });



    // load wikipedia Articles

    //error handling incase if article doesn;t load
    // note: if article from wikipedia loads we cancel setTimeout using clearTimeout() see the code below
    var wikiRequestTimeout = setTimeout(function(){
      $wikiHeaderElem.text("failed to get wikipedia resources")
    }, 8000)

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    $.ajax({
      url: wikiUrl,
      dataType: 'jsonp',
      // jsonp: 'callback' //redundant code becuase by default name of callback function in url is callback
      success: function (response) {
        var articleList = response[1];
        for (var i = 0; i < articleList.length; i++) {
          articleStr = articleList[i];
          var url = 'https://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
        };
        //cancels the setTimeout
        clearTimeout(wikiRequestTimeout);
      }

    });

    return false;
};


$('#form-container').submit(loadData);
