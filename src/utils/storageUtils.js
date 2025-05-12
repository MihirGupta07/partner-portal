const StorageUtils = {
    set: async (keyValueObject) => {
        // if(NativeBridge.isAvailable)
        //     await NativeBridge.Actions.sendToDevice(NativeBridge.Events.storeObject, keyValueObject)

        // else{
            Object.keys(keyValueObject).forEach((key) => {
                let value = keyValueObject[key];

                if (typeof value === "object")
                    value = JSON.stringify(value)

                localStorage.setItem(key, value)

            });
        // }

        return true;
    },

    setKey: (key, value) => {
        /*if(NativeBridge.isAvailable){
            NativeBridge.Actions.sendToDevice(NativeBridge.Events.storeKey, {key: key, value: value})
        }
        else{*/
            localStorage.setItem(key, value)
        // }
    },

    get: (key) => {
        // if(NativeBridge.isAvailable){
            // NativeBridge.Actions.sendToDevice(NativeBridge.Events.getStoredKey, {key: key})
            //     return window.getReactNativeApi(5000).getStorage(key) // promise will fail if no response in 5 seconds
        // }
        // else{
            return localStorage.getItem(key)
        // }
    },

    delete: (key) => {
        // if(NativeBridge.isAvailable){}
        // else{
            localStorage.removeItem(key)
        // }

        return true;
    },

    flushSession: async function(){
        //add keys that need to be persisted - eg: language,
        let excludedKeys = [/^language$/, /^utm.*$/, /^lastExternalReferrerTime$/, /^_WE_.*$/];
        // if(NativeBridge.isAvailable){
            // native code to be written
        // }
        // else {
            for (const key in localStorage) {
                if (!excludedKeys.some(regex => regex.test(key))) {
                    // Remove the item from localStorage
                    localStorage.removeItem(key);
                }
            // }
        }

        return true;
    }
};

export default StorageUtils;