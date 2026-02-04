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
    
    if not match_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing match id'})
        }

    clean_id = match_id
    if match_id.startswith('fm-'):
        clean_id = match_id.replace('fm-', '')

    try:
        data = asyncio.run(fetch_match_data(clean_id))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(data)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

async def fetch_match_data(match_id):
    """Parallel fetching of all relevant match endpoints."""
    async with FotMob(proxy_url="") as fotmob:
        # We target the most data-rich endpoints
        tasks = [
            fotmob.get_match_details(match_id),    # Main stats, lineups, H2H summary
            fotmob.get_match_comments(match_id),   # Play by play
            fotmob.get_match_odds(match_id),       # Betting info
            fotmob.get_tv_listings(match_id, "US") # TV listings (defaulting to US for demo)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Build composite object
        return {
            'details': results[0] if not isinstance(results[0], Exception) else {},
            'comments': results[1] if not isinstance(results[1], Exception) else [],
            'odds': results[2] if not isinstance(results[2], Exception) else {},
            'tv': results[3] if not isinstance(results[3], Exception) else {}
        }
