// SIGNAL INTERCEPTOR — Archive Quote Display
// Loads quotes.json and rotates through them
(function() {
    const ROTATE_INTERVAL = 30000; // 30 seconds
    const FADE_DURATION = 800;     // ms for fade transition

    // Build the signal display element
    function createSignalDisplay() {
        const container = document.createElement('div');
        container.id = 'signal-intercept';
        container.innerHTML = `
            <span class="signal-label">░░ SIGNAL INTERCEPTED ░░</span>
            <span id="signal-quote" class="signal-text">SCANNING FREQUENCIES...</span>
        `;
        return container;
    }

    // Inject after header, before nav
    function inject() {
        const header = document.querySelector('header');
        if (!header) return;
        const display = createSignalDisplay();
        header.parentNode.insertBefore(display, header.nextSibling);
    }

    // Load and rotate quotes
    async function init() {
        inject();

        const el = document.getElementById('signal-quote');
        if (!el) return;

        let quotes = [];
        try {
            const res = await fetch('quotes.json');
            quotes = await res.json();
        } catch (e) {
            el.textContent = '[ NO SIGNAL ]';
            return;
        }

        if (!quotes.length) {
            el.textContent = '[ SILENCE ]';
            return;
        }

        // Show a random quote, avoid repeating the same one back-to-back
        let lastIndex = -1;
        function show() {
            let idx;
            if (quotes.length === 1) {
                idx = 0;
            } else {
                do { idx = Math.floor(Math.random() * quotes.length); } while (idx === lastIndex);
            }
            lastIndex = idx;

            // Fade out
            el.style.opacity = '0';
            setTimeout(() => {
                el.textContent = quotes[idx];
                el.style.opacity = '1';
            }, FADE_DURATION);
        }

        show();
        setInterval(show, ROTATE_INTERVAL);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
