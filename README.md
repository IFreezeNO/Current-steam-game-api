# Steam web api

You can search up steam users by their steamid and see what games they currently play.


Nightbot command: 

`$(eval const api = $(urlfetch json https://steam-game-checker.herokuapp.com/steamid/<streamername>); if (api.error) {'Error';} else { api['steamname']+ ' is currently playing: ' + api['currentgame']})`


`$(eval const api = $(urlfetch json https://steam-game-checker.herokuapp.com/steamid/<streamername>); if (api.error) {'Error';} else { api['steamname']+ ' is currently playing: ' + api['currentgame']+ ' get this game on '+api['gamestore']+ ' for '+api['price']+ ' EUR'})`
 
 https://in-game.tech/
  
![ScreenShot](https://i.imgur.com/WstFmXE.png)
![ScreenShot](https://i.imgur.com/xPlT9nl.png)

![ScreenShot](https://i.imgur.com/hfnpRAQ.png)

