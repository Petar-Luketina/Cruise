// Step 3.  Configure Songbird
Cardinal.configure({
    logging: {
        level: "on"
    }
});
// Step 4.  Listen for Events
Cardinal.on('payments.setupComplete', function(){
    // Do something
});

Cardinal.on("payments.validated", function (data, jwt) {
    // Step 9.  Handing the CCA Response (from Step 4. Listen for Events)
  switch(data.ActionCode){

    case "SUCCESS":
    // Handle successful transaction, send JWT to backend to verify
    $.ajax({
      sync: 'true',
      type: 'POST',
      url: '/',
      // Step 10. JWT Validation
      data: jwt,
      success: function(jsonResponse) {
    	   console.log('ajaxResponse =', jsonResponse)
      },
      error: function (xhr, status) {
    	   alert( 'Error in backend' )
      }
    });
        break;

    case "NOACTION":
      // No liability shift. Issue is with cardholder
      alert( 'There was an issue with authorizing the payment.',
             'Please try another form of payment.' )
    break;

    case "FAILURE":
      // Handle failed transaction attempt
      alert( 'There was an issue with authorizing the payment.',
             'Please try another form of payment.' )
    break;

    case "ERROR":
      // Handle service level error. Issue is with implementation
      alert( 'There was an issue with authorizing the payment.',
             'Please try another form of payment.' )
    break;
  }
});
// Step 5.  Initialze Songbird
Cardinal.setup("init", {
    jwt: document.getElementById("JWTContainer").value
});
// Step 7.  Order Object Requirements
function getOrderObject() {
  var orderObject = {
    // Authorization: {
    //   AuthorizeAccount: false
    // },
    // Cart: [
    //   {
    //     Name: '',
    //     SKU: '',
    //     Quantity: '',
    //     Description: ''
    //   }
    // ],
    Consumer: {
      Account: {
        AccountNumber: document.getElementById('creditCardNumber').value,
        ExpirationMonth: document.getElementById('expirationDate').value.slice(0,2),
        ExpirationYear: 20 + document.getElementById('expirationDate').value.slice(-2,),
        // CardCode: document.getElementById('cvvCode').value,
        // NameOnAccount: document.getElementById('billingFirst').value + ' ' +
        //                document.getElementById('billingLast').value,
      }
      // ,
      // BillingAddress: {
      //   FullName: document.getElementById('billingFirst').value + ' ' +
      //             document.getElementById('billingLast').value,
      //   FirstName: document.getElementById('billingFirst').value,
      //   MiddleName: '',
      //   LastName: document.getElementById('billingLast').value,
      //   Address1: document.getElementById('billingAddress1').value,
      //   Address2: document.getElementById('billingAddress2').value,
      //   Address3: '',
      //   City: document.getElementById('billingCity').value,
      //   State: document.getElementById('billingState').value,
      //   PostalCode: document.getElementById('billingZip').value,
      //   CountryCode: '',
      //   Phone1: document.getElementById('billingNumber').value,
      //   Phone2: ''
      // }
      // ,
      // Email1: document.getElementById('emailAddress1').value,
      // Email2: '',
      // ShippingAddress: {
      //   FullName: '',
      //   FirstName: '',
      //   MiddleName: '',
      //   LastName: '',
      //   Address1: '',
      //   Address2: '',
      //   Address3: '',
      //   City: '',
      //   State: '',
      //   PostalCode: '',
      //   CountryCode: '',
      //   Phone1: '',
      //   Phone2: ''
      // }
    // },
    // Options: {
    //   EnableCCA: false
    // }
    ,
    OrderDetails: {
      OrderNumber: document.getElementById('orderNumber').value,
      Amount: document.getElementById('amount').innerHTML.slice(9,).replace('.',''),
      CurrencyCode: '840',
      OrderChannel: 'S', // *** Add logic for how the order was placed ***
      // OrderDescription: '',
    // },
    // Token: {
    //   Token: '',
    //   CardCode: 0,
    //   ExpirationMonth: 0,
    //   ExpirationYear: 0
    }
  }
}
  return orderObject;
}

// Step 8.  Start CCA
function startCCA() {
  data = getOrderObject();
  Cardinal.start("cca", data);
}
