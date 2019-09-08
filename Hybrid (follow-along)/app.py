from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def checkout():
    # Step 1: JWT Creation
    #   > jwt.io website
    #   > Pass to frontend
    # Step 8:  Create cmpi_lookup and send request
    # Step 9:  Code for the cmpi response
    # Step 10: Continue with CCA (JS)
    # Step 11: Code for the CCA response
    # Step 12: JWT Validation
    return render_template('checkout.html')

if __name__ == '__main__':
    app.run(debug=True)
