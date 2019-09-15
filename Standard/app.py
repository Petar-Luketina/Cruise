from flask import Flask, render_template, request
import jwt # pip install pyjwt
from time import time as epochtime
from uuid import uuid1 # universally unique ID function
import secret # contains apiKey

app = Flask(__name__)

iss = '5d24c60c0e423d1d10e08544'
OrgUnitId = '5d1bb7c1e0919f09246dd5ab'
apiKey = secret.apiKey

have_rand_id = [False]

@app.route('/', methods=['GET', 'POST'])
def checkout():

    if have_rand_id[0] == False:
        global rand_id
        rand_id = str(uuid1()) # string of universally unique ID
        have_rand_id[0] = True

    if request.method == 'GET':
        epoch = round(epochtime()) # round() removes the decimal
        amount = '100.00' # arbitrary amount that changes depending on the cart

        # Step 1: JWT Creation
        #   > jwt.io website
        payload = {
            'jti': rand_id,
            'iat': epoch,
            'iss': iss,
            'OrgUnitId': OrgUnitId,
            'Payload': {
                'OrderDetails': {
                    'OrderNumber': 'Order: ' + rand_id[10:],
                    'Amount': amount.replace('.', ''), # 100.00 to 10000
                    'CurrencyCode': '840',
                }
            },
            'ObjectifyPayload': True,
        }
        jwt_ = jwt.encode(payload, apiKey) # creates the JWT

        context = {
            'jwt': jwt_.decode('utf-8'), # decodes from bytes to string
                                         # needed for Songbird initialze
            'amount': amount, # needed for JS order object
            'orderNumber': 'Order: ' + rand_id[10:] # needed for JS order object
        }
        #   > Pass to frontend
        return render_template('checkout.html', context=context)

    elif request.method == 'POST':
    # Step 10: JWT Validation
        returned_jwt = request.get_data().decode('utf-8')
        try:
            validate_jwt = jwt.decode(returned_jwt, apiKey, audience=rand_id)
            print(validate_jwt)
            return 'Successful JWT validation' # proceed with payment
        except:
            return 'JWT Tampering!' # stop payment

if __name__ == '__main__':
    app.run(debug=True)
