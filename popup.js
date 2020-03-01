{
  'use strict';

  // If x is null, update UI from current conf
  // if x == "toggle", then reverse current UI and conf values
  function set_btnEnable(x) {
    getVar("enabledStatus_conf").then(function(value) {
      if(x == null) {
        if (value == "true"){
          console.log("[SplunkFullscreen] Promise value is true");
          document.getElementById("btnEnable").innerHTML = "Disable";
          document.getElementById('cboxXMLBanner').disabled = true;
          document.getElementById('cboxJSONBanner').disabled = true;
         } else {
          console.log("[SplunkFullscreen] Promise value is false");
          document.getElementById("btnEnable").innerHTML = "Enable";
          document.getElementById('cboxXMLBanner').disabled = false;
          document.getElementById('cboxJSONBanner').disabled = false;
         }
      } else if(x == "toggle") {
        console.log("[SplunkFullscreen] current enable status = "+getVar("enabledStatus_conf"));
        if(value == "true") {
          console.log("[SplunkFullscreen] enabledStatus_conf = true, showing banners");
          document.getElementById("btnEnable").innerHTML = "Enable";
          setVar("enabledStatus_conf","false");
          document.getElementById('cboxXMLBanner').disabled = false;
          document.getElementById('cboxJSONBanner').disabled = false;
          showBanners();
         } else {
          console.log("[SplunkFullscreen] enabledStatus_conf = false, hiding banners");
          document.getElementById("btnEnable").innerHTML = "Disable";
          setVar("enabledStatus_conf","true");
          document.getElementById('cboxXMLBanner').disabled = true;
          document.getElementById('cboxJSONBanner').disabled = true;
          hideBanners();
         }
      }
    });
  }
  // Update Presentation mode status in UI
  function set_lblPresStatus(x) {
    var port = chrome.extension.connect({
      name: "Sample Communication"
    });
    getVar("PresStatus_conf").then(function(value) {
      if(x == null) {
        if(value == "true") { 
          document.getElementById("lblPresStatus").value = "Presentation On";
          document.getElementById("lblPresStatus").style.backgroundColor = "Green";
        } else {
          document.getElementById("lblPresStatus").value = "Presentation Off";
          document.getElementById("lblPresStatus").style.backgroundColor = "#ffc107";
          }
      } else if(x == "toggle") { 
        if(value == "true") {
          console.log("PresMode is on, turning off...");
          document.getElementById("lblPresStatus").value = "Presentation Off";
          document.getElementById("lblPresStatus").style.backgroundColor = "#ffc107";
          setVar("PresStatus_conf","false");
          port.postMessage("DisableRotate");

        } else {
          console.log("PresMode is off, turning on...");
          document.getElementById("lblPresStatus").value = "Presentation On";
          document.getElementById("lblPresStatus").style.backgroundColor = "Green";
          setVar("PresStatus_conf","true");
          port.postMessage("EnableRotate");
         }
      }
    });
  }
  // Update UI for XML banner checkbox
  function set_cboxXMLBanner(x) {
    console.log("Setting XML banner checkbox");
    getVar("cboxXMLBanner_conf").then(function(value) {
      if(x == null) { 
        if(value == "true") {
          document.getElementById("cboxXMLBanner").checked = true;
         } else {
          document.getElementById("cboxXMLBanner").checked = false;
         }
      } else if(x == "toggle") {
        if(value == "true") {
          document.getElementById("cboxXMLBanner").checked = false;
          setVar("cboxXMLBanner_conf", "false");
         } else {
          document.getElementById("cboxXMLBanner").checked = true;
          setVar("cboxXMLBanner_conf", "true");
         }
      }
    }); 
  }
  // Update UI for JSON banner checkbox
  function set_cboxJSONBanner(x) {
    console.log("Setting JSON banner checkbox");
    getVar("cboxJSONBanner_conf").then(function(value) {
      if(x == null) {
        if(value == "true") {
          document.getElementById("cboxJSONBanner").checked = true;
         } else {
          document.getElementById("cboxJSONBanner").checked = false;
         }
      } else if(x == "toggle") { 
        if(value == "true") {
            document.getElementById("cboxJSONBanner").checked = false;
            setVar("cboxJSONBanner_conf", "false");
          } else {
            document.getElementById("cboxJSONBanner").checked = true;
            setVar("cboxJSONBanner_conf", "true");
          }
      }
    });
  }
  // Update UI for Presentation timer
  function set_txtPresSeconds(x) {
    if(x == null) {
      getVar("txtPresSeconds_conf").then(function(value) {
        document.getElementById("txtPresSeconds").value = value;
      });
    } else {
      document.getElementById("txtPresSeconds").value = x;
    }
  }
  // Function to handle showing banners
  function showBanners() {
    console.log("[SplunkFullscreen] Showing banners");
    runCode('document.getElementById("header").style.display = "";');
    runCode('document.getElementsByTagName("Header")[0].style.display = "";');
    runCode('document.querySelectorAll(\'[data-test="dashboard-toolbar"]\')[0].style.display = ""');
  }
  // Function to handle hiding banners
  function hideBanners() {
    // If XML banner setting enabled, hide JSON banner
    getVar("cboxXMLBanner_conf").then(function(value) {
      if(value) {
        console.log("[SplunkFullscreen] Hiding XML banner");
        runCode('document.getElementById("header").style.display = "none";');
      }
    });
    // If JSON banner setting enabled, hide JSON banner
    getVar("cboxJSONBanner_conf").then(function(value) {
      if(value) {
        console.log("[SplunkFullscreen] Hiding JSON banner");
        runCode('document.getElementsByTagName("Header")[0].style.display = "none";');
        runCode('document.querySelectorAll(\'[data-test="dashboard-toolbar"]\')[0].style.display = "none";');
      }
    });
  }
  // Run query in all tabs - Used to hide/show specific HTML elements as per showBanners() and hideBanners()
  function runCode(codeString) {
    chrome.tabs.query({},function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if(tabs[i].url.startsWith("http") || tabs[i].url.startsWith("https")) {
          chrome.tabs.executeScript(tabs[i].id, {code: codeString});
        }
      }
    });
  }
  // Set initial values if not configured, else load in current settings from local storage & update UI
  getVar("enabledStatus_conf").then(function(value) {
    console.log("enabledStatus_conf = "+value);
    if(value == undefined) {
      // Set enabled status
      setVar("enabledStatus_conf", "false");
      // Set pres. toggle
      setVar("presStatus_conf", "false");
      // Set cboxXMLBanner
      setVar("cboxXMLBanner_conf","true");
      // Set cboxJSONBanner
      setVar("cboxJSONBanner_conf", "true");
      // Set pres. second count
      setVar("txtPresSeconds_conf","30");
    } else { 
      // Get enabled status
      set_btnEnable();
      // Get pres. toggle
      set_lblPresStatus();
      // Get cboxXMLBanner
      set_cboxXMLBanner();
      // Get cboxJSONBanner
      set_cboxJSONBanner();
      // Get pres. second count
      set_txtPresSeconds();
    }
  });

  // Define UI elements in popup
  let btnEnable = document.getElementById('btnEnable');
  let cboxXMLBanner = document.getElementById('cboxXMLBanner');
  let cboxJSONBanner = document.getElementById('cboxJSONBanner');
  let txtPresSeconds = document.getElementById('txtPresSeconds');
  let btnPresToggle = document.getElementById('btnPresToggle');
  // Enable button onclick handler
  btnEnable.onclick = function(element) {
    set_btnEnable("toggle");
  };
  // Checkbox onchange handler
  cboxXMLBanner.onchange = function(element) {
    if(element.target.checked) {
      setVar("cboxXMLBanner_conf", "true");
    } else {
      setVar("cboxXMLBanner_conf", "false");
    }
  }
  // Checkbox onchange handler
  cboxJSONBanner.onchange = function(element) {
    if(element.target.checked) {
      setVar("cboxJSONBanner_conf", "true");
    } else {
      setVar("cboxJSONBanner_conf", "false");
    }
  }
  // Presentation mode timer onchange handler
  txtPresSeconds.onchange = function(element) {
    // Validate that an integer was given
    if( Number.isInteger(parseInt(element.target.value))) {
      setVar("txtPresSeconds_conf",element.target.value);
    }
  }
  // Presentation mode onclick button handler
  btnPresToggle.onclick = function(element) {
    set_lblPresStatus("toggle");
  };
  // Dynamic function to set variable to local storage
  function setVar(varToSet, valueToSet) {
    console.log("[SplunkFullscreen] setVar(): Setting "+varToSet+" with value "+valueToSet);
    var setObj = {};
    setObj[varToSet] = valueToSet;
    chrome.storage.local.set({ [varToSet]: valueToSet }, function(){});
  }
  // Dynamic function to get variable from local storage and return promise
  function getVar(varToGet) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get([varToGet], function(items){
        resolve(items[varToGet]);
      });
    });
    return result;
  }
}