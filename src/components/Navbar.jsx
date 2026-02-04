function Navbar() {
    return (
        <nav className="navbar">
            <div className="container">
                <a href="/" className="navbar-brand">
                    <div className="navbar-logo">⚽</div>
                    <h1 className="navbar-title">
                        EVault<span>Hub</span>
                    </h1>
                </a>

                <div className="navbar-status">
                    <span className="status-dot"></span>
                    <span>Live Updates</span>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
