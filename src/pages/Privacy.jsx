import AdBanner from '../components/AdBanner'

function Privacy() {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="page-container">
            <div className="container">
                <article className="page-content">
                    <h1 className="page-title">Privacy Policy</h1>
                    <p className="page-meta">Last Updated: {currentDate}</p>

                    <section className="page-section">
                        <h2>Introduction</h2>
                        <p>
                            EVaultHub ("we," "our," or "us") is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard
                            your information when you visit our website evaulthub.com.
                        </p>
                    </section>

                    <AdBanner slot="mid" />

                    <section className="page-section">
                        <h2>Information We Collect</h2>
                        <h3>Automatically Collected Information</h3>
                        <p>When you visit our website, we may automatically collect certain information, including:</p>
                        <ul className="page-list">
                            <li>IP address and geographic location</li>
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>Referring website</li>
                            <li>Pages viewed and time spent on pages</li>
                            <li>Date and time of visits</li>
                        </ul>
                    </section>

                    <section className="page-section">
                        <h2>Cookies and Tracking Technologies</h2>
                        <p>
                            We use cookies and similar tracking technologies to enhance your browsing
                            experience and analyze website traffic. These may include:
                        </p>
                        <ul className="page-list">
                            <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                            <li><strong>Advertising Cookies:</strong> Used by our advertising partners (Google AdSense)</li>
                        </ul>
                    </section>

                    <section className="page-section">
                        <h2>Google AdSense</h2>
                        <p>
                            We use Google AdSense to display advertisements on our website. Google AdSense
                            uses cookies to serve ads based on your prior visits to our website or other
                            websites on the Internet. You may opt out of personalized advertising by
                            visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="page-link">Google Ads Settings</a>.
                        </p>
                        <p>
                            Google's use of advertising cookies enables it and its partners to serve ads
                            to users based on their visit to our site and/or other sites on the Internet.
                            For more information about how Google uses data, please visit{' '}
                            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="page-link">Google's Privacy & Terms</a>.
                        </p>
                    </section>

                    <section className="page-section">
                        <h2>Third-Party Services</h2>
                        <p>
                            We may use third-party service providers to help us operate our website,
                            conduct business, or service you. These third parties have access to your
                            information only to perform specific tasks on our behalf and are obligated
                            not to disclose or use it for any other purpose.
                        </p>
                    </section>

                    <section className="page-section">
                        <h2>Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational security measures
                            designed to protect the security of any personal information we process.
                            However, no electronic transmission over the Internet can be guaranteed
                            to be 100% secure.
                        </p>
                    </section>

                    <section className="page-section">
                        <h2>Your Rights (GDPR/CCPA)</h2>
                        <p>Depending on your location, you may have the following rights:</p>
                        <ul className="page-list">
                            <li>Right to access your personal data</li>
                            <li>Right to rectification of inaccurate data</li>
                            <li>Right to erasure ("right to be forgotten")</li>
                            <li>Right to restrict processing</li>
                            <li>Right to data portability</li>
                            <li>Right to object to processing</li>
                            <li>Right to opt-out of the sale of personal information (CCPA)</li>
                        </ul>
                        <p>
                            To exercise these rights, please contact us at{' '}
                            <a href="mailto:privacy@evaulthub.com" className="page-link">privacy@evaulthub.com</a>.
                        </p>
                    </section>

                    <section className="page-section">
                        <h2>Children's Privacy</h2>
                        <p>
                            Our website is not intended for children under 13 years of age. We do not
                            knowingly collect personal information from children under 13.
                        </p>
                    </section>

                    <section className="page-section">
                        <h2>Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes will be
                            posted on this page with an updated revision date.
                        </p>
                    </section>

                    <section className="page-section">
                        <h2>Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact us at:{' '}
                            <a href="mailto:privacy@evaulthub.com" className="page-link">privacy@evaulthub.com</a>
                        </p>
                    </section>
                </article>

                <AdBanner slot="footer" />
            </div>
        </div>
    )
}

export default Privacy
