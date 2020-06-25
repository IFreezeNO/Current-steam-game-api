const request = require('request');
const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
var favicon = require('serve-favicon');
const axios = require('axios');
const sgb = require("steam-game-browser");
const app = express();

//favicon on all pages
app.use(favicon(path.join(__dirname, 'views','img' ,'favicon.png')))



//faceit get request
app.get('/faceit/:faceitname', function(req, res) {
    // Header
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('X-XSS-Protection' , 1 );
var faceiturl = `https://api.faceit.com/core/v1/nicknames/${req.params.faceitname}`
request({
    url: faceiturl,
    json: true
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {

    console.log(body);

       if(body.result == "error") {
        return res.status(400).json({ error : 'Could not find the user'});
        } 
        if(body.payload.games === !"csgo") {
        return res.status(400).json({ error : 'Could not find the user'});
        }
        var faceitelo = body.payload.games.csgo.faceit_elo;
        

        var rankup = 0;
        var rankdown = 0;

        //rankdown 
        if(faceitelo < 801) {
            rankdown = 1-faceitelo;  
          }else if(faceitelo < 951) {
              rankdown = 800-faceitelo;  
          }else if(faceitelo < 1101) {
              rankdown = 950-faceitelo;  
          }else if(faceitelo < 1251) {
              rankdown = 1100-faceitelo;
          }else if(faceitelo < 1401) {
              rankdown = 1250 - faceitelo;  
          }else if(faceitelo < 1551) {
              rankdown = 1400-faceitelo;
          }else if(faceitelo < 1701) {
              rankdown = 1550-faceitelo;
          }else if(faceitelo < 1851) {
              rankdown = 1701-faceitelo;
          }else if(faceitelo < 2001) {
              rankdown = 1850-faceitelo;
          }else if(faceitelo > 2001){
            rankdown = 2000-faceitelo;
          }

        //rankup 
        if(faceitelo < 801) {
          rankup = 801 - faceitelo;  
        }else if(faceitelo < 951) {
            rankup = 951 - faceitelo;  
        }else if(faceitelo < 1101) {
            rankup = 1101 - faceitelo;  
        }else if(faceitelo < 1251) {
            rankup = 1251 - faceitelo;
        }else if(faceitelo < 1401) {
            rankup = 1401 - faceitelo;  
        }else if(faceitelo < 1551) {
            rankup = 1551 - faceitelo;
        }else if(faceitelo < 1701) {
            rankup = 1701 - faceitelo;
        }else if(faceitelo < 1851) {
            rankup = 1851 - faceitelo;
        }else if(faceitelo < 2001) {
            rankup = 2001 - faceitelo;
        } 
        var faceit = `{"level":${body.payload.games.csgo.skill_level_label}, "elo":${faceitelo}, "rankup": ${rankup}, "rankdown": ${rankdown}}`;

        let faceitinfo = JSON.parse(faceit);
        res.send(faceitinfo)
    } else {
        res.status(400).json({ error : 'Could not find the user, remember this is case sensitive'});
    }
})
});





function lookupgame(gamename, steamname, response, $, req, res) {
    sgb.searchByName(gamename, (err, data) => {


        //removing / so they cant rename and do commands with the nightbot
        var steamnameSantized = steamname.replace("/", "");
        //if game is free = dont show any price
        if (data.is_free == true) {
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamnameSantized}", "currentgame":"${gamename}","gamestore":"https://store.steampowered.com/app/${data.steam_appid}", "price": 0, "currency": "EUR"}`;

        } else {
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamnameSantized}", "currentgame":"${gamename}","gamestore":"https://store.steampowered.com/app/${data.steam_appid}", "price": ${data.price_overview.final/100}, "currency": "EUR"}`;

        }
        if (gamename === "") {
            //if he is not ingame we will show this
            var Information = `{"steamid":"${req.params.SteamID}", "steamname":"${steamnameSantized}", "currentgame":"N/A","gamestore":"N/A", "price": 0, "currency": "N/A"}`;
        }

        //parsing data
        let gameinformationParsed = JSON.parse(Information);

        //Showing the person his information
        res.send(gameinformationParsed);
    });
}



//write steamid/<steam64> to show up his status.
app.get('/steamid/:SteamID', function(req, res) {
    // Header
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('X-XSS-Protection' , 1 );


    //Checking if it is a steam64 id or username
    if (req.params.SteamID.length == 17 && isNaN(req.params.SteamID) == false) {
        var SteamURL = `https://steamcommunity.com/profiles/${req.params.SteamID}/`;
    } 
    //else if("?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9]+") {
     //   var SteamURL = req.params.steamID;
   // } 
    else {
        var SteamURL = `https://steamcommunity.com/id/${req.params.SteamID}/`;
    }


    axios.get(SteamURL).then((response) => {

        //getting HTML tags
        const $ = cheerio.load(response.data)

        //getting steam name
        const gamename = $("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page > div.profile_content > div > div.profile_rightcol > div.responsive_status_info > div > div.profile_in_game_name").text();
        //getting steam game
        const steamname = $("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page > div.profile_header_bg > div > div > div > div.profile_header_centered_persona > div.persona_name > span.actual_persona_name").text();

        //if no username found, show errormsg
        if(steamname == "") {
           res.status(400).json({ error : 'Could not find the steam account'});
        }


        //looking up the game on function lookupgame
        lookupgame(gamename, steamname, response, $, req, res);

    });
});


  
  

//index file
app.use(express.static(path.join(__dirname, "views")));
app.get('/', function(req, res) { 
     res
     .status(200)
     .header('X-XSS-Protection' , 1 )
     .sendFile(path.join(__dirname, "views", "index.html"))   
});

app.listen(process.env.PORT || 5000);
