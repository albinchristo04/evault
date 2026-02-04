function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-brand">
                    ⚽ EVault<span>Hub</span>
                </div>

                <nav className="footer-links">
                    <a href="#about" className="footer-link">About</a>
                    <a href="#privacy" className="footer-link">Privacy Policy</a>
                    <a href="#contact" className="footer-link">Contact</a>
                    <a href="#dmca" className="footer-link">DMCA</a>
                </nav>

                <p className="footer-copyright">
                    © {currentYear} EVaultHub.com. All rights reserved.
                    Data refreshed every 10 minutes.
                </p>
            </div>
        </footer>
    )
}

export default Footer
