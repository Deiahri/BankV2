
getElementById('loginBtn').onclick = () => {
    let loginData = {
        'username': getElementValue(getElementById('username')),
        'password': getElementValue(getElementById('password')),
    }

    postRequest('membership/login', loginData).then((data) => {
        debugLog(data);
        if(data.redirect) {
            window.location.href = `${window.location.origin}/${data.redirect}`;
        }
        else {
            promptAlertV2(data);
            console.log(data);
        }
    }).catch(() => {
        return {
          'message': `could not connect to ${APIEndpointBase}/${'login'}`
        }
    });
};