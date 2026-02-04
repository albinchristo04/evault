from match_details import handler
import json

event = {
    'queryStringParameters': {'id': '4965847'} 
}
context = {}

try:
    result = handler(event, context)
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Handler failed: {e}")
