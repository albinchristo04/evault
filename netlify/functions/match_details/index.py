import json
import asyncio
from fotmob import FotMob

def handler(event, context):
    """
    Netlify Function Handler (Python)
    Fetches comprehensive match data from FotMob for 'fully loaded' site.
    """
    query_params = event.get('queryStringParameters', {})
    match_id = query_params.get('id')
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }

    if not match_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Missing match id'})
        }

    clean_id_str = match_id
    if match_id.startswith('fm-'):
        clean_id_str = match_id.replace('fm-', '')

    try:
        clean_id = int(clean_id_str)
    except ValueError:
         return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid match id format'})
        }

    try:
        data = asyncio.run(fetch_match_data(clean_id))
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(data)
        }
    except Exception as e:
        print(f"Match Details Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e), 'details': 'Error orchestrating data fetch'})
        }

async def fetch_with_timeout(coro, timeout=5, default=None):
    try:
        return await asyncio.wait_for(coro, timeout=timeout)
    except Exception as e:
        print(f"Fetch failed or timed out: {e}")
        return default

async def fetch_match_data(match_id):
    """Parallel fetching of all relevant match endpoints with timeouts."""
    async with FotMob(proxy_url="") as fotmob:
        # We target the most data-rich endpoints
        # Note: some endpoints might fail for certain matches, we handle those gracefully
        results = await asyncio.gather(
            fetch_with_timeout(fotmob.get_match_details(match_id), timeout=8, default={}),
            fetch_with_timeout(fotmob.get_match_comments(match_id), timeout=5, default=[]),
            fetch_with_timeout(fotmob.get_match_odds(match_id), timeout=5, default={}),
            fetch_with_timeout(fotmob.get_tv_listings(match_id, "US"), timeout=5, default={}),
            return_exceptions=True
        )
        
        # results will contain the defaults or exceptions if gather itself failed (unlikely)
        return {
            'details': results[0] if not isinstance(results[0], Exception) else {},
            'comments': results[1] if not isinstance(results[1], Exception) else [],
            'odds': results[2] if not isinstance(results[2], Exception) else {},
            'tv': results[3] if not isinstance(results[3], Exception) else {}
        }
