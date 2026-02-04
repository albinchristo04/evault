import { useState } from 'react'
import AdBanner from '../components/AdBanner'

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // For static site, open email client with pre-filled data
        const mailtoLink = `mailto:contact@evaulthub.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`
        window.location.href = mailtoLink
        setSubmitted(true)
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="page-container">
            <div className="container">
                <article className="page-content">
                    <h1 className="page-title">Contact Us</h1>

                    <section className="page-section">
                        <p>
                            Have a question, suggestion, or feedback? We'd love to hear from you!
                            Use the form below or reach out to us directly via email.
                        </p>
                    </section>

                    <AdBanner slot="header" />

                    <section className="page-section">
                        <div className="contact-grid">
                            <div className="contact-info">
                                <h2>Get in Touch</h2>

                                <div className="contact-item">
                                    <span className="contact-icon">📧</span>
                                    <div>
                                        <strong>Email</strong>
                                        <p><a href="mailto:contact@evaulthub.com" className="page-link">contact@evaulthub.com</a></p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <span className="contact-icon">🌐</span>
                                    <div>
                                        <strong>Website</strong>
                                        <p><a href="https://evaulthub.com" className="page-link">evaulthub.com</a></p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <span className="contact-icon">⏰</span>
                                    <div>
                                        <strong>Response Time</strong>
                                        <p>We typically respond within 24-48 hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-form-wrapper">
                                <h2>Send a Message</h2>

                                {submitted ? (
                                    <div className="form-success">
                                        <span className="success-icon">✅</span>
                                        <p>Thank you for reaching out! Your email client should have opened with your message.</p>
                                    </div>
                                ) : (
                                    <form className="contact-form" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="subject">Subject</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a topic</option>
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Bug Report">Bug Report</option>
                                                <option value="Feature Request">Feature Request</option>
                                                <option value="Advertising">Advertising</option>
                                                <option value="Partnership">Partnership</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="message">Message</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows="5"
                                                placeholder="Your message..."
                                            />
                                        </div>

                                        <button type="submit" className="submit-btn">
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>
                </article>

                <AdBanner slot="footer" />
            </div>
        </div>
    )
}

export default Contact
