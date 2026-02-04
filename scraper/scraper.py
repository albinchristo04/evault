"""
EVaultHub - Enhanced Live Football Scores Scraper
Using SoccerData for high-quality match information.

This scraper uses:
1. SoccerData (FotMob/Sofascore) for match verification.
2. Direct API fallback for live updates (Speed optimization).
3. Robust demo fallback for empty states.
"""

import os
import json
import logging
from datetime import datetime, timezone, timedelta

# Try to import soccerdata but handle failure gracefully
try:
    import soccerdata as sd
    import pandas as pd
    SOCCERDATA_AVAILABLE = True
except ImportError:
    SOCCERDATA_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Configuration
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'scores.json')

def get_matches_from_soccerdata():
    """
    Attempts to fetch today's matches using soccerdata library.
    Note: soccerdata is designed for historical data, so we adapt it for today.
    """
    if not SOCCERDATA_AVAILABLE:
        logger.warning("SoccerData library not found. Skipping...")
        return []

    logger.info("Attempting to fetch matches using SoccerData (FotMob)...")
    matches = []
    
    try:
        # We only track major leagues to keep it fast
        leagues = ['ENG-Premier League', 'ESP-La Liga', 'GER-Bundesliga', 'ITA-Serie A', 'FRA-Ligue 1']
        
        # SoccerData initialization
        # We use a try-except here because some league IDs might change or fail
        fm = sd.FotMob(leagues=leagues)
        
        # read_schedule returns the whole season, which is heavy. 
        # We try to get it and filter.
        schedule = fm.read_schedule()
        
        if schedule.empty:
            return []

        # Reset index to get 'date', 'home_team', 'away_team' as columns
        df = schedule.reset_index()
        df['date'] = pd.to_datetime(df['date'])
        
        # Filter for the last 12h and next 24h
        now = datetime.now(timezone.utc)
        df_today = df[(df['date'] >= (now - timedelta(hours=12))) & 
                      (df['date'] <= (now + timedelta(hours=24)))]
        
        for _, row in df_today.iterrows():
            result = str(row.get('result', ''))
            home_score = None
            away_score = None
            status = 'SCHEDULED'
            
            # Parse score if available
            if result and '-' in result and result != 'nan':
                try:
                    parts = result.split('-')
                    home_score = int(parts[0].strip())
                    away_score = int(parts[1].strip())
                    status = 'FINISHED'
                except:
                    pass
            
            # Determine if it's currently LIVE based on match time
            match_time = row['date'].to_pydatetime()
            if status != 'FINISHED':
                diff = now - match_time
                if timedelta(0) <= diff <= timedelta(minutes=115):
                    status = 'LIVE'
                    # Minute approximation or keep as LIVE
                elif diff > timedelta(minutes=115):
                    status = 'FINISHED'

            matches.append({
                'id': f"sd-{hash(str(row['home_team']) + str(row['away_team'])) % 1000000}",
                'home': row['home_team'],
                'away': row['away_team'],
                'homeScore': home_score,
                'awayScore': away_score,
                'homeImage': None,
                'awayImage': None,
                'league': row.get('league', 'General'),
                'country': row.get('country', 'Europe'),
                'status': status,
                'minute': None,
                'time': match_time.isoformat()
            })
            
    except Exception as e:
        logger.error(f"SoccerData processing error: {e}")
        
    return matches

def get_fallback_matches():
    """
    Direct API scrape from Sofascore/FotMob (similar to soccerdata internal calls)
    This is much faster for real-time updates.
    """
    import requests
    matches = []
    
    try:
        today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        url = f'https://api.sofascore.com/api/v1/sport/football/scheduled-events/{today}'
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            events = response.json().get('events', [])
            for event in events[:50]:
                try:
                    home = event.get('homeTeam', {}).get('name')
                    away = event.get('awayTeam', {}).get('name')
                    if not home or not away: continue
                    
                    status_type = event.get('status', {}).get('type', '').lower()
                    status = 'SCHEDULED'
                    if status_type == 'finished': status = 'FINISHED'
                    elif status_type == 'inprogress': status = 'LIVE'
                    
                    match = {
                        'id': str(event.get('id')),
                        'home': home,
                        'away': away,
                        'homeScore': event.get('homeScore', {}).get('current'),
                        'awayScore': event.get('awayScore', {}).get('current'),
                        'homeImage': f"https://api.sofascore.app/api/v1/team/{event.get('homeTeam', {}).get('id')}/image",
                        'awayImage': f"https://api.sofascore.app/api/v1/team/{event.get('awayTeam', {}).get('id')}/image",
                        'league': event.get('tournament', {}).get('name', 'General'),
                        'country': event.get('tournament', {}).get('category', {}).get('name', ''),
                        'status': status,
                        'minute': event.get('status', {}).get('description') if status == 'LIVE' else None,
                        'time': datetime.fromtimestamp(event.get('startTimestamp'), tz=timezone.utc).isoformat() if event.get('startTimestamp') else None
                    }
                    matches.append(match)
                except:
                    continue
    except Exception as e:
        logger.error(f"Fallback API error: {e}")
        
    return matches

def get_demo_matches():
    """Ensures site never looks broken."""
    now = datetime.now(timezone.utc)
    demo = [
        {'home': 'Man City', 'away': 'Liverpool', 'homeScore': 2, 'awayScore': 1, 'status': 'LIVE', 'minute': "72'", 'league': 'Premier League', 'id': 'demo1'},
        {'home': 'Real Madrid', 'away': 'Barcelona', 'homeScore': 0, 'awayScore': 0, 'status': 'LIVE', 'minute': "15'", 'league': 'La Liga', 'id': 'demo2'},
        {'home': 'Arsenal', 'away': 'Chelsea', 'status': 'SCHEDULED', 'time': (now + timedelta(hours=3)).isoformat(), 'league': 'Premier League', 'id': 'demo3'},
    ]
    for m in demo:
        m.update({'homeImage': None, 'awayImage': None, 'country': 'England', 'time': m.get('time') or now.isoformat()})
        m.setdefault('homeScore', None); m.setdefault('awayScore', None)
    return demo

def main():
    logger.info("Starting Scraper...")
    
    # 1. Try SoccerData (High Quality but slow/complex)
    matches = get_matches_from_soccerdata()
    
    # 2. If empty, try direct API (Fast & Reliable)
    if not matches:
        logger.info("SoccerData empty or failed. Using direct API fallback...")
        matches = get_fallback_matches()
        
    # 3. If still empty, use Demo
    if not matches:
        logger.info("All sources failed. Using demo data to keep site alive...")
        matches = get_demo_matches()
        
    # Final cleanup & Deduplication
    unique_matches = []
    seen = set()
    for m in matches:
        key = f"{m['home']}-{m['away']}"
        if key not in seen:
            unique_matches.append(m)
            seen.add(key)
            
    # Sort
    status_order = {'LIVE': 0, 'SCHEDULED': 1, 'FINISHED': 2}
    unique_matches.sort(key=lambda x: status_order.get(x['status'], 999))
    
    # Output
    output = {
        'lastUpdated': datetime.now(timezone.utc).isoformat(),
        'matchCount': len(unique_matches),
        'liveCount': len([m for m in unique_matches if m['status'] == 'LIVE']),
        'matches': unique_matches
    }
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        
    logger.info(f"Successfully saved {len(unique_matches)} matches.")

if __name__ == '__main__':
    main()