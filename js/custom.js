(function ($) {

	new WOW().init();

	jQuery(window).load(function() { 
		jQuery("#preloader").delay(50).fadeOut("slow");
		jQuery("#load").delay(50).fadeOut("slow");
	});


	//jQuery to collapse the navbar on scroll
	$(window).scroll(function() {
		if ($(".navbar").offset().top > 50) {
			$(".navbar-fixed-top").addClass("top-nav-collapse");
		} else {
			$(".navbar-fixed-top").removeClass("top-nav-collapse");
		}
	});

	//jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$('.navbar-nav li a').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
		$('.page-scroll a').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
	});

    // -- modal --
    function iframeModal() {
        var title = $(this).attr('data-title');
        var url = $(this).attr('data-url');

        return eModal
            .iframe(url, title);
	}
	
	// -- make series into button
	$(".series-content, .series-header-content, .races-more-content, .news-content").on("click",function() {
		//window.location = $(this).find("a").attr("href"); 
		var url = $(this).find("a").attr("href");
		window.open(url, 'hrc');
		return false;
	});


	var now = moment().format("YYYY-MM-DD");
	var year = moment().format("YYYY");
	
	var proxy = 'https://cors-anywhere.herokuapp.com/';


	// -- local races from active.com
	var activeURL = '//api.amp.active.com/v2/search/?near=37075&radius=25&query=running&current_page=1&per_page=10&sort=date_asc&category=races&start_date=' + now + '..&exclude_children=true&api_key=gd2sf8g9a6def5ysksj8nxr9';

	var finalURL = proxy + activeURL;

	var local_calendar = $('#local-calendar');

	//local_calendar.html('<i class="fas fa-spinner fa-pulse"></i>');

	// With the get JSON (frequently used) method
	$.getJSON(finalURL, function (data) {
		var output = "";
		for (var i in data.results) {
			output += "<a href='" + data.results[i].homePageUrlAdr + "' target='hrc'>";
			output += "<div class='media media-container'>";
			output += "<div class='media-left media-middle'>";
			output += "<img class='media-object' src='" + data.results[i].logoUrlAdr.replace(/^http:/i, '') + "' alt=''>";
			output += "</div>";
			output += "<div class='media-body text-left'>";
			output += "<h4 class='media-heading text-left'>" + data.results[i].assetName + "</h4>";
			output += "<div><i class='far fa-clock' aria-hidden='true'></i> " + moment(data.results[i].activityStartDate).format("dddd, MMMM DD, YYYY") + "</div>";
			output += "<div><i class='fas fa-map-marker-alt' aria-hidden='true'></i> " + data.results[i].place.placeName + " &#8226; " + data.results[i].place.addressLine1Txt + " " + data.results[i].place.cityName + ", " + data.results[i].place.stateProvinceCode + " " + data.results[i].place.postalCode + "</div>";
			output += "<div>";
			for (var a in data.results[i].assetAttributes) {
				output += "<span class='label label-primary'>" + data.results[i].assetAttributes[a].attribute.attributeValue + "</span> ";
			}
			output += "</div>";
			output += "</div>";
			output += "</div>";
			output += "</a>";
		}
		local_calendar.html(output);
	});

	// -- news feed
	var newsURL = '/news.json?start_date=' + now;

	var group_news = $('#group-news');

	$.getJSON(newsURL, function (data) {
		var output = "";
		var news_count = 0;
		for (var i in data.results) {
			if (moment(data.results[i].date).diff(now, 'days') >= 0 ) {
				news_count++;
				output += "<div class='news news-content'>";
				output += "<div class='news-body text-left'>";
				output += "<h4 class='news-heading text-left'>" + data.results[i].title + "</h4>";
				output += "<a href='" + data.results[i].url + "' target='hrc'>";
				output += "<div class='news-item'>";
				output += "<i class='far fa-clock' aria-hidden='true'></i> " + moment(data.results[i].date).format("dddd, MMMM DD, YYYY") + " &#8226; " + data.results[i].time + "</div>";
				output += "<div class='news-item'>";
				output += "<i class='fas fa-map-marker-alt' aria-hidden='true'></i> " + data.results[i].location + "</div>";
				output += "</a>";
				output += "</div>";
				output += "</div>";
				if (news_count === 3) { break; }
			}
		}
		group_news.html(output);
	});


  /**
   *  -- series races feed
   */
  var seriesURL = "https://www.hendersonvilleraceseries.com/"+ year + "_race_series.json?start_date=" + now;

  /**
   *  -- race alerts --
   */
  var race_series = $("#race-series");

  $.getJSON(seriesURL, function(data) {

    var output = "";
    for (var i in data.results) {
      output += "<li class='series-item' data-wow-delay='0.6s'>";
      output += "<div class='series-content'>";
      output += "<h5>" + data.results[i].title + "</h5>";
      output += "<p>";
      output += "<a href='" + data.results[i].url + "' target='hrs'>";
      output += "<img src='img/" + data.results[i].logo + "' width='150' alt='" + data.results[i].title + "' />";
      output += "</a>";
      output += "</p>";
      output += "<h6>" + moment(data.results[i].date).format("MMMM DD, YYYY") + " &#8226; " + data.results[i].time + "</h6>";
      output += "</div>";
      output += "</li>";
    }
    race_series.html(output);
  });

  /**
   *  -- race alerts --
   */
  var race_alert = $("#race-alert");

  $.getJSON(seriesURL, function(data) {

    var output = "";
    var alert_level = "";
    for (var i in data.results) {
      var days_to_race = moment(data.results[i].date).diff(now, "days");
      if (days_to_race > 0 && days_to_race <= 14) {
        alert_level = ( days_to_race <= 7 ) ? "alert-danger" : "alert-warning";
        output += "<div class='alert-content " + alert_level + " text-center " + data.results[i].tags + "'>";
        // output += "<div class='alert alert-warning' role='alert'>";
        output += "<div class='col-md-4 alert-left'>";
        output += "<h5>Registration Alert</h5>";
        output += "<div>" + days_to_race + " days till race</div>";
        output += "</div>";
        output += "<div class='col-md-4'>";
        output += "<h4><a href='" + data.results[i].url + "' target='hrs'>" + data.results[i].title + "</a></h4>";
        output += "<div class=''>";
        output += "<i class='far fa-clock' aria-hidden='true'></i> " + moment(data.results[i].date).format("dddd MMMM DD, YYYY");
        output += " &#8226; " + data.results[i].time;
        output += "</div>";
        output += "<div class=''>";
        output += "<i class='fas fa-map-marker-alt' aria-hidden='true'></i> " + data.results[i].location;
        output += "</div>";
        output += "</div>";
        output += "<div class='col-md-4 text-center'>";
        output += "<a href='" + data.results[i].register + "' target='hrs'>";
        output += "<img src='img/athlink_register.png' height='35' alt='athlink'>";
        output += "</a>";
        output += "</div>";
        output += "</div>";
      }
    }
    race_alert.html(output);
  });

})(jQuery);
