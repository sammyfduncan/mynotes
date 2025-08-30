//common functions for files

(function initializeGuestId() {
    const guestId = localStorage.getItem('guestId');

    // If there is no guestId in localStorage, create one.
    if (!guestId) {
        const newGuestId = crypto.randomUUID();
        localStorage.setItem('guestId', newGuestId);
        console.log('New guest ID created:', newGuestId);
    } else {
        console.log('Existing guest ID found:', guestId);
    }
})();

function getApiHeaders() {
    const headers = new Headers();
    const authToken = localStorage.getItem('authToken');
    const guestId = localStorage.getItem('guestId');

    if (authToken) {
        headers.append('Authorisation', `Bearer ${authToken}`);
    } else if (guestId) {
        headers.append('Guest-Id', guestId);
    }
    return headers;
}
