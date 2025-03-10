import { getAccessToken, getArtistAlbums } from "./apiController.js";

console.log("✅ albums.js se ha cargado correctamente.");

// Wait for the DOM to be ready before executing the code
document.addEventListener("DOMContentLoaded", async () => {

    // Get the artist ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get("artist");

    if (artistId) {
        await showAlbums(artistId);
    } else {
        console.error("The artist ID was not found in the URL.");
    }
});


// Show the artist's albums songs
export async function showAlbums(artistId) {

    let accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("An access token could not be obtained.");
        return;
    }

   
    const albums = await getArtistAlbums(artistId);

    if (!albums || albums.length === 0) {
        console.warn("No albums were found for this artist.");
        document.getElementById("albumsContainer").innerHTML = "<p style='color: red;'>No albums available.</p>";
        return;
    }
  
    document.getElementById("artistAlbumsTitle").textContent = `Albums by ${albums[0].artists[0].name}`;
    const albumsContainer = document.getElementById("albumsContainer");
    albumsContainer.style.display = "grid";
    albumsContainer.innerHTML = "";

    albums.forEach(album => {
        console.log(`Albums: ${album.name}`);
        const albumCard = document.createElement("div");
        albumCard.classList.add("album-card");

        albumCard.innerHTML = `
            <img class="album-img" src="${album.images[0]?.url || 'default.jpg'}" alt="${album.name}">
            <h3>${album.name}</h3>
            <p>${album.name} (${album.release_date})</p>
            <a href="${album.external_urls.spotify}" target="_blank">Watch on Spotify</a>
        `;

        albumsContainer.appendChild(albumCard);
    });

}