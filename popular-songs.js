import { getAccessToken, getArtistTopTracks } from "./apiController.js";

// Display the artist's top tracks
async function showTopTracks(artistId) {
    console.log(`Loading top tracks for artist ID: ${artistId}`);

    let accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("An access token could not be obtained.");
        return;
    }

    const tracks = await getArtistTopTracks(artistId);

    if (!tracks || tracks.length === 0) {
        console.warn("No songs were found for this artist.");
        document.getElementById("topTracksContainer").innerHTML = "<p style='color: red;'>No songs available.</p>";
        return;
    }

    document.getElementById("popularSongsTitle").textContent = `Popular Songs by ${tracks[0].album.artists[0].name}`;
    const topTracksContainer = document.getElementById("topTracksContainer");
    topTracksContainer.style.display = "grid";
    topTracksContainer.innerHTML = "";

    tracks.forEach(track => {
        const trackCard = document.createElement("div");
        trackCard.classList.add("song-card");

        trackCard.innerHTML = `
            <img src="${track.album.images[0]?.url || 'default.jpg'}" alt="${track.name}">
            <h3>${track.name}</h3>
            <p>${track.album.name} (${track.release_date})</p>
            <a href="${track.external_urls.spotify}" target="_blank">Listen on Spotify</a>
        `;

        topTracksContainer.appendChild(trackCard);
    });
}

// Get artist ID from URL and display top tracks
document.addEventListener("DOMContentLoaded", async () => {
    const artistId = getQueryParam("artist");

    if (!artistId) {
        console.error("The artist ID was not found in the URL.");
        document.body.innerHTML = "<p style='color: red;'>Error: The artist was not found.</p>";
        return;
    }

    await showTopTracks(artistId);
});

// Function to retrieve URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
