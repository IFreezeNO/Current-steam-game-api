# Steam web api

You can search up steam users by their steamid and see what games they currently play.

![ScreenShot](https://i.imgur.com/f6VKeuQ.png)

Nightbot command: 

$(eval const api = $(urlfetch json http://localhost:5000/steamid/$(querystring)); if (api.error) {'Error';} else { api['steamname']+ ' is Currently playing: ' + api['currentgame']})
