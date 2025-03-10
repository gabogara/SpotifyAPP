import { SPOTIFY_CONFIG } from "./config.js";

const clientId = SPOTIFY_CONFIG.CLIENT_ID;
const clientSecret = SPOTIFY_CONFIG.CLIENT_SECRET;

let accessToken = "";

// Obtain access token
export async function getAccessToken() {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        });

        if (!response.ok) {
            console.error(`Error obtaining the token: ${await response.json()}`);
            return null;
        }

        const data = await response.json();
        accessToken = data.access_token;
        return accessToken;
    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
}

// Search for an artist by name
export async function getSearchArtist(artistName) {
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!response.ok) {
        console.error("Error retrieving artist");
        return null;
    }

    const data = await response.json();
    return data.artists.items.length > 0 ? data.artists.items[0] : null;
}

// Get the artist's most popular songs
export async function getArtistTopTracks(artistId, market = "US") {
    const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`,
        { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!response.ok) {
        console.error(`Error retrieving songs for artist ID: ${artistId}`);
        return [];
    }

    const data = await response.json();
    return data.tracks || [];
}

// Get the artist's albums
export async function getArtistAlbums(artistId, market = "US") {
    console.log(`Fetching albums for artist ID: ${artistId}`);
    const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums`,
        { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!response.ok) {
        console.error(`Error retrieving albums for artist ID: ${artistId}`);
        return [];
    }

    const data = await response.json();
    console.log(`Found ${data.items.length} albums.`);
    return data.items || [];
}

// Get music genres
export async function getGenres() {
    const response = await fetch("https://api.spotify.com/v1/browse/categories?country=US&locale=en_US", {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
    });

    if (!response.ok) {
        console.warn(`Error ${response.status}: Unable to retrieve categories.`);
        return [];
    }

    const data = await response.json();
    return data.categories.items || [];
}

// Get playlists by genre
export async function getPlaylistsByGenre(token, genreId) {
    console.log(`Fetching playlists for genre: ${genreId}`);

    try {
        const response = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error(`Error retrieving playlists for category ${genreId}. Code: ${response.status}`);
            return [];
        }

        const data = await response.json();
        console.log(`Found ${data.playlists.items.length} playlists for ${genreId}`);
        return data.playlists.items || [];
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return [];
    }
}
