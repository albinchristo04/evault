function MatchCard({ match, isLive }) {
    const {
        home,
        away,
        homeScore,
        awayScore,
        homeImage,
        awayImage,
        league,
        country,
        status,
        time,
        minute
    } = match

    const getStatusDisplay = () => {
        if (status === 'LIVE') {
            return (
                <span className="match-status live">
                    <span className="match-status-dot"></span>
                    {minute ? `${minute}'` : 'LIVE'}
                </span>
            )
        }
        if (status === 'FINISHED') {
            return <span className="match-status finished">FT</span>
        }
        return <span className="match-status scheduled">{time || 'TBD'}</span>
    }

    const formatTime = (timeStr) => {
        if (!timeStr) return ''
        try {
            const date = new Date(timeStr)
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        } catch {
            return timeStr
        }
    }

    return (
        <a href={`#match/${match.id}`} className={`match-card-link ${isLive ? 'is-live-link' : ''}`}>
            <article className={`match-card ${isLive ? 'is-live' : ''}`}>
                <header className="match-header">
                    <div className="match-league">
                        <span>{country || ''}</span>
                        <span>•</span>
                        <span>{league || 'Unknown League'}</span>
                    </div>
                    {getStatusDisplay()}
                </header>

                <div className="match-body">
                    <div className="match-team home">
                        <div className="match-team-logo">
                            {homeImage ? (
                                <img src={homeImage} alt={home} loading="lazy" />
                            ) : (
                                '🏠'
                            )}
                        </div>
                        <span className="match-team-name">{home || 'Home Team'}</span>
                    </div>

                    <div className="match-score">
                        <span className="match-score-value">{homeScore ?? '-'}</span>
                        <span className="match-score-separator">:</span>
                        <span className="match-score-value">{awayScore ?? '-'}</span>
                    </div>

                    <div className="match-team away">
                        <div className="match-team-logo">
                            {awayImage ? (
                                <img src={awayImage} alt={away} loading="lazy" />
                            ) : (
                                '✈️'
                            )}
                        </div>
                        <span className="match-team-name">{away || 'Away Team'}</span>
                    </div>
                </div>

                {status === 'SCHEDULED' && time && (
                    <div className="match-time">
                        Kick-off: <span className="match-time-value">{formatTime(time)}</span>
                    </div>
                )}
            </article>
        </a>
    )
}

export default MatchCard
