import { useState, useEffect } from 'react'

function MatchDetail({ matchId }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('summary')

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Remove prefix if exists
                const cleanId = matchId.replace('fm-', '')
                const response = await fetch(`/.netlify/functions/match_details?id=${cleanId}`)
                if (!response.ok) throw new Error('Failed to fetch match details')
                const result = await response.json()
                setData(result)
            } catch (err) {
                console.error('Error fetching details:', err)
                setError('Could not load match details. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        if (matchId) fetchData()
    }, [matchId])

    if (loading) {
        return (
            <div className="match-detail-loading container">
                <div className="shimmer-header"></div>
                <div className="shimmer-tabs"></div>
                <div className="shimmer-grid">
                    <div className="shimmer-card"></div>
                    <div className="shimmer-card"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <span className="error-icon">⚽</span>
                <h2>Oops!</h2>
                <p>{error}</p>
                <a href="#home" className="back-btn">Back to Matches</a>
            </div>
        )
    }

    const { details, odds, comments, tv } = data || {}
    const general = details?.general || {}
    const content = details?.content || {}
    const h2h = content?.h2h || []

    return (
        <div className="match-detail-page">
            <a href="#home" className="back-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to Scores
            </a>

            <header className="match-detail-header glass">
                <div className="match-detail-league">
                    <img src={`https://images.fotmob.com/image_resources/logo/leaguelogo/${general.leagueId}.png`} alt="" width="20" />
                    <span>{general.leagueName}</span>
                    <span>•</span>
                    <span>{general.countryCode}</span>
                </div>

                <div className="match-detail-main">
                    <div className="detail-team home">
                        <div className="detail-logo-container">
                            <img src={`https://images.fotmob.com/image_resources/logo/teamlogo/${general.homeTeam?.id}.png`} alt={general.homeTeam?.name} />
                        </div>
                        <h3>{general.homeTeam?.name}</h3>
                    </div>

                    <div className="detail-score">
                        <div className="score-row">
                            <span>{general.homeTeam?.score ?? 0}</span>
                            <span className="score-sep">-</span>
                            <span>{general.awayTeam?.score ?? 0}</span>
                        </div>
                        <div className="match-status-badge">
                            {general.status?.liveTime?.short ?? (general.status?.finished ? 'FT' : (general.status?.reason || 'Scheduled'))}
                        </div>
                    </div>

                    <div className="detail-team away">
                        <div className="detail-logo-container">
                            <img src={`https://images.fotmob.com/image_resources/logo/teamlogo/${general.awayTeam?.id}.png`} alt={general.awayTeam?.name} />
                        </div>
                        <h3>{general.awayTeam?.name}</h3>
                    </div>
                </div>

                <div className="match-tabs">
                    <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>Summary</button>
                    <button className={activeTab === 'lineups' ? 'active' : ''} onClick={() => setActiveTab('lineups')}>Lineups</button>
                    <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Stats</button>
                    <button className={activeTab === 'h2h' ? 'active' : ''} onClick={() => setActiveTab('h2h')}>H2H</button>
                    {comments?.length > 0 && <button className={activeTab === 'commentary' ? 'active' : ''} onClick={() => setActiveTab('commentary')}>Commentary</button>}
                </div>
            </header>

            <main className="match-detail-content container">
                {activeTab === 'summary' && (
                    <div className="detail-tab-panes active animate-fade-in">
                        <div className="detail-grid">
                            <div className="detail-grid-left">
                                <section className="detail-section glass card">
                                    <h4>Match Venue</h4>
                                    <div className="venue-info">
                                        <div className="info-item">
                                            <span>Stadium</span>
                                            <span>{general.venue?.name}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>City</span>
                                            <span>{general.venue?.city}</span>
                                        </div>
                                        {general.referee && (
                                            <div className="info-item">
                                                <span>Referee</span>
                                                <span>{general.referee.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {tv?.channels && tv.channels.length > 0 && (
                                    <section className="detail-section glass card mt-xl">
                                        <h4>📺 TV Listings</h4>
                                        <div className="tv-channels">
                                            {tv.channels.map((chan, i) => (
                                                <div key={i} className="channel-item">
                                                    <span className="channel-name">{chan.name}</span>
                                                    {chan.live && <span className="live-tag">LIVE</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="detail-grid-right">
                                <section className="detail-section glass card">
                                    <h4>Odds (1X2)</h4>
                                    <div className="odds-grid">
                                        {odds?.topThree?.map((odd, idx) => (
                                            <div key={idx} className="odd-container">
                                                <span className="odd-label">{odd.label}</span>
                                                <div className="odd-box">
                                                    <span className="odd-value">{odd.value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {content.tableSummary && (
                                    <section className="detail-section glass card mt-xl">
                                        <h4>Standing Summary</h4>
                                        <div className="table-summary-mini">
                                            {content.tableSummary.teams?.map((t, i) => (
                                                <div key={i} className={`mini-table-row ${t.id === general.homeTeam?.id || t.id === general.awayTeam?.id ? 'highlight' : ''}`}>
                                                    <span className="pos">{t.rank}</span>
                                                    <span className="name">{t.name}</span>
                                                    <span className="pts">{t.points} pts</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'h2h' && (
                    <div className="h2h-pane animate-fade-in">
                        <div className="h2h-summary glass card">
                            <h4>Head to Head History</h4>
                            <div className="h2h-list">
                                {h2h.map((m, i) => (
                                    <div key={i} className="h2h-item">
                                        <span className="h2h-date">{m.date?.utcTime?.split('T')[0]}</span>
                                        <div className="h2h-match">
                                            <span>{m.home.name}</span>
                                            <span className="h2h-score">{m.home.score} - {m.away.score}</span>
                                            <span>{m.away.name}</span>
                                        </div>
                                        <span className="h2h-league">{m.league.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'commentary' && (
                    <div className="commentary-list glass card animate-fade-in">
                        {comments?.map((comment, index) => (
                            <div key={index} className={`comment-item ${comment.isGoal ? 'is-goal' : ''}`}>
                                <div className="comment-time-box">
                                    <span className="comment-time">{comment.time}'</span>
                                </div>
                                <div className="comment-text">
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="stats-container glass card animate-fade-in">
                        {content.stats?.map((stat, i) => (
                            <div key={i} className="stat-group">
                                <h5>{stat.title}</h5>
                                {stat.stats?.map((s, j) => (
                                    <div key={j} className="stat-row">
                                        <div className="stat-header">
                                            <span>{s.homeValue}</span>
                                            <span className="stat-label">{s.title}</span>
                                            <span>{s.awayValue}</span>
                                        </div>
                                        <div className="stat-bars">
                                            <div className="stat-bar-bg">
                                                <div className="stat-bar-fill home" style={{ width: `${(parseFloat(s.homeValue) / (parseFloat(s.homeValue) + parseFloat(s.awayValue)) * 100) || 50}%` }}></div>
                                                <div className="stat-bar-fill away" style={{ width: `${(parseFloat(s.awayValue) / (parseFloat(s.homeValue) + parseFloat(s.awayValue)) * 100) || 50}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'lineups' && (
                    <div className="lineups-pane glass card animate-fade-in">
                        {content.lineup?.lineup?.map((lu, i) => (
                            <div key={i} className="lineup-side">
                                <h4>{lu.teamName} Lineup</h4>
                                <div className="player-list">
                                    {lu.players?.map((p, j) => (
                                        <div key={j} className="player-item">
                                            <span className="p-num">{p.number}</span>
                                            <span className="p-name">{p.name?.full}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {!content.lineup && <div className="empty-state">Lineups not available for this match yet.</div>}
                    </div>
                )}
            </main>
        </div>
    )
}

export default MatchDetail
