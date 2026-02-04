from standings import handler
import json

event = {
    'queryStringParameters': {'id': '47'}
}
context = {}

result = handler(event, context)
print(json.dumps(result, indent=2))
