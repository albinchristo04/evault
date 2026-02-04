import MatchCard from './MatchCard'

function MatchList({ title, matches, isLive = false }) {
    return (
        <section className="match-section">
            <header className="match-section-header">
                <h3 className="match-section-title">{title}</h3>
                <span className="match-section-count">{matches.length} matches</span>
            </header>

            <div className="match-grid">
                {matches.map((match, index) => (
                    <MatchCard
                        key={match.id || `${match.home}-${match.away}-${index}`}
                        match={match}
                        isLive={isLive}
                    />
                ))}
            </div>
        </section>
    )
}

export default MatchList
