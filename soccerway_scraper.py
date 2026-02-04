import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import time
from typing import List, Dict

class SoccerwayScraperError(Exception):
    """Custom exception for scraper errors"""
    pass

class SoccerwayScraper:
    """
    A web scraper for extracting football match scores from soccerway.com
    """
    
    def __init__(self, timeout: int = 10, delay: float = 1):
        """
        Initialize the scraper
        
        Args:
            timeout: Request timeout in seconds
            delay: Delay between requests in seconds (be respectful)
        """
        self.base_url = "https://www.soccerway.com"
        self.timeout = timeout
        self.delay = delay
        self.session = requests.Session()
        # Set a realistic user agent
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def fetch_page(self, url: str) -> BeautifulSoup:
        """
        Fetch and parse a webpage
        
        Args:
            url: URL to fetch
            
        Returns:
            BeautifulSoup object of the parsed HTML
        """
        try:
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            time.sleep(self.delay)  # Be respectful to the server
            return BeautifulSoup(response.content, 'html.parser')
        except requests.RequestException as e:
            raise SoccerwayScraperError(f"Failed to fetch {url}: {str(e)}")
    
    def scrape_matches(self, page_url: str = None) -> List[Dict]:
        """
        Scrape match scores from a given page
        
        Args:
            page_url: URL of the page to scrape. If None, uses the main page.
            
        Returns:
            List of dictionaries containing match information
        """
        if page_url is None:
            page_url = self.base_url
        
        try:
            soup = self.fetch_page(page_url)
            matches = []
            
            # Look for match rows - soccerway uses specific class structures
            # Note: The exact selectors may need adjustment based on current HTML structure
            match_rows = soup.find_all('div', class_='match-row')
            
            if not match_rows:
                # Try alternative selectors if the first one doesn't work
                match_rows = soup.find_all('tr', class_='match')
            
            for row in match_rows:
                try:
                    match_data = self._parse_match_row(row)
                    if match_data:
                        matches.append(match_data)
                except Exception as e:
                    print(f"Warning: Could not parse match row: {str(e)}")
                    continue
            
            return matches
        
        except SoccerwayScraperError:
            raise
        except Exception as e:
            raise SoccerwayScraperError(f"Error scraping matches: {str(e)}")
    
    def _parse_match_row(self, row) -> Dict:
        """
        Parse a single match row to extract relevant information
        
        Args:
            row: BeautifulSoup element representing a match
            
        Returns:
            Dictionary with match information or None if parsing fails
        """
        match_info = {}
        
        try:
            # Extract time/date
            time_elem = row.find('td', class_='time')
            if time_elem:
                match_info['time'] = time_elem.get_text(strip=True)
            
            # Extract home team
            home_team = row.find('td', class_='team-a')
            if home_team:
                match_info['home_team'] = home_team.get_text(strip=True)
            
            # Extract away team
            away_team = row.find('td', class_='team-b')
            if away_team:
                match_info['away_team'] = away_team.get_text(strip=True)
            
            # Extract score
            score = row.find('td', class_='score')
            if score:
                match_info['score'] = score.get_text(strip=True)
            
            # Extract league/competition
            league = row.find('td', class_='tournament')
            if league:
                match_info['league'] = league.get_text(strip=True)
            
            return match_info if match_info else None
        
        except Exception as e:
            print(f"Error parsing match row: {str(e)}")
            return None
    
    def scrape_by_date(self, date_str: str) -> List[Dict]:
        """
        Scrape matches for a specific date
        
        Args:
            date_str: Date string (format: YYYY-MM-DD)
            
        Returns:
            List of matches on that date
        """
        # Construct URL for specific date
        url = f"{self.base_url}/match/?date={date_str}"
        return self.scrape_matches(url)
    
    def scrape_by_league(self, league_id: int) -> List[Dict]:
        """
        Scrape matches for a specific league
        
        Args:
            league_id: Soccerway league ID
            
        Returns:
            List of matches in that league
        """
        url = f"{self.base_url}/national/tournament/{league_id}/"
        return self.scrape_matches(url)
    
    def save_to_csv(self, matches: List[Dict], filename: str = 'matches.csv'):
        """
        Save scraped matches to CSV file
        
        Args:
            matches: List of match dictionaries
            filename: Output CSV filename
        """
        if not matches:
            print("No matches to save")
            return
        
        df = pd.DataFrame(matches)
        df.to_csv(filename, index=False)
        print(f"Data saved to {filename}")
    
    def close(self):
        """Close the session"""
        self.session.close()


def main():
    """Example usage of the scraper"""
    
    scraper = SoccerwayScraper(delay=2)  # 2 second delay between requests
    
    try:
        # Example 1: Scrape the main page
        print("Scraping main page...")
        matches = scraper.scrape_matches()
        
        if matches:
            print(f"\nFound {len(matches)} matches:")
            for match in matches[:5]:  # Print first 5
                print(f"  {match}")
            
            # Save to CSV
            scraper.save_to_csv(matches)
        else:
            print("No matches found. The HTML structure may have changed.")
        
        # Example 2: Scrape by date
        # today = datetime.now().strftime('%Y-%m-%d')
        # print(f"\nScraping matches for {today}...")
        # matches_today = scraper.scrape_by_date(today)
        # print(f"Found {len(matches_today)} matches today")
        
    except SoccerwayScraperError as e:
        print(f"Scraper error: {e}")
    finally:
        scraper.close()


if __name__ == "__main__":
    main()
