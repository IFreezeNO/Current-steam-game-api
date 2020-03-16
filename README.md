# Steam web api

You can search up steam users by their steamid and see what games they currently play.
You can lookup faceit users and see their elo with API

Nightbot command for  https://in-game.tech/steamid: 

`$(eval const api = $(urlfetch json https://in-game.tech/steamid/<streamername>); if (api.error) {'Error';} else { api['steamname']+ ' is currently playing: ' + api['currentgame']})`


`$(eval const api = $(urlfetch json https://in-game.tech/steamid/<streamername>); if (api.error) {'Error';} else { api['steamname']+ ' is currently playing: ' + api['currentgame']+ '. Get this game on steam: '+api['gamestore']+ ' for '+api['price']+ ' EUR'})`
 
 Nightbot command for  https://in-game.tech/faceit: 

`$(eval const api = $(urlfetch json https://in-game.tech/faceit/IFreeze23 ); if (api.error) {'Error';} else { 'Faceit level: '+api['level']+ ' ELO: ' +api['elo']+ '. ELO needed for rankup/rankdown ' +api['rankup']+'/'+api['rankdown']})`







  
![ScreenShot](https://i.imgur.com/WstFmXE.png)
![ScreenShot](https://i.imgur.com/xPlT9nl.png)

![ScreenShot](https://i.imgur.com/hfnpRAQ.png)

