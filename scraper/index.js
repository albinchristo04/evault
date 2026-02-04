/**
 * EVaultHub - Live Football Scores Scraper
 * 
 * Scrapes live football match data from Flashscore
 * Adapted from: https://github.com/gustavofariaa/FlashscoreScraping
 * 
 * Features:
 * - Extracts live, scheduled, and finished matches
 * - Gets team names, scores, league info
 * - Outputs structured JSON for the frontend
 * - Designed for GitHub Actions automation
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    baseUrl: 'https://www.flashscore.com/football/',
    outputPath: path.join(__dirname, '..', 'public', 'data', 'scores.json'),
    timeout: 60000,
    retries: 3,
    headless: true
};

/**
 * Parse match status from Flashscore element text
 */
function parseStatus(statusText) {
    if (!statusText) return { status: 'SCHEDULED', minute: null };

    const text = statusText.trim().toUpperCase();

    if (text === 'FT' || text === 'AET' || text === 'PEN' || text.includes('FINISHED')) {
        return { status: 'FINISHED', minute: null };
    }

    if (text === 'HT') {
        return { status: 'LIVE', minute: 'HT' };
    }

    // Match minute patterns like "45'" or "90+3'"
    const minuteMatch = text.match(/^(\d+(?:\+\d+)?)[''′]?$/);
    if (minuteMatch) {
        return { status: 'LIVE', minute: minuteMatch[1] };
    }

    // Check for time format (scheduled match)
    if (text.includes(':')) {
        return { status: 'SCHEDULED', minute: null, time: statusText.trim() };
    }

    return { status: 'SCHEDULED', minute: null };
}

/**
 * Extract match data from a single match element
 */
async function extractMatchData(matchElement, page) {
    try {
        // Get match ID from data attribute or generate one
        const matchId = await matchElement.getAttribute('id') ||
            `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Extract team names
        const homeTeam = await matchElement.$eval(
            '.event__participant--home',
            el => el.textContent?.trim() || 'Unknown'
        ).catch(() => 'Unknown');

        const awayTeam = await matchElement.$eval(
            '.event__participant--away',
            el => el.textContent?.trim() || 'Unknown'
        ).catch(() => 'Unknown');

        // Extract scores
        const homeScore = await matchElement.$eval(
            '.event__score--home',
            el => {
                const text = el.textContent?.trim();
                return text && text !== '-' ? parseInt(text, 10) : null;
            }
        ).catch(() => null);

        const awayScore = await matchElement.$eval(
            '.event__score--away',
            el => {
                const text = el.textContent?.trim();
                return text && text !== '-' ? parseInt(text, 10) : null;
            }
        ).catch(() => null);

        // Extract status/time
        const statusText = await matchElement.$eval(
            '.event__stage--block, .event__time',
            el => el.textContent?.trim() || ''
        ).catch(() => '');

        const { status, minute, time } = parseStatus(statusText);

        // Extract league info from header
        let league = 'Unknown League';
        let country = '';

        try {
            // Try to find the league header above this match
            const leagueHeader = await matchElement.evaluateHandle(el => {
                let prev = el.previousElementSibling;
                while (prev) {
                    if (prev.classList.contains('event__header')) {
                        return prev;
                    }
                    prev = prev.previousElementSibling;
                }
                return null;
            });

            if (leagueHeader) {
                const leagueText = await leagueHeader.evaluate(el => {
                    const titleEl = el.querySelector('.event__title--name');
                    return titleEl ? titleEl.textContent?.trim() : '';
                });

                if (leagueText) {
                    // Parse "COUNTRY: League Name" format
                    const parts = leagueText.split(':');
                    if (parts.length >= 2) {
                        country = parts[0].trim();
                        league = parts.slice(1).join(':').trim();
                    } else {
                        league = leagueText;
                    }
                }
            }
        } catch (e) {
            // League extraction failed, use defaults
        }

        // Get team logos if available
        const homeImage = await matchElement.$eval(
            '.event__logo--home img',
            el => el.src || null
        ).catch(() => null);

        const awayImage = await matchElement.$eval(
            '.event__logo--away img',
            el => el.src || null
        ).catch(() => null);

        return {
            id: matchId,
            home: homeTeam,
            away: awayTeam,
            homeScore,
            awayScore,
            homeImage,
            awayImage,
            league,
            country,
            status,
            minute: minute || null,
            time: time || null
        };

    } catch (error) {
        console.error('Error extracting match data:', error.message);
        return null;
    }
}

/**
 * Main scraping function
 */
async function scrapeFlashscore() {
    console.log('🚀 Starting Flashscore scraper...');
    console.log(`📅 Time: ${new Date().toISOString()}`);

    let browser = null;
    let matches = [];

    try {
        // Launch browser
        browser = await chromium.launch({
            headless: CONFIG.headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US'
        });

        const page = await context.newPage();

        // Block unnecessary resources for speed
        await page.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                route.abort();
            } else {
                route.continue();
            }
        });

        console.log('📡 Navigating to Flashscore...');

        // Navigate to football page
        await page.goto(CONFIG.baseUrl, {
            waitUntil: 'networkidle',
            timeout: CONFIG.timeout
        });

        // Wait for matches to load
        await page.waitForSelector('.event__match, .sportName', {
            timeout: CONFIG.timeout
        }).catch(() => {
            console.log('⚠️ Match selector not found, page might have different structure');
        });

        // Give extra time for dynamic content
        await page.waitForTimeout(2000);

        console.log('🔍 Extracting match data...');

        // Get all match elements
        const matchElements = await page.$$('.event__match');
        console.log(`📊 Found ${matchElements.length} matches`);

        // Extract data from each match
        for (const matchElement of matchElements) {
            const matchData = await extractMatchData(matchElement, page);
            if (matchData) {
                matches.push(matchData);
            }
        }

        console.log(`✅ Successfully extracted ${matches.length} matches`);

    } catch (error) {
        console.error('❌ Scraping error:', error.message);

        // If scraping fails, try to use cached data
        if (fs.existsSync(CONFIG.outputPath)) {
            console.log('📦 Using cached data...');
            const cached = JSON.parse(fs.readFileSync(CONFIG.outputPath, 'utf-8'));
            matches = cached.matches || [];
        }

    } finally {
        if (browser) {
            await browser.close();
        }
    }

    // Sort matches: LIVE first, then SCHEDULED, then FINISHED
    const statusOrder = { 'LIVE': 0, 'SCHEDULED': 1, 'FINISHED': 2 };
    matches.sort((a, b) => {
        const orderA = statusOrder[a.status] ?? 999;
        const orderB = statusOrder[b.status] ?? 999;
        return orderA - orderB;
    });

    // Create output data
    const output = {
        lastUpdated: new Date().toISOString(),
        matchCount: matches.length,
        liveCount: matches.filter(m => m.status === 'LIVE').length,
        matches
    };

    // Ensure output directory exists
    const outputDir = path.dirname(CONFIG.outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(CONFIG.outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Saved to ${CONFIG.outputPath}`);

    // Summary
    console.log('\n📈 Summary:');
    console.log(`   Total matches: ${output.matchCount}`);
    console.log(`   Live matches: ${output.liveCount}`);
    console.log(`   Scheduled: ${matches.filter(m => m.status === 'SCHEDULED').length}`);
    console.log(`   Finished: ${matches.filter(m => m.status === 'FINISHED').length}`);

    return output;
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    scrapeFlashscore()
        .then(() => {
            console.log('\n✨ Scraping complete!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n💥 Fatal error:', error);
            process.exit(1);
        });
}

export { scrapeFlashscore };
