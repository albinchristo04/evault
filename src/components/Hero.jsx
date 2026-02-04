function Hero({ matchCount, lastUpdated }) {
    const formatTime = (isoString) => {
        if (!isoString) return 'Just now'
        try {
            const date = new Date(isoString)
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        } catch {
            return 'Just now'
        }
    }

    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <h2 className="hero-title">
                        Live <span className="highlight">Football</span> Scores
                    </h2>

                    <p className="hero-subtitle">
                        Real-time scores and updates from top leagues around the world.
                        Updated every 10 minutes.
                    </p>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-value">{matchCount}</span>
                            <span className="hero-stat-label">Live Matches</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">50+</span>
                            <span className="hero-stat-label">Leagues</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">24/7</span>
                            <span className="hero-stat-label">Coverage</span>
                        </div>
                    </div>

                    {lastUpdated && (
                        <p className="hero-updated">
                            Last updated: {formatTime(lastUpdated)}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Hero
