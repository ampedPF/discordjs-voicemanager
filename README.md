# discordjs-voicemanager

- Create an application on https://discord.com/developers/applications  

- In Bot tab, after enabling the bot and reseting the token, make sure to also enable `Presence Intent`, `Server Members Intent`, `Message Content Intent`.

- In OAuth2 tab, select `bot` scope with `Administrator` bot permissions then invite bot to your discord server using the generated link.  
e.g. https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot  
(change CLIENT_ID with your bot Application ID)

- Get your Guild ID by right-clicking on your discord server (Make sure you have developer's mode enabled in `Settings > App Settings > Advanced`)

- Rename `.env_sample` to `.env` and edit it with information from the step above.

- Use `npm i` to install the required node modules.

- Launch bot with `node .` in root projet folder.


## Voice Channel Manager

### Join to create
Allow a user to join a specific voice channel in order to create a private voice channel and move automatically to it.  
Use `/voice` commands to configure the created channel:  
| Command | Description |
| --- | --- |
| `/voice allow @member` | Give access to your channel to a specific user |  
| `/voice deny @member` | Remove access to your channel to a specific user |
| `/voice set access Private` | Make your channel private |
| `/voice set access Public` | Make your channel public |
| `/voice set name newChannelName` | Change the name your channel to `newChannelName` |
| `/voice set userLimit newUserLimit` | Change the user limit of your channel to `newUserLimit` |
| `/voice set visibility Show` | Make your channel invisible to others |
| `/voice set visibility Hide` | Make your channel visible to others |
