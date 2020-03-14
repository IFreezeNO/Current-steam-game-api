# Steam web api

You can search up steam users by their steamid and see what games they currently play.

![ScreenShot](https://i.imgur.com/xPlT9nl.png)

![ScreenShot](https://i.imgur.com/hfnpRAQ.png)


Nightbot command: 

`$(eval const api = $(urlfetch json https://steam-game-checker.herokuapp.com/steamid/$(querystring)); if (api.error) {'Error';} else { api['steamname']+ ' is currently playing: ' + api['currentgame']})
