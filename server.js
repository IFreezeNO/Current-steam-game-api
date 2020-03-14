const request = require('request');
const express = require('express');
const cheerio = require('cheerio')
const axios = require('axios');
const sgb = require("steam-game-browser");
const app = express();




function lookupgame(gamename, steamname, response, $, req, res) {
    sgb.searchByName(gamename, (err, data) => {

        //if game is free = dont show any price
        if (data.is_free == true) {
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamname}", "currentgame":"${gamename}","gamestore":"https://store.steampowered.com/app/${data.steam_appid}", "price": 0}`;

        } else {
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamname}", "currentgame":"${gamename}","gamestore":"https://store.steampowered.com/app/${data.steam_appid}", "price": ${data.price_overview.final/100}, "currency": "${data.price_overview.currency}"}`;

        }
        if (gamename === "") {
            //if he is not ingame we will show this
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamname}", "currentgame":"N/A"}`;
        }

        //parsing data
        var gameinformationParsed = JSON.parse(Information);

        //Showing the person his information
        res.send(gameinformationParsed);
    });
}



//write steamid/<steam64> to show up his status.
app.get('/steamid/:SteamID', function(req, res) {

    //Checking if it is a steam64 id or username
    if (req.params.SteamID.length == 17 && isNaN(req.params.SteamID) == false) {
        var SteamURL = `https://steamcommunity.com/profiles/${req.params.SteamID}/`;
    } else {
        var SteamURL = `https://steamcommunity.com/id/${req.params.SteamID}/`;
    }

    axios.get(SteamURL).then((response) => {

        //getting HTML tags
        const $ = cheerio.load(response.data)

        //getting steam name
        const gamename = $("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page > div.profile_content > div > div.profile_rightcol > div.responsive_status_info > div > div.profile_in_game_name").text();
        //getting steam game
        const steamname = $("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page > div.profile_header_bg > div > div > div > div.profile_header_centered_persona > div.persona_name > span.actual_persona_name").text();


        //looking up the game on function lookupgame
        lookupgame(gamename, steamname, response, $, req, res);

    });
});
app.listen(process.env.PORT || 5000);
