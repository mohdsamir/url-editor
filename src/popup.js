// Copyright (c) 2015 Mohamed Samir. All rights reserved.

// Query filter to be passed to chrome.tabs.query
var queryInfo = {
  active: true,
  currentWindow: true
};

/**
 * Shorcut function to get element by id.
 * @param {string} id - element id.
 **/
function $(id) {
  return document.getElementById(id);
}

/**
 * Get the current URL.
 * @param {function(string)} callback - called when the URL of the current tab is found.
 **/
function getCurrentTabUrl(callback) {
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

/**
 * Parse the current URL.
 * @param {string} url - Current tab url.
 **/
function ParseCurrentUrl(url) {
	var currentUrl = decodeURIComponent(url);
	var parsedUrl = '';	

	if (currentUrl.indexOf("?") > -1 ) {
		var baseUrl = currentUrl.split("?")[0] + "?\n";
		var query = currentUrl.split("?")[1];
		var queryParams = query.split("&");

		parsedUrl += baseUrl;

    for(i=0; i<queryParams.length; i++){
    	if (i != 0) {
    		parsedUrl += "&";
    	}
      parsedUrl += queryParams[i];
      if (i != queryParams.length-1) {
      	parsedUrl += "\n"
      }
    }
	} else{
		parsedUrl = currentUrl;
	}
	setCurrentUrl(parsedUrl);
}

/**
 * Render the current URL in the textarea.
 * @param {string} url - Current tab url.
 **/
function setCurrentUrl(url) {
  $('urlBody').value = url;
}

/**
 * Submit the new URL
 **/
function submitUrl() {
  var newUrl = $('urlBody').value;
  newUrl = newUrl.replace("\n", "");

  chrome.tabs.query(queryInfo, function (tab) {
    chrome.tabs.update(tab.id, {url: newUrl});
  });
}

/**
 * Open the new URL in new tab
 **/
function newTab() {
  var newUrl = $('urlBody').value;
  newUrl = newUrl.replace("\n", "");

  chrome.tabs.create({url: newUrl});
}

// DOM loaded event listener
document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    ParseCurrentUrl(url);
  });

  // "submit" button cLick event listener
  $('submit').addEventListener('click', submitUrl);
  // "newTab" button cLick event listener
  $('newTab').addEventListener('click', newTab);
});