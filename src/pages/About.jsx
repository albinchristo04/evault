import AdBanner from '../components/AdBanner'

function About() {
    return (
        <div className="page-container">
            <div className="container">
                <article className="page-content">
                    <h1 className="page-title">About EVaultHub</h1>

                    <section className="page-section">
                        <h2>Who We Are</h2>
                        <p>
                            EVaultHub is your premier destination for live football scores and match updates
                            from leagues around the world. We provide real-time coverage of the biggest
                            matches, ensuring you never miss a goal, no matter where you are.
                        </p>
                    </section>

                    <AdBanner slot="mid" />

                    <section className="page-section">
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to deliver fast, accurate, and comprehensive football score
                            updates to fans worldwide. We believe that every football fan deserves instant
                            access to live match information, whether you're following your local team or
                            tracking international competitions.
                        </p>
                    </section>

                    <section className="page-section">
                        <h2>What We Offer</h2>
                        <ul className="page-list">
                            <li><strong>Live Scores:</strong> Real-time match updates from 50+ leagues</li>
                            <li><strong>Global Coverage:</strong> Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and more</li>
                            <li><strong>Automatic Updates:</strong> Scores refresh every 10 minutes</li>
                            <li><strong>Mobile Friendly:</strong> Access scores from any device</li>
                            <li><strong>Free Access:</strong> No registration or subscription required</li>
                        </ul>
                    </section>

                    <section className="page-section">
                        <h2>Our Commitment</h2>
                        <p>
                            We are committed to providing a clean, fast, and ad-supported experience.
                            Our platform is designed to be lightweight and accessible, ensuring quick
                            load times and easy navigation. We respect our users' time and prioritize
                            delivering the information you need without unnecessary clutter.
                        </p>
                    </section>

                    <section className="page-section">
                        <h2>Contact Us</h2>
                        <p>
                            Have questions or feedback? We'd love to hear from you! Visit our{' '}
                            <a href="#contact" className="page-link">Contact page</a> to get in touch.
                        </p>
                    </section>
                </article>

                <AdBanner slot="footer" />
            </div>
        </div>
    )
}

export default About
