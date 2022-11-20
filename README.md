# discordjs-voicemanager

- Create a bot on https://discord.com/developers/applications with `Presence Intent`, `Server Members Intent`, `Message Content Intent`  
(scopes yet to be determined so give it the "Admin" scope for the time being)

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
