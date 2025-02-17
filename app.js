const clientId = SPOTIFY_CONFIG.CLIENT_ID;
const clientSecret = SPOTIFY_CONFIG.CLIENT_SECRET;

// Obtain access token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if (response.status != 200) {
        console.error(`Error obteniendo el token de Spotify: ${response.json()}`)
    }
    const data = await response.json();
    return data.access_token;
}

