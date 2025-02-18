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

// Search for multiple artists by a term
async function getAllArtists(query, accessToken, limit = 10) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            let errorMessage = `⚠️ Error ${response.status}:The artists were unable to be obtained.`;
            try {
                const errorData = await response.json();
                errorMessage += ` Details: ${errorData.error?.message || 'Without further information.'}`;
            } catch (jsonError) {
                errorMessage += 'The error response could not be read.';
            }
            console.error(errorMessage);
            return [];
        }

        const data = await response.json();
        return data.artists.items.map(artist => ({
            id: artist.id,
            name: artist.name,
            popularity: artist.popularity,
            followers: artist.followers?.total || 0,
            genres: artist.genres || [],
            image: artist.images?.length > 0 ? artist.images[0].url : null
        }));
    } catch (error) {
        console.error('🚨 Error in getAllArtists:', error);
        return [];
    }
}

     // Obtain the bands data
    async function getArtistData(artistId, accessToken) {
        try {
            const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
    
            if (!response.ok) {
                let errorMessage = `⚠️ Error ${response.status}: No information could be obtained from the artist.`;
                try {
                    const errorData = await response.json();
                    errorMessage += ` Detalles: ${errorData.error?.message || 'Without additional information.'}`;
                } catch (jsonError) {
                    errorMessage += ' No se pudo leer la respuesta del error.';
                }
                console.error(errorMessage);
                return null;
            }
    
            const data = await response.json();
            return {
                name: data.name,
                followers: data.followers?.total || 0,
                popularity: data.popularity || 0,
                genres: data.genres || [],
                image: data.images?.length > 0 ? data.images[0].url : null
            };
        } catch (error) {
            console.error('🚨 Error in getArtistData:', error);
            return null;
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