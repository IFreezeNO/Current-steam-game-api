const request = require('request');
const express = require('express');
const cheerio = require('cheerio')
const axios = require('axios');
const app = express();






//write steamid/<steam64> to show up his status. 
app.get('/steamid/:SteamID', function (req, res) {
    var SteamURL = `https://steamcommunity.com/profiles/${req.params.SteamID}/`;


    axios.get(SteamURL).then((response) => {

        const $ = cheerio.load(response.data)

        //getting steam name
        const gamename = $("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page > div.profile_content > div > div.profile_rightcol > div.responsive_status_info > div > div.profile_in_game_name").text();
        //getting steam game
        const steamname = $("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page > div.profile_header_bg > div > div > div > div.profile_header_centered_persona > div.persona_name > span.actual_persona_name").text();

        //checking if he is in-game
        if(gamename === "") {
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamname}", "currentgame":"Currently not playing any games on Steam"}`;
        } else {
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamname}", "currentgame":"${gamename}"}`;
        }

        //parsing data
        var gameinformationParsed = JSON.parse(Information);
        //Showing the person his information
  
        res.send(gameinformationParsed);
    });
});

app.listen(process.env.PORT || 5000);

