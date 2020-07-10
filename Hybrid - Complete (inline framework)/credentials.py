staging = True

# for JWT
apiKey = ''
iss = '5d24c60c0e423d1d10e08544'
OrgUnitId = '5d1bb7c1e0919f09246dd5ab'

# for lookup
pid = '202'
mid = 'pluketina_test'
pwd = ''

# endpoint for staging (test) or production
if staging:
    environment = 'https://centineltest.cardinalcommerce.com/maps/txns.asp'
else:
    environment = ''
