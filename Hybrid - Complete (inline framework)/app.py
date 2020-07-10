from flask import Flask, render_template, request, jsonify, session
import jwt # pip install pyjwt
from time import time as epochtime
from uuid import uuid1 # universally unique ID
from credentials import *
import json
import requests

app = Flask(__name__)
app.secret_key = str(uuid1())

@app.route('/', methods=['GET'])
def checkout():
    session['rand_id'] = str(uuid1())
    session['amount'] = '150.01'
    session['currency'] = '840' # USD
    epoch = round(epochtime()) # round() removes the decimals

    # Step 1: JWT Creation
    #   > jwt.io website
    payload = {
        'OrgUnitId': OrgUnitId,
        'iss': iss,
        'iat': epoch,
        'exp': epoch + 1000,
        'jti': session['rand_id'],
        'Payload': {
            'OrderDetails': {
                'OrderNumber': session['rand_id'],
                'Amount': session['amount'].replace('.', ''), # 100.00 to 10000
                'CurrencyCode': session['currency'],
            }
        },
        'ObjectifyPayload': True,
    }

    jwt_ = jwt.encode(payload, apiKey)

    context = {
        'jwt': jwt_.decode('utf-8'),
    }
    return render_template('checkout.html', context=context)

@app.route('/cmpi_lookup', methods=['POST'])
def cmpi_lookup():
# Step 7:  Create cmpi_lookup and send request
    data = request.get_data().decode('utf-8')
    data = json.loads(data) # JSON string to dictionary
    additions = {
        'MsgType': 'cmpi_lookup',
    	'Version': '1.7',
    	'ProcessorId': pid,
    	'MerchantId': mid,
    	'TransactionPwd': pwd,
        'TransactionType': 'C',
    	'OrderNumber': session['rand_id'],
    	'Amount': session['amount'].replace('.', ''),
    	'CurrencyCode': session['currency'],
        'ACSWindowSize': '03'
    }
    data.update(additions)

# Step 7a: Create cmpi_lookup as XML
    xml_string = '<CardinalMPI>'
    for key, value in data.items():
        xml_string += '<{}>{}</{}>'.format(key, value, key)
    xml_string += '</CardinalMPI>'
    xml_string = "cmpi_msg='{}'".format(xml_string)

# Step 7b: Send cmpi_lookup
    header = {'Content-Type': 'application/x-www-form-urlencoded'}
    response = requests.post(
        environment,
        headers=header,
        data=xml_string,
        )
    print(xml_string)

# Step 8:  Code for the cmpi response (most important part)
    # Turn XML to dictionary
    returned_xml = response.text
    returned_json = {}
    for line in returned_xml.split('>'):
      lines = line.split('</')
      if len(lines) == 2:
        value, key = lines
        returned_json[key] = value
    print(json.dumps(returned_json, indent=2))

    if returned_json['ErrorNo'] != '0':
        # Log these
        return jsonify({'message':'Error with transaction'})
    else:
        if returned_json['Enrolled'] != 'Y' and returned_json['Enrolled'] != 'B':
            # 'Y' means the card is enrolled in 3DS
            # Everything else carries no liability shift
            return jsonify({'message':'No liability shift'})
        else:
            if returned_json['ACSUrl'] == '':
                return jsonify({'message':'Transaction went through 3DS'})
            else:
            # Step 9: Continue with CCA (JS)
                orderObjectV2 = {
                    'OrderDetails': {
                        'TransactionId': returned_json['TransactionId']
                    }
                }

                avoid = ['ProcessorId', 'MerchantId', 'TransactionPwd']
                for key, value in data.items():
                    if key not in avoid:
                        orderObjectV2['OrderDetails'].update({key:value})
                print({returned_json['ACSUrl'], returned_json['Payload']})

                message = {
                    'message': 'Call Cardinal.continue()',
                    'continueData':{
                        'AcsUrl': returned_json['ACSUrl'],
                        'Payload': returned_json['Payload'][:10] + returned_json['Payload'][10:]
                    },
                    'orderObjectV2': orderObjectV2
                }
                return jsonify(message)

@app.route('/jwt_validation', methods=['POST'])
def jwt_validation():
    # Step 10: Code for the CCA response
    # Check for proper response ('A', 'Y')

    # Step 11: JWT Validation
    returned_jwt = request.get_data().decode('utf-8')
    try:
        validate_jwt = jwt.decode(returned_jwt, apiKey, audience=session['rand_id'])
        return jsonify({'message': 'Successful JWT validation'})
    except:
        return jsonify({'message':'JWT Tampering!'}) # stop payment

if __name__ == '__main__':
    app.run(debug=True)
