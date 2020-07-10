// Step 3.  Configure Songbird
Cardinal.configure({
  logging: {
    debug: 'on',
    level: 'verbose'
  },
  maxRequestRetries: 2,
  payment: {
    framework: 'inline',
    displayExitButton: true
  }
});

var sessionId;
// Step 4.  Listen for Events
Cardinal.on('payments.setupComplete', function(data){
  console.log(data);
  sessionId = data.sessionId
});

Cardinal.on("payments.validated", function (data, jwt) {
  console.log('FROM payments.validated');
  console.log(data);
  switch(data.ActionCode){
    case "SUCCESS":
      console.log(jwt);
      validate_jwt(jwt);
    break;
    case "NOACTION":
    // Handle no actionable outcome
    break;
    case "FAILURE":
    // Handle failed transaction attempt
    break;
    case "ERROR":
    // Handle service level error
    break;
  }
});

// Step 5.  Initialze Songbird
Cardinal.setup("init", {
    jwt: document.getElementById("JWTContainer").value
});

console.log('JWT:', document.getElementById("JWTContainer").value);

function getOrderObject() {
  var orderObject = {
    CardNumber: document.getElementById('creditCardNumber').value,
    CardExpMonth: document.getElementById('expirationDate').value.slice(0,2),
    CardExpYear: 20 + document.getElementById('expirationDate').value.slice(-2,),
    CardCode: document.getElementById('cvvCode').value,
    BillingFirstName: document.getElementById('billingFirst').value,
    BillingLastName: document.getElementById('billingLast').value,
    BillingAddress1: document.getElementById('billingAddress1').value,
    BillingAddress2: document.getElementById('billingAddress2').value,
    BillingAddress3: '',
    BillingCity: document.getElementById('billingCity').value,
    BillingState: document.getElementById('billingState').value,
    BillingPostalCode: document.getElementById('billingZip').value,
    BillingCountryCode: 'US',
    MobilePhone: document.getElementById('billingNumber').value,
    Email: document.getElementById('emailAddress1').value,
    DFReferenceId: sessionId
  };
  return orderObject;
};

// Step 7.  Create cmpi_lookup and send request
function startCCA() {
  data = getOrderObject();
  $.ajax({
    sync: 'true',
    type: 'POST',
    url: '/cmpi_lookup',
    data: JSON.stringify(data),
    success: function(message) {
      if (message.message == 'Call Cardinal.continue()') {
        var continueData = message.continueData;
        var orderObjectV2 = message.orderObjectV2;
        binproc(continueData, orderObjectV2)
      }
      else {
        alert(message.message)
      };
    },
    error: function(xhr, status) {
      alert( 'Error in backend' )
    }
  });
};

function binproc(continueData, orderObjectV2) {
  var pan = document.getElementById('creditCardNumber').value
  Cardinal.trigger('bin.process', pan)
  .then(function(results){
    if(results.Status) {
      // Step 10. Continue with CCA
      Cardinal.continue('cca', continueData, orderObjectV2);
    } else {
      console.alert('There was an issue processing the card number:', results.Status)
    }
  })
}

// Step 12. JWT Validation
function validate_jwt(jwt) {
  $.ajax({
    sync: 'true',
    type: 'POST',
    url: '/jwt_validation',
    data: jwt,
    success: function(message) {
      if (message.message == 'Successful JWT validation') {
        alert('Validated CCA')
      }
      else {
        alert('ERROR:', message.message)
      };
    },
    error: function(xhr, status) {
      alert('Error in backend')
    }
  });
};
