import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LeagueFilter from './components/LeagueFilter'
import MatchList from './components/MatchList'
import Footer from './components/Footer'
import AdBanner from './components/AdBanner'

function App() {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedLeague, setSelectedLeague] = useState('all')
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchMatches = async () => {
        try {
            const response = await fetch('/data/scores.json')
            if (!response.ok) throw new Error('Failed to fetch scores')
            const data = await response.json()
            setMatches(data.matches || [])
            setLastUpdated(data.lastUpdated || new Date().toISOString())
            setError(null)
        } catch (err) {
            console.error('Error fetching matches:', err)
            setError('Unable to load live scores. Retrying...')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMatches()
        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchMatches, 60000)
        return () => clearInterval(interval)
    }, [])

    // Get unique leagues from matches
    const leagues = [...new Set(matches.map(m => m.league))].sort()

    // Filter matches by selected league
    const filteredMatches = selectedLeague === 'all'
        ? matches
        : matches.filter(m => m.league === selectedLeague)

    // Separate live and scheduled matches
    const liveMatches = filteredMatches.filter(m => m.status === 'LIVE')
    const scheduledMatches = filteredMatches.filter(m => m.status === 'SCHEDULED')
    const finishedMatches = filteredMatches.filter(m => m.status === 'FINISHED')

    return (
        <div className="app">
            <Navbar />

            <main className="main-content">
                <Hero matchCount={liveMatches.length} lastUpdated={lastUpdated} />

                <AdBanner slot="header" />

                <section className="matches-section">
                    <div className="container">
                        <LeagueFilter
                            leagues={leagues}
                            selected={selectedLeague}
                            onSelect={setSelectedLeague}
                        />

                        {loading ? (
                            <div className="loading-state">
                                <div className="loader"></div>
                                <p>Loading live scores...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <span className="error-icon">⚠</span>
                                <p>{error}</p>
                                <button onClick={fetchMatches} className="retry-btn">Retry</button>
                            </div>
                        ) : (
                            <>
                                {liveMatches.length > 0 && (
                                    <MatchList
                                        title="🔴 LIVE NOW"
                                        matches={liveMatches}
                                        isLive={true}
                                    />
                                )}

                                <AdBanner slot="mid" />

                                {scheduledMatches.length > 0 && (
                                    <MatchList
                                        title="📅 Upcoming"
                                        matches={scheduledMatches}
                                    />
                                )}

                                {finishedMatches.length > 0 && (
                                    <MatchList
                                        title="✅ Finished"
                                        matches={finishedMatches}
                                    />
                                )}

                                {filteredMatches.length === 0 && (
                                    <div className="empty-state">
                                        <span className="empty-icon">⚽</span>
                                        <p>No matches found for this league</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                <AdBanner slot="footer" />
            </main>

            <Footer />
        </div>
    )
}

export default App
