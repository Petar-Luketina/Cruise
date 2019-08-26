from flask import Flask, render_template
from uuid import uuid1
import time
import jwt
from secrets import iss, OrgUnitId, apiKey
## LEFT OFF ON STEP 6

app = Flask(__name__)

unique = uuid1()
epoch = round(time.time())

@app.route('/')
def checkout():
    payload = {
        'jti': str(unique),
        'iat': epoch,
        'exp': epoch + 3600,
        'iss': iss,
        'OrgUnitId': OrgUnitId,
        'Payload': {
            'OrderDetails': {
                'OrderNumber': str(unique),
                'Amount': '100', # no decimal
                'CurrancyCode': '840',
            }
        },
        'ObjectifyPayload': True,
    }

    jwt_ = jwt.encode(payload, apiKey)

    context = {
        'jwt': jwt_.decode()
    }

    # Step 1: JWT Creation
    #   > jwt.io
    #   > Pass to frontend
    # Step 10: JWT Validation
    return render_template('checkout.html', context=context)


if __name__ == '__main__':
    app.run(debug=True)
