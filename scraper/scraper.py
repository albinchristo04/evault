"""
EVaultHub - Advanced Football Scraper v2.1
Powered by fotmob-wrapper + SoccerData + Fallbacks.
"""

import os
import json
import logging
import asyncio
import requests
from datetime import datetime, timezone, timedelta

# Library imports
try:
    from fotmob import FotMob
    FOT_AVAILABLE = True
except ImportError:
    FOT_AVAILABLE = False

try:
    import soccerdata as sd
    import pandas as pd
    SD_AVAILABLE = True
except ImportError:
    SD_AVAILABLE = False

# Logger Setup
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Constants
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'scores.json')

async def get_fotmob_wrapper_data():
    """Layer 1: Using fotmob-wrapper"""
    if not FOT_AVAILABLE:
        return []

    logger.info("Attempting Layer 1 (fotmob-wrapper)...")
    matches = []
    try:
        async with FotMob() as fotmob:
            # The library might return a list or a dict depending on version
            data = await fotmob.todays_games()
            
            leagues = []
            if isinstance(data, list):
                leagues = data
            elif isinstance(data, dict):
                leagues = data.get('leagues', [])
            
            for league in leagues:
                if not isinstance(league, dict): continue
                
                league_name = league.get('name', 'General')
                country = league.get('ccode', '')
                
                for m in league.get('matches', []):
                    if not isinstance(m, dict): continue
                    
                    status_obj = m.get('status', {})
                    if status_obj.get('cancelled') or status_obj.get('postponed'):
                        continue
                        
                    status = 'SCHEDULED'
                    if status_obj.get('finished'):
                        status = 'FINISHED'
                    elif status_obj.get('started'):
                        status = 'LIVE'
                    
                    # Safe extraction of team info
                    home_obj = m.get('home', {})
                    away_obj = m.get('away', {})
                    
                    # Ensure we have objects, not strings/None
                    if not isinstance(home_obj, dict): home_obj = {}
                    if not isinstance(away_obj, dict): away_obj = {}
                    
                    h_name = home_obj.get('name')
                    a_name = away_obj.get('name')
                    
                    # Skip if names are missing
                    if not h_name or not a_name: continue
                    
                    live_time = status_obj.get('liveTime', {})
                    if not isinstance(live_time, dict): live_time = {}
                    minute = live_time.get('short') if status == 'LIVE' else None
                    
                    matches.append({
                        'id': f"fm-{m.get('id')}",
                        'home': h_name,
                        'away': a_name,
                        'homeScore': home_obj.get('score'),
                        'awayScore': away_obj.get('score'),
                        'homeImage': f"https://images.fotmob.com/image_resources/logo/teamlogo/{home_obj.get('id')}.png" if home_obj.get('id') else None,
                        'awayImage': f"https://images.fotmob.com/image_resources/logo/teamlogo/{away_obj.get('id')}.png" if away_obj.get('id') else None,
                        'league': league_name,
                        'country': country,
                        'status': status,
                        'minute': minute,
                        'time': status_obj.get('utcTime')
                    })
        logger.info(f"Layer 1 found {len(matches)} matches.")
        return matches
    except Exception as e:
        logger.warning(f"Layer 1 failed: {e}")
        return []

def get_soccerdata_backup():
    """Layer 2: SoccerData"""
    if not SD_AVAILABLE: return []
    logger.info("Attempting Layer 2 (SoccerData)...")
    matches = []
    try:
        leagues = ['ENG-Premier League', 'ESP-La Liga', 'ITA-Serie A', 'GER-Bundesliga', 'FRA-Ligue 1']
        fm_sd = sd.FotMob(leagues=leagues)
        schedule = fm_sd.read_schedule()
        
        if schedule is None or schedule.empty: return []
        
        df = schedule.reset_index()
        df['date'] = pd.to_datetime(df['date'])
        now = datetime.now(timezone.utc)
        
        df_target = df[(df['date'] >= (now - timedelta(hours=6))) & 
                       (df['date'] <= (now + timedelta(hours=18)))]
        
        for _, row in df_target.iterrows():
            if pd.isna(row['home_team']): continue
            
            result = str(row.get('result', ''))
            h_score, a_score = None, None
            status = 'SCHEDULED'
            
            if '-' in result and result != 'nan':
                try:
                    parts = result.split('-')
                    h_score, a_score = int(parts[0].strip()), int(parts[1].strip())
                    status = 'FINISHED'
                except: pass
                
            match_time = row['date'].to_pydatetime()
            if status != 'FINISHED':
                diff = now - match_time
                if timedelta(0) <= diff <= timedelta(minutes=115): status = 'LIVE'
                elif diff > timedelta(minutes=115): status = 'FINISHED'
                
            matches.append({
                'id': f"sd-{hash(str(row['home_team']) + str(row['away_team'])) % 1000000}",
                'home': str(row['home_team']),
                'away': str(row['away_team']),
                'homeScore': h_score,
                'awayScore': a_score,
                'homeImage': None,
                'awayImage': None,
                'league': str(row.get('league', 'Football')),
                'country': str(row.get('country', '')),
                'status': status,
                'minute': None,
                'time': match_time.isoformat()
            })
        logger.info(f"Layer 2 found {len(matches)} matches.")
        return matches
    except Exception as e:
        logger.warning(f"Layer 2 failed: {e}")
        return []

def get_demo_fallback():
    """Layer 3: Demo Data"""
    logger.info("Using Layer 3 (Demo Data)...")
    now = datetime.now(timezone.utc)
    demo = [
        {'home': 'Man City', 'away': 'Liverpool', 'homeScore': 3, 'awayScore': 2, 'status': 'LIVE', 'minute': "89'", 'league': 'Premier League', 'id': 'demo1', 'country': 'ENG'},
        {'home': 'Real Madrid', 'away': 'Barcelona', 'homeScore': 1, 'awayScore': 1, 'status': 'LIVE', 'minute': "54'", 'league': 'La Liga', 'id': 'demo2', 'country': 'ESP'},
        {'home': 'Arsenal', 'away': 'Chelsea', 'status': 'SCHEDULED', 'time': (now + timedelta(hours=3)).isoformat(), 'league': 'Premier League', 'id': 'demo3', 'country': 'ENG'}
    ]
    for m in demo:
        m.setdefault('homeImage', None); m.setdefault('awayImage', None)
        m.setdefault('homeScore', None); m.setdefault('awayScore', None); m.setdefault('time', None)
    return demo

async def scrape():
    logger.info("🚀 EVaultHub Scraper Starting...")
    
    # Run Layers
    matches = await get_fotmob_wrapper_data()
    
    # Combine with SoccerData if Layer 1 was small
    if len(matches) < 10:
        matches += get_soccerdata_backup()
        
    # If still completely empty, use Demo
    if not matches:
        matches = get_demo_fallback()
        
    # Deduplicate & Clean
    cleaned = []
    seen = set()
    for m in matches:
        h = str(m.get('home', '')).strip()
        a = str(m.get('away', '')).strip()
        if not h or h.lower() in ['unknown', 'nan', 'none']: continue
        if not a or a.lower() in ['unknown', 'nan', 'none']: continue
        
        key = f"{h}-{a}"
        if key not in seen:
            cleaned.append(m)
            seen.add(key)
            
    # Priority Sort
    status_order = {'LIVE': 0, 'SCHEDULED': 1, 'FINISHED': 2}
    cleaned.sort(key=lambda x: status_order.get(x['status'], 999))
    
    # Output Creation
    output = {
        'lastUpdated': datetime.now(timezone.utc).isoformat(),
        'matchCount': len(cleaned),
        'liveCount': len([m for m in cleaned if m['status'] == 'LIVE']),
        'matches': cleaned[:100] # Increased limit for better site content
    }
    
    # Write to File
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        
    logger.info(f"✨ Successfully curated {len(output['matches'])} matches.")

if __name__ == '__main__':
    asyncio.run(scrape())