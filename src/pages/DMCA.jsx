import AdBanner from '../components/AdBanner'

function DMCA() {
    return (
        <div className="page-container">
            <div className="container">
                <article className="page-content">
                    <h1 className="page-title">DMCA Policy</h1>

                    <section className="page-section">
                        <h2>Digital Millennium Copyright Act Notice</h2>
                        <p>
                            EVaultHub respects the intellectual property rights of others and expects
                            our users to do the same. In accordance with the Digital Millennium Copyright
                            Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright
                            infringement that are reported to our designated copyright agent.
                        </p>
                    </section>

                    <AdBanner slot="mid" />

                    <section className="page-section">
                        <h2>Notification of Infringement</h2>
                        <p>
                            If you believe that your copyrighted work has been copied in a way that
                            constitutes copyright infringement and is accessible on this site, please
                            notify our copyright agent. For your complaint to be valid under the DMCA,
                            you must provide the following information:
                        </p>
                        <ul className="page-list">
                            <li>
                                A physical or electronic signature of a person authorized to act on behalf
                                of the owner of an exclusive right that is allegedly infringed
                            </li>
                            <li>
                                Identification of the copyrighted work claimed to have been infringed
                            </li>
                            <li>
                                Identification of the material that is claimed to be infringing and
                                information reasonably sufficient to permit us to locate the material
                            </li>
                            <li>
                                Information reasonably sufficient to permit us to contact you, such as
                                an address, telephone number, and email address
                            </li>
                            <li>
                                A statement that you have a good faith belief that use of the material
                                in the manner complained of is not authorized by the copyright owner,
                                its agent, or the law
                            </li>
                            <li>
                                A statement that the information in the notification is accurate, and
                                under penalty of perjury, that you are authorized to act on behalf of
                                the owner of an exclusive right that is allegedly infringed
                            </li>
                        </ul>
                    </section>

                    <section className="page-section">
                        <h2>Contact Information</h2>
                        <p>
                            Please send DMCA notices to our designated copyright agent:
                        </p>
                        <div className="contact-box">
                            <p><strong>Email:</strong> <a href="mailto:dmca@evaulthub.com" className="page-link">dmca@evaulthub.com</a></p>
                            <p><strong>Subject Line:</strong> DMCA Takedown Notice</p>
                        </div>
                    </section>

                    <section className="page-section">
                        <h2>Counter-Notification</h2>
                        <p>
                            If you believe that your content was removed or disabled by mistake or
                            misidentification, you may file a counter-notification with us. To be
                            effective, the counter-notification must be a written communication that
                            includes the following:
                        </p>
                        <ul className="page-list">
                            <li>Your physical or electronic signature</li>
                            <li>
                                Identification of the material that has been removed or to which access
                                has been disabled and the location at which the material appeared before
                                it was removed or access was disabled
                            </li>
                            <li>
                                A statement under penalty of perjury that you have a good faith belief
                                that the material was removed or disabled as a result of mistake or
                                misidentification
                            </li>
                            <li>
                                Your name, address, and telephone number, and a statement that you consent
                                to the jurisdiction of the Federal District Court for the judicial district
                                in which you are located
                            </li>
                        </ul>
                    </section>

                    <section className="page-section">
                        <h2>Repeat Infringers</h2>
                        <p>
                            It is our policy to terminate the accounts of repeat infringers in appropriate
                            circumstances.
                        </p>
                    </section>
                </article>

                <AdBanner slot="footer" />
            </div>
        </div>
    )
}

export default DMCA
