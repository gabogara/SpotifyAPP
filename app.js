const clientId = SPOTIFY_CONFIG.CLIENT_ID;
const clientSecret = SPOTIFY_CONFIG.CLIENT_SECRET;

const APIController = (function() {
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

        if (!response.ok) {
            console.error(`Error obtaining Spotify token: ${await response.json()}`);
            return null;
        }

        const data = await response.json();
        return data.access_token;
    }

    // Obtain the IDs of the bands
    async function getSearchArtist(artistName, accessToken) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error('Error obtaining the artist');
            return null;
        }

        const data = await response.json();
        if (data.artists.items.length === 0) {
            console.warn(`Artist not found: ${artistName}`);
            return null;
        }

        return data.artists.items[0].id;
    }

// Obtain data from the bands
async function getArtistData(artistId, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.status != 200) {
        console.error('Error obteniendo los datos del artista')
    }
    const data = await response.json();
    return {
        "name": data.name,
        "followers": data.followers.total,
        "popularity": data.popularity,
    }
}

// Get the most popular music from the bands
async function getArtistTopTrack(artistId, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.status != 200) {
        console.error('Error obteniendo las canciones del artista')
    }
    const data = await response.json();
    const result = data.tracks[0]
    return {
        "name": result.name,
        "popularity": result.popularity,
    }
}

return {
    getAccessToken,
    getSearchArtist,
    //getAllArtists,
    getArtistData,
    //getArtistTopTracks  
};


})();