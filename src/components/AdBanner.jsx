import { useEffect } from 'react'

function AdBanner({ slot }) {
    // Ad slot configuration
    const adSlots = {
        header: {
            slot: '8797884002',
            style: { display: 'inline-block', width: '320px', height: '50px' }
        },
        mid: {
            slot: '2063942933',
            style: { display: 'inline-block', width: '250px', height: '250px' }
        },
        footer: {
            slot: '9640222263',
            style: { display: 'block' },
            format: 'auto',
            fullWidth: true
        }
    }

    const adConfig = adSlots[slot] || adSlots.footer

    useEffect(() => {
        try {
            // Push ad after component mounts
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            }
        } catch (error) {
            console.error('AdSense error:', error)
        }
    }, [])

    return (
        <div className="ad-banner" data-ad-slot={slot}>
            <ins
                className="adsbygoogle"
                style={adConfig.style}
                data-ad-client="ca-pub-7025462814384100"
                data-ad-slot={adConfig.slot}
                {...(adConfig.format && { 'data-ad-format': adConfig.format })}
                {...(adConfig.fullWidth && { 'data-full-width-responsive': 'true' })}
            />
        </div>
    )
}

export default AdBanner
