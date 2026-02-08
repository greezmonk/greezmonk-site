/**
 * Heritage Footer Component
 *
 * Loads standing wave data and renders a micro heritage block
 * at the bottom of any page that includes this script.
 *
 * Usage: <script src="heritage-footer.js"></script>
 * Place just before </body>
 */

(function() {
    const WAVE_DATA_PATH = '/standing-wave/standing-waves.json';

    // Inject styles
    const styles = document.createElement('style');
    styles.textContent = `
        .heritage-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px dashed #333;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.7rem;
            text-align: center;
        }

        .heritage-footer .heritage-label {
            color: #444;
            font-size: 0.6rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 8px;
            display: block;
        }

        .heritage-footer .heritage-waves {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px 16px;
            margin-bottom: 10px;
        }

        .heritage-footer .heritage-wave {
            color: #555;
            transition: color 0.3s ease;
            cursor: pointer;
            text-decoration: none;
        }

        .heritage-footer .heritage-wave:hover {
            color: #f0a500;
        }

        .heritage-footer .heritage-wave .wave-name {
            color: #888;
        }

        .heritage-footer .heritage-wave:hover .wave-name {
            color: #f0a500;
        }

        .heritage-footer .heritage-wave .wave-score {
            color: #4a9eff;
            font-weight: bold;
        }

        .heritage-footer .heritage-wave.rising .wave-arrow {
            color: #22c55e;
        }

        .heritage-footer .heritage-wave.new-wave::after {
            content: '✦';
            color: #22c55e;
            margin-left: 3px;
            font-size: 0.6rem;
            animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }

        .heritage-footer .heritage-more {
            color: #444;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .heritage-footer .heritage-more:hover {
            color: #f0a500;
        }

        .heritage-footer .heritage-link {
            display: block;
            margin-top: 12px;
        }

        .heritage-footer .heritage-link a {
            color: #555;
            text-decoration: none;
            border: 1px solid #333;
            padding: 4px 12px;
            font-size: 0.65rem;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }

        .heritage-footer .heritage-link a:hover {
            border-color: #4a9eff;
            color: #4a9eff;
            box-shadow: 0 0 10px rgba(74, 158, 255, 0.2);
        }

        .heritage-footer .heritage-pass {
            color: #333;
            font-size: 0.55rem;
            margin-top: 8px;
        }

        /* Mobile */
        @media (max-width: 600px) {
            .heritage-footer .heritage-waves {
                flex-direction: column;
                gap: 6px;
            }
        }
    `;
    document.head.appendChild(styles);

    // Create footer element
    const footer = document.createElement('div');
    footer.className = 'heritage-footer';
    footer.innerHTML = `
        <span class="heritage-label">🏛️ Heritage Block</span>
        <div class="heritage-waves" id="heritage-waves">
            <span style="color: #333;">Loading echoes...</span>
        </div>
        <div class="heritage-link">
            <a href="/standing-wave/">[ STANDING WAVES ]</a>
        </div>
        <div class="heritage-pass" id="heritage-pass"></div>
    `;

    // Load data and render
    async function loadHeritage() {
        try {
            const response = await fetch(WAVE_DATA_PATH);
            const data = await response.json();

            const sovereigns = data.standingWaves
                .filter(w => w.status === 'sovereign')
                .sort((a, b) => b.score - a.score);

            const container = document.getElementById('heritage-waves');
            const passInfo = document.getElementById('heritage-pass');

            // Show top 5 sovereigns, then "+N more" if there are more
            const shown = sovereigns.slice(0, 5);
            const remaining = sovereigns.length - 5;

            let html = shown.map(wave => {
                const arrow = wave.movement === 'up' ? '↑' :
                              wave.movement === 'down' ? '↓' : '';
                const classes = [
                    'heritage-wave',
                    wave.movement === 'up' ? 'rising' : '',
                    wave.isNew ? 'new-wave' : ''
                ].filter(Boolean).join(' ');

                return `<a href="/standing-wave/" class="${classes}">
                    <span class="wave-name">${wave.name}</span>
                    <span class="wave-score">(${wave.score})</span>
                    ${arrow ? `<span class="wave-arrow">${arrow}</span>` : ''}
                </a>`;
            }).join('');

            if (remaining > 0) {
                html += `<a href="/standing-wave/" class="heritage-more">+${remaining} more</a>`;
            }

            container.innerHTML = html;
            passInfo.textContent = `Pass ${data.pass} · ${new Date(data.lastUpdated).toLocaleDateString()}`;

        } catch (e) {
            console.log('Heritage footer: Could not load wave data');
            document.getElementById('heritage-waves').innerHTML =
                '<span style="color: #333;">Echoes dormant</span>';
        }
    }

    // Find where to insert
    function insertFooter() {
        // Look for existing footer or console-wrapper
        const existingFooter = document.querySelector('footer');
        const consoleWrapper = document.querySelector('.console-wrapper');

        if (existingFooter) {
            // Insert before the existing footer
            existingFooter.parentNode.insertBefore(footer, existingFooter);
        } else if (consoleWrapper) {
            // Append to console wrapper
            consoleWrapper.appendChild(footer);
        } else {
            // Fallback: append to body
            document.body.appendChild(footer);
        }

        loadHeritage();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertFooter);
    } else {
        insertFooter();
    }
})();
