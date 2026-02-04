import { useState, useEffect } from 'react'

function Standings({ leagueId }) {
    const [standings, setStandings] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStandings = async () => {
            if (!leagueId) return
            setLoading(true)
            try {
                const response = await fetch(`/.netlify/functions/standings?id=${leagueId}`)
                if (!response.ok) throw new Error('Failed to fetch standings')
                const data = await response.json()
                // Handle different structures (FotMob wrapper returns varied standings formats)
                const table = data[0]?.table?.all || data.table?.all || []
                setStandings(table)
            } catch (err) {
                console.error('Error fetching standings:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchStandings()
    }, [leagueId])

    if (!leagueId) return null

    return (
        <aside className="standings-sidebar glass card">
            <h4 className="sidebar-title">League Table</h4>
            {loading ? (
                <div className="sidebar-shimmer">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="shimmer-row"></div>)}
                </div>
            ) : standings?.length > 0 ? (
                <div className="standings-mini">
                    <div className="mini-header">
                        <span>#</span>
                        <span>Team</span>
                        <span>PL</span>
                        <span>PTS</span>
                    </div>
                    {standings.slice(0, 10).map((team, idx) => (
                        <div key={idx} className="mini-row">
                            <span className="rank">{team.idx || idx + 1}</span>
                            <span className="name">{team.name}</span>
                            <span className="played">{team.played}</span>
                            <span className="pts">{team.pts}</span>
                        </div>
                    ))}
                    <button className="view-full-btn">View Full Table</button>
                </div>
            ) : (
                <p className="empty-text">Standings unavailable</p>
            )}
        </aside>
    )
}

export default Standings
