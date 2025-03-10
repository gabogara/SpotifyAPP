# Spotify Music Explorer

This project is a web application that integrates with the **Spotify API** to allow users to search for artists, view their top songs and albums, and explore different music genres.

## Features

- **Search for an Artist**: Users can enter the name of an artist to retrieve relevant information.
- **View Popular Songs**: Displays a list of the most popular songs for a selected artist.
- **Explore Albums**: Retrieves and displays all albums of a selected artist.
- **Browse Music Genres**: Lists available music genres and allows users to explore playlists for each genre.

## Technologies Used

- **HTML**: Provides the structure of the web application.
- **CSS**: Defines the styles and layout.
- **JavaScript (ES6)**: Handles API requests and user interactions.
- **Spotify Web API**: Fetches data on artists, albums, tracks, and genres.

## Project Structure




## Installation and Setup

### Prerequisites

- A modern web browser
- A **Spotify Developer Account**
- A local development server (optional)

### Steps to Run the Project

1. **Clone the repository**
   ```sh
   git clone https://github.com/gabogara/SpotifyAPP.git
   cd SpotifyAPP

2. **Set Up API Credentials**

  1. Navigate to the **Spotify Developer Dashboard**:  
     [Spotify Developer](https://developer.spotify.com/)
  2. Create a new **Spotify App** and obtain your **Client ID** and **Client Secret**.
  3. Inside the project folder, create a new file called `config.js`.
  4. Add the following content to `config.js` and replace `"your-client-id"` and `"your-client-secret"` with your actual credentials:

       ```js
       export const SPOTIFY_CONFIG = {
           CLIENT_ID: "your-client-id",
           CLIENT_SECRET: "your-client-secret"
       };
       
  5. Do not share your credentials or commit config.js to a public repository.

### Run the Project Locally ### 
  1. Open index.html in a browser.
  2. Alternatively, use a local development server such as Live Server in VS Code or run:
     ```sh
     npx live-server
### Use the Application ###
 1. Search for an artist using the input field.
 2. Click on an artist to view their top songs or albums.
 3.  Explore different music genres and their playlists.

## API Endpoints Used

- **`GET /v1/search`** - Search for an artist by name.
- **`GET /v1/artists/{id}/top-tracks`** - Retrieve an artist's top tracks.
- **`GET /v1/artists/{id}/albums`** - Retrieve an artist's albums.
- **`GET /v1/browse/categories`** - Fetch available music genres.
- **`GET /v1/browse/categories/{id}/playlists`** - Retrieve playlists for a genre.

## License

This project is licensed under the **MIT License**.

---

## Contact

For any questions, issues, or feedback, please reach out via **GitHub** or open an issue in the repository.
