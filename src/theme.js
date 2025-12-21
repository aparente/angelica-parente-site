// Pacific Time day/night theme system

// Get current hour in Pacific Time
function getPacificHour() {
    const now = new Date();
    const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    return pacificTime.getHours();
}

// Check if it's night time in Pacific Time (6 PM - 6 AM)
function isNightTime() {
    const hour = getPacificHour();
    return hour >= 18 || hour < 6;
}

// Initialize theme and set up periodic checking
function initTheme() {
    function updateTheme() {
        const shouldBeNight = isNightTime();
        document.documentElement.classList.toggle('night-theme', shouldBeNight);
    }

    // Initial check
    updateTheme();

    // Check every minute for theme changes
    setInterval(updateTheme, 60000);
}

// Auto-initialize when script loads
initTheme();
