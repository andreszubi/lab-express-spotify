require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const expressLayout = require("express-ejs-layouts");
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();


app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  async function retriveAccessToken(){
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body["access_token"]);
      } catch (error) {
        console.log("Something went wrong when retrieving an access token.", error);
      }
    }

    retriveAccessToken();

    //Body Parser
    app.use(express.urlencoded({ extended: true }));



// Our routes go here:
app.get('/', async (req, res) => {
 try {
    res.render('index');
  }
  catch (error) {
    console.log("Something went wrong when loading homepage.", error);
 }
});

 
app.get('/search-artist', async (req, res, next) => {
    try {
        const { artist } = req.query;
        await spotifyApi.searchArtists(artist);
       
        const artistItems = data.body.artists.items.map((artist) => artist);
        await app.get("artist-search-results", (req, res) => {
            res.render("artist-search-results", { artistItems })});
    } catch (error) {
        console.log('The error while searching artists occurred: ', error);
}
})

app.get('/albums/:artistId', async (req, res) => {
    console.log('The received data from the API: ', data.body);
    try {
        const data = await spotifyApi.getArtistAlbums(data.artistId);
        const albums = data.body.items;
        res.render("albums", {albums});
    } catch (error) {
        console.log('The error while searching artists occurred: ', error);
}
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
