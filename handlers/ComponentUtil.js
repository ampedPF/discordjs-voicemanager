const fs = require('node:fs');
const path = require('node:path');


module.exports = (client) => {
    const componentFolder = path.join(appRoot,'components');
    fs.readdirSync(componentFolder).forEach(async componentDirectory => {
        switch(componentDirectory) {
            case "buttons":
                const buttonSubFolder = path.join(componentFolder, componentDirectory);
                for(const buttonFile of fs.readdirSync(buttonSubFolder).filter(buttonFile => buttonFile.endsWith('.js'))) {
                    const buttonPath = path.join(buttonSubFolder, buttonFile);
                    const button = require(buttonPath);
                    
                    // Set a new item in the Collection with the key as the button name and the value as the exported module
                    if ('data' in button && button.data.data.custom_id && 'execute' in button) {
                        client.buttons.set(button.data.data.custom_id, button);
                        console.log("Successfully loaded [Button]\t", button.data.data.custom_id);
                    } else {
                        console.log(`[WARNING] The button at ${buttonPath} is missing a required "data", "data.customId" or "execute" property.`);
                    }
                }
                break;
            case "modals":
                    const modalSubFolder = path.join(componentFolder, componentDirectory);
                    for(const modalFile of fs.readdirSync(modalSubFolder).filter(buttonFile => buttonFile.endsWith('.js'))) {
                        const modalPath = path.join(modalSubFolder, modalFile);
                        const modal = require(modalPath);
                        
                        // Set a new item in the Collection with the key as the button name and the value as the exported module
                        if ('data' in modal && modal.data.data.custom_id && 'execute' in modal) {
                            client.modals.set(modal.data.data.custom_id, modal);
                            console.log("Successfully loaded [Modal]\t", modal.data.data.custom_id);
                        } else {
                            console.log(`[WARNING] The button at ${modalPath} is missing a required "data", "data.customId" or "execute" property.`);
                        }
                    }
                    break;
        }
    });
};
