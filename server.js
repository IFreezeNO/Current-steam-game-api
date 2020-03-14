const request = require('request');
const express = require('express');
const cheerio = require('cheerio')
const axios = require('axios');
const app = express();

let gameinformationParsed = "Try again please";



function getGame(URL, steam64) {

    axios.get(URL).then((response) => {

        const $ = cheerio.load(response.data)

        //getting steam name
        const gamename = $("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page > div.profile_content > div > div.profile_rightcol > div.responsive_status_info > div > div.profile_in_game_name").text();
        //getting steam game
        const steamname = $("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page > div.profile_header_bg > div > div > div > div.profile_header_centered_persona > div.persona_name > span.actual_persona_name").text();

        //checking if he is in-game
        if(gamename === "") {
            var Information = `{"steamid":"${steam64}", "steamname":"${steamname}", "currentgame":"Currently not playing any games on Steam"}`;
        } else {
            var Information = `{"steamid":"${steam64}", "steamname":"${steamname}", "currentgame":"${gamename}"}`;

        }

        //parsing data
         gameinformationParsed = JSON.parse(Information);

})
};

//write steamid/<steam64> to show up his status. 
app.get('/steamid/:SteamID', function (req, res) {
    var SteamURL = `https://steamcommunity.com/profiles/${req.params.SteamID}/`;

    //Sending over the steamid to the webscraper function
    setTimeout(function(){getGame(SteamURL, req.params.SteamID);},0);

    //Showing the person his information
    setTimeout(function(){ res.send(gameinformationParsed);},500);


})

app.listen(process.env.PORT || 5000);

