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
    switch(data.ActionCode){
      case "SUCCESS":
      // Handle successful transaction, send JWT to backend to verify
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
// Step 7.  Order Object Requirements
// Step 8.  Start CCA
// Step 9.  Handing the CCA Response (from Step 4. Listen for Events)
// Step 10. JWT Validation (Start)
