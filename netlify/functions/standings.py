import json
import asyncio
from fotmob import FotMob

def handler(event, context):
    """
    Netlify Function for League Standings.
    """
    query_params = event.get('queryStringParameters', {})
    league_id = query_params.get('id')
    
    if not league_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing league id'})
        }

    try:
        data = asyncio.run(fetch_standings(league_id))
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

async def fetch_standings(league_id):
    async with FotMob(proxy_url="") as fotmob:
        # Get standings
        standings = await fotmob.standings(league_id)
        return standings
