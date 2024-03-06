const APIEndpointBase = "https://bankv2.deiahribank.xyz/";
async function postRequest(urlEnd = "", data = {}, requestHeaders = null) {
  if(!requestHeaders) {
    requestHeaders = {
      "Content-Type": "application/json",
      'Origin': origin,
      'cookies': document.cookie
    }
  }
  if(!requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = "application/json";
  }
  if(!requestHeaders['Origin']) {
    requestHeaders.Origin = origin;
  }

  try {
      // Default options are marked with *
      const response = await fetch(`${APIEndpointBase}/${urlEnd}`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: requestHeaders,
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      }).catch((err) => {
        return {
          'message': `Something went wrong. Server may be down.`,
          'inputs': [
            {
                'text': 'Okay',
                'type': 'a',
                'classList': 'btn btn-lg btn-success mt-1',
            }
          ],
        };
      });
      let jsonData = await response.json(); // parses JSON response into native JavaScript objects
      processCookies(jsonData.cookie);
      if(jsonData.message === 'unauthorized') {
        document.location.href = `${document.location.origin}/BankV2/unauthorized.html`;
      }
      return jsonData;
  }
  catch(err) {
    promptAlertV2({
      'message': `Something went wrong. Server may be down.`,
      'inputs': [
        {
            'text': 'Okay',
            'type': 'a',
            'classList': 'btn btn-lg btn-success mt-1',
        }
      ],
    });
  }
}

async function processCookies(cookieJSON) {
  if(cookieJSON) {
    let currentCookie = '';
    for(let key of Object.keys(cookieJSON)) {
      currentCookie = `${key}=${cookieJSON[key].value};`;
      if (cookieJSON[key].expires) {
        currentCookie += ` expires=${cookieJSON[key].value};`
      }
      document.cookie = currentCookie;
      debugLog('cookie added', key);
    }
  }
}
