function LeagueFilter({ leagues, selected, onSelect }) {
    return (
        <div className="league-filter">
            <ul className="league-filter-list">
                <li>
                    <button
                        className={`league-filter-btn ${selected === 'all' ? 'active' : ''}`}
                        onClick={() => onSelect('all')}
                    >
                        🌍 All Leagues
                        <span className="league-filter-count">{leagues.length}</span>
                    </button>
                </li>

                {leagues.map(league => (
                    <li key={league}>
                        <button
                            className={`league-filter-btn ${selected === league ? 'active' : ''}`}
                            onClick={() => onSelect(league)}
                        >
                            {league}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LeagueFilter
