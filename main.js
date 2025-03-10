import { getAccessToken, getSearchArtist, getGenres, getPlaylistsByGenre} from './apiController.js';
import { showAlbums } from './albums.js';
import { SPOTIFY_CONFIG } from './config.js';




// Global variables
let accessToken = "";
const GENRE_IDS = {
    "toplists": "0JQ5DAqbTPQwRww5lB8Shl",
    "pop": "0JQ5DAqbMKFQ00XGBls6ym",
    "hiphop": "0JQ5DAqbMKFQ00XGBls6ym",
    "rock": "0JQ5DAqbMIDIoy97QT9aOz",
    "chill": "0JQ5DAqbLIQ6nrdYc5MjK5",
    "workout": "0JQ5DAqbLN6w5P1nq2muXm",
    "classical": "0JQ5DAqbHPWzQnF7aYENNR"
};
const resultsDiv = document.getElementById("results");
const genresContainer = document.getElementById("genresContainer");

// Start the application
async function initApp() {
    accessToken = await getAccessToken();
    if (!accessToken) return;

    showGenres();  
    handleNavigation();  
}

// Handle navigation with hashchange
function handleNavigation() {
    const hash = window.location.hash;
    console.log(`Detectando cambio en hash: ${hash}`);

    // Extract hash parameters correctly
    const urlParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
    const artistId = urlParams.get("artist");
    const genreId = urlParams.get("genre");

    if (hash.startsWith("#top-tracks")) {
        if (artistId) {
            showTopTracks(artistId);
        } else {
            console.warn("No artistId found in URL.");
        }
    } else if (hash.startsWith("#playlists")) {
  
        if (genreId) {
            showPlaylists(genreId);
        } else {
            console.warn("GenreId was not found in the URL.");
        }
    }else if (hash.startsWith("#albums")) {
        if (artistId) {
            showAlbums(artistId);
         } else {
         console.warn("No artistId found in the URL for albums.");
        }
    }
}

// Listen for changes in the hash and call function
window.addEventListener("hashchange", handleNavigation);


async function showGenres() {
    const genres = await getGenres(accessToken);
   
    genresContainer.innerHTML = "";


    genres.forEach(genre => {


        const genreCard = document.createElement("div");
        genreCard.classList.add("cardGender-concentracion");
        genreCard.innerHTML = `
            <div class="cardGender" data-genre="${genre.id}">
                <div class="cardGender-img">
                    <img src="${genre.icons[0]?.url || 'default.jpg'}" alt="${genre.name}">
                </div>
                <h2>${genre.name}</h2>
            </div>
        `;

        genreCard.addEventListener("click", () => {
            window.location.hash = `#playlists?genre=${genre.id}`;
        });

        genresContainer.appendChild(genreCard);
    });

}

// Manage artist search
async function searchArtist() {
    const artistInput = document.getElementById("artistInput").value.trim();
    if (!artistInput) return;

    const artistData = await getSearchArtist(artistInput);

    if (!artistData) {
        resultsDiv.innerHTML = `<p style="color: red;">Artist not found "${artistInput}".</p>`;
        return;
    }

    resultsDiv.innerHTML = `
        <div class="artist-card" data-artist-id="${artistData.id}">
            <div class="result"> 
                <img class="artist-img" src="${artistData.images.length > 0 ? artistData.images[0].url : 'https://via.placeholder.com/150'}">
                <div class="buttons">
                    <button class="popular-songs-btn" id="result-button" >Popular Songs</button>
                    <button class="albums-btn" id="result-button" >Albums</button>    
                </div>
            
            </div>
            <div class="artist-info">
                <h2>${artistData.name}</h2>
                <p>Popularidad: ${artistData.popularity}/100</p>
                <p>Seguidores: ${artistData.followers.total.toLocaleString()}</p>
            </div>
        </div>
    `;

    const artistImg = document.querySelector(".artist-img");
    const popularSongsBtn = document.querySelector(".popular-songs-btn");
    const albumsBtn = document.querySelector(".albums-btn")
    
    // Redirection URL
    const redirectUrl = `popular-songs.html?artist=${artistData.id}`;

    // Redirect only when image or button is clicked
    artistImg.addEventListener("click", () => {
        window.location.href = redirectUrl;
    });

    popularSongsBtn.addEventListener("click", (event) => {
        event.stopPropagation(); 
        window.location.href = redirectUrl;
    });

     // Show albums when clicking on the “Albums” button
     albumsBtn.addEventListener("click", async (event) => {
        event.stopPropagation();
        console.log(` Mostrando álbumes del artista ${artistData.name}`);
        window.location.href = `albums.html?artist=${artistData.id}`;; 
    });
}



// Listen for changes in the hash
window.addEventListener("hashchange", handleNavigation);

// Show playlists by genre
async function showPlaylists(genreId) {

    const playlists = await getPlaylistsByGenre(accessToken, genreId);
    
    if (!playlists.length) {
        console.warn(` No playlists were found for the genre: ${genreId}`);
        return;
    }


    const playlistsContainer = document.getElementById("playlistsContainer");
    playlistsContainer.innerHTML = ""; 

    playlists.forEach(playlist => {
       
        const playlistCard = document.createElement("div");
        playlistCard.classList.add("card-playlist");

        playlistCard.innerHTML = `
            <img src="${playlist.images[0]?.url || 'default.jpg'}" alt="${playlist.name}">
            <h3>${playlist.name}</h3>
            <p>By ${playlist.owner.display_name}</p>
            <a href="${playlist.external_urls.spotify}" target="_blank" class="btn-play">Play</a>
        `;

        playlistsContainer.appendChild(playlistCard);
    });

}


// Listen for hash changes
window.addEventListener("hashchange", handleNavigation);

document.addEventListener("DOMContentLoaded", initApp);

// Capture artist search event
document.getElementById("searchButton").addEventListener("click", searchArtist);
