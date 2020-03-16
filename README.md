# Steam web api

You can search up steam users by their steamid and see what games they currently play.


Nightbot command for /steamid/: 

`$(eval const api = $(urlfetch json https://in-game.tech/steamid/<streamername>); if (api.error) {'Error';} else { api['steamname']+ ' is currently playing: ' + api['currentgame']})`


`$(eval const api = $(urlfetch json https://in-game.tech/steamid/<streamername>); if (api.error) {'Error';} else { api['steamname']+ ' is currently playing: ' + api['currentgame']+ '. Get this game on steam: '+api['gamestore']+ ' for '+api['price']+ ' EUR'})`
 
 Nightbot command for /faceit/: 

`$(eval const api = $(urlfetch json https://in-game.tech/faceit/<faceitname>); if (api.error) {'Error';} else { 'Faceit level: '+api['level']+ ' Elo:' +api['elo']+ ' Elo needed for rankup/rankdown ' +api['rankup']+ '/' api['rankdown']})`






 https://in-game.tech/
  
![ScreenShot](https://i.imgur.com/WstFmXE.png)
![ScreenShot](https://i.imgur.com/xPlT9nl.png)

![ScreenShot](https://i.imgur.com/hfnpRAQ.png)

