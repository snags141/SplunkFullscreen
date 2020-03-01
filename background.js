'use strict';

// Add background listener. This handles enabling/disabling presentation mode/tab rotation
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if(msg=="EnableRotate") {
      rotateTimer(true);
    } else {
      rotateTimer(false);
    }
  });
})

var timerid;
// Initialize startup values
setVar("PresStatus_conf","false"); // Startup value
setVar("enabledStatus_conf","false"); // Startup value
setVar("txtPresSeconds_conf", "30"); // Startup value
setVar("cboxXMLBanner_conf", "true"); // Startup value
setVar("cboxJSONBanner_conf", "true"); // Startup value

// Dynamic function to set variable to local storage
function setVar(varToSet, valueToSet) {
  var setObj = {};
  setObj[varToSet] = valueToSet;
  chrome.storage.local.set({ [varToSet]: valueToSet }, function(){});
}
// Dynamic function to get variable from local storage
function getVar(varToGet) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get([varToGet], function(items){
      resolve(items[varToGet]);
    });
  });
}
// Enable/Disable presentation mode with given timer as specified by the user
function rotateTimer(desiredState) {
  if(desiredState) {
    // Start timer
    getVar("txtPresSeconds_conf").then(function(value) {
      timerid = setInterval(function () {
        chrome.tabs.query({currentWindow: true}, function(tabs) {
          var foundSelected = false;
          for(var i = 0; i <= tabs.length; i++){
            if(i == tabs.length){
              i = 0;
            }
            if (tabs[i].active){
              foundSelected = true;
            }
            // Finding the next tab.
            else if (foundSelected){
              // Selecting the next tab.
              chrome.tabs.update(tabs[i].id, {active: true});
              //chrome.tabs.reload(tabs[i].id); // Optionally reload tab on switch
              return;
            }
          }
        });
      }, parseInt(value*1000));
    });
    
  } else {
    // Stop timer
    clearInterval(timerid);
  }
  
}

