require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const expressLayout = require("express-ejs-layouts");
const bodyParser = require('body-parser')
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();


app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req,res)=> {
    res.render('index')
})

 
app.get('/search-artist', async (req, res)=> {
    const {artistName} = req.query;
    const listOfArtists = await spotifyApi.searchArtists(artistName)
    //console.log('The received data from the API: ', listOfArtists.body.artists.items);
    const artistArray =  listOfArtists.body.artists.items
    //console.log(artistArray) 
    res.render('search-artist-results', {artistArray})
})
app.get('/albums/:artistId', async (req, res)=> {
    const { artistId } = req.params
    //console.log(artistId)
    const listOfAlbumsData = await spotifyApi.getArtistAlbums(
        artistId,
        { limit: 10, offset: 20 },
    ); 


    const listOfAlbums = (listOfAlbumsData.body.items)
    //console.log(listOfAlbums)
    res.render('albums', {listOfAlbums})
});


 app.get('/tracks/:albumId', async (req, res)=> {
    const { albumId } = req.params
    console.log(albumId)
    const listOfTracks = await spotifyApi.getArtistAlbums(
        albumId,
        { limit: 5, offset: 1 },
    );
    const listOfTracksCleaned = (listOfTracks.body.items)
    console.log(listOfTracksCleaned)
    res.render('tracks', {listOfTracksCleaned})
}); 






app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
