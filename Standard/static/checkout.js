Cardinal.configure({
    logging: {
        level: "on"
    }
});

Cardinal.on('payments.setupComplete', function(){
    // Do something
});

Cardinal.on("payments.validated", function (data, jwt) {
  console.log(data);
  console.log(jwt);
    switch(data.ActionCode){
      case "SUCCESS":
      break;

      case "NOACTION":
      break;

      case "FAILURE":
      break;

      case "ERROR":
        if (data.ErrorDescription === 'Centinel API connection error on Init.') {
          alert('Please pause your brower\'s adblocker')
        }
        break;
  }
});

Cardinal.setup("init", {
    jwt: document.getElementById("JWTContainer").value
});

// Step 5.  Initialze Songbird
// Step 7.  Order Object Requirements
// Step 8.  Start CCA
// Step 9.  Handing the CCA Response (from Step 4. Listen for Events)
// Step 10. JWT Validation (Start)
