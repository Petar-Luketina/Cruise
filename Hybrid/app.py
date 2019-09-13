from flask import Flask, render_template
import jwt # pip install pyjwt
from time import time as epochtime
from uuid import uuid1 # universally unique ID
import secret # contains apiKey

app = Flask(__name__)

iss = '5d24c60c0e423d1d10e08544'
OrgUnitId = '5d1bb7c1e0919f09246dd5ab'
apiKey = secret.apiKey

@app.route('/')
def checkout():

    rand_id = str(uuid1())
    epoch = round(epochtime()) # round() removes the decimals
    amount = '100.00'

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
                'CurrancyCode': '840',
            }
        },
        'ObjectifyPayload': True,
    }
    jwt_ = jwt.encode(payload, apiKey)

    context = {
        'jwt': jwt_.decode('utf-8') # decodes from bytes to string
    }
    #   > Pass to frontend
    return render_template('checkout.html', context=context)
    # Step 8:  Create cmpi_lookup and send request
    # Step 9:  Code for the cmpi response
    # Step 10: Continue with CCA (JS)
    # Step 11: Code for the CCA response
    # Step 12: JWT Validation

if __name__ == '__main__':
    app.run(debug=True)
