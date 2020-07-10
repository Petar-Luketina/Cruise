Cardinal.on('ui.inline.setup', function (htmlTemplate, details, resolve, reject) {
  // htmlTemplate = htmlTemplate.replace('height="400"', 'height="700"')
  try {
    var container; // The element we will inject the HTML template into
    if (htmlTemplate !== undefined && details !== undefined) {
      // Depending on your integration you may need to account for other items when processing different payment types
      switch (details.paymentType) {
        case 'CCA':
          // Process CCA authentication screen
          switch (details.data.mode) {
            case 'static':
              // Inject Iframe into DOM in visible spot
              container = document.getElementById('my-visible-wrapper');
              break;
            case 'suppress':
              // Inject Iframe into DOM out of view
              container = document.getElementById('my-hidden-wrapper');
              break;
            default:
              throw new Error("Unsupported inline mode found [" + details.data.mode + "]");
          }
          break;
        default:
          throw new Error("Unsupported inline payment type found [" + details.paymentType + "]");
      }
      // Because the template we get from Songbird is a string template, we need to inject it as innerHTML
      container.innerHTML = htmlTemplate;
      // Inform Songbird that we have successfully injected the iframe into the DOM and the transaction can proceed forward
      resolve();
    } else {
      throw new Error("Unable to process request due to invalid arguments");
    }

  } catch (error) {
    // An error occurred, we need to inform Songbird that an error occurred so Songbird can abondon the transaction and trigger the 'payments.validated' event with an error
    reject(error);
  }
});

Cardinal.on('ui.loading.render', function() {
  document.getElementById('Cardinal-container').style.display = 'block';
});

Cardinal.on('ui.render', function() {
  document.getElementById('Cardinal-container').style.display = 'block';
});

Cardinal.on('ui.loading.close', function() {
    document.getElementById('Cardinal-container').style.display = 'none';
});

Cardinal.on('ui.close', function() {
    document.getElementById('Cardinal-container').style.display = 'none';
});
