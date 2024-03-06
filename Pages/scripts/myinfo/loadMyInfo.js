setTimeout(() => {
    const currentMemberInfo = postRequest('membership/getInfo').then((data) => {
        debugLog(data);
        assignCustomerInfo(data[0]);
    });
}, 400);



function assignCustomerInfo(membershipInfo) {
    setDefaultValues('customerInfo', {
        'customerID': membershipInfo.customerid,
        'username': membershipInfo.username,
        'newPassword': '',
        'confirmNewPassword': '',
        'email': membershipInfo.email,
        'fName': membershipInfo.fname,
        'mName': membershipInfo.mname,
        'lName': membershipInfo.lname,
        'address': membershipInfo.address,
        'state': membershipInfo.state,
        'city': membershipInfo.city,
        'zipcode': membershipInfo.zipcode,
        'sex': membershipInfo.sex,
        'joinDate': dateToStr(membershipInfo.joindate.substring(0,10))
    });
}

