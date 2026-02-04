function Navbar({ currentPage }) {
    return (
        <nav className="navbar">
            <div className="container">
                <a href="#home" className="navbar-brand">
                    <div className="navbar-logo">⚽</div>
                    <h1 className="navbar-title">
                        EVault<span>Hub</span>
                    </h1>
                </a>

                <div className="navbar-nav">
                    <a
                        href="#home"
                        className={`navbar-link ${currentPage === 'home' ? 'active' : ''}`}
                    >
                        Live Scores
                    </a>
                    <a
                        href="#about"
                        className={`navbar-link ${currentPage === 'about' ? 'active' : ''}`}
                    >
                        About
                    </a>
                    <a
                        href="#contact"
                        className={`navbar-link ${currentPage === 'contact' ? 'active' : ''}`}
                    >
                        Contact
                    </a>
                </div>

                <div className="navbar-status">
                    <span className="status-dot"></span>
                    <span>Live</span>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
