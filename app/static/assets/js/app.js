//common functions for files

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