window.onload = function() {
    getVar("enabledStatus_conf").then(function(isEnabled) {
        console.log("enabledStatus is "+isEnabled);
        if(isEnabled == "true") {
            getVar("cboxXMLBanner_conf").then(function(value) {
              if(value) {
                console.log("[SplunkFullscreen] Hiding XML banner");
                try {
                    document.getElementById("header").style.display = "none"; // ***
                }
                catch(error) {
                    console.warn("[Splunk Fullscreen] No banner element (header) found on page");
                }
              } else {
                try {
                    document.getElementById("header").style.display = ""; // ***
                }
                catch(error) {
                    console.warn("[Splunk Fullscreen] No banner element (header) found on page");
                }
              }
            });

            getVar("cboxJSONBanner_conf").then(function(value) {
                if(value) {
                    console.log("[SplunkFullscreen] Hiding JSON banner");
                    try {
                        document.getElementsByTagName("Header")[0].style.display = "none"; // ***
                    }
                    catch(error) {
                        console.warn("[Splunk Fullscreen] No banner element (Header) found on page");
                    }
                    try {
                        document.querySelectorAll('[data-test="dashboard-toolbar"]')[0].style.display = "none"; // ***
                    }
                    catch(error) {
                        console.warn("[Splunk Fullscreen] No banner element (dashboard-toolbar) found on page");
                    }           
                } else {
                    try {
                        document.getElementsByTagName("Header")[0].style.display = ""; // ***
                    }
                    catch(error) {
                        console.warn("[Splunk Fullscreen] No banner element (Header) found on page");
                    }
                    try {
                        document.querySelectorAll('[data-test="dashboard-toolbar"]')[0].style.display = ""; // ***
                    }
                    catch(error) {
                        console.warn("[Splunk Fullscreen] No banner element (dashboard-toolbar) found on page");
                    }           
                }
            });
        }
    });
        
      
        
};

function getVar(varToGet) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get([varToGet], function(items){
        console.log("Returning promise for "+varToGet + ", value is "+items[varToGet]);
        resolve(items[varToGet]);
      });
    });
}