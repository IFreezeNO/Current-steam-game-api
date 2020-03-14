const request = require('request');
const express = require('express');
const cheerio = require('cheerio')
const axios = require('axios');
const sgb = require("steam-game-browser");
const app = express();


 
let options = {
    appID: "",
    currency: "",
    gameprice: "",
};
if(options.appID == "") {
}

function lookupgame(gamename) {
    sgb.searchByName(gamename, (err, data) => {

        //if game is free = dont show any price
        if(data.is_free == true) {
            options.gameprice = 0;

        } else {
            options.gameprice = data.price_overview.final/100;
        }
        options.currency = data.price_overview.currency;
        options.appID = data.steam_appid;
    });
}




//write steamid/<steam64> to show up his status. 
app.get('/steamid/:SteamID', function (req, res) {

    //Checking if it is a steam64 id or username
    if(req.params.SteamID.length == 17 && isNaN(req.params.SteamID) == false) {
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
        lookupgame(gamename);
            
        //checking if he is in-game
        if(gamename === "") {
            //if he is not ingame we will show this
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamname}", "currentgame":"N/A"}`;
        } else {
            //if he is ingame we will show this
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamname}", "currentgame":"${gamename}","gamestore":"https://store.steampowered.com/app/${options.appID}", "Price": "${options.gameprice}", "Currency": "${options.currency}"}`;
        }


        //parsing data
        var gameinformationParsed = JSON.parse(Information);
        
        //Showing the person his information
        res.send(gameinformationParsed);
    
});
});
app.listen(process.env.PORT || 5000);

