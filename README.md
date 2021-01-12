# solid-iot-platform
IOT platform using Solid technology with `solid-ui-react`
Uses for development purposes a `node-solid-server` hosted at *solid.luxumbra.fr*, running its latest version

## Run

   ```bash
    npm ci && npm run dev
   ```

## App deployment 

To deploy the Web App you first need to have access to the good solid Pod Files. You can find some example in the directory SolidPodFiles.

There are 2 types of files : the public ones (sensor-???.ttl et sersors.ttl) that are currently available publically on https://solid-iot.solidcommunity.net/ Pod and the private one : tourINSA.ttl wich is stored on a private Pod.
If you want to use your personnal public server, add the sensor* files on it, and change the path stored in publicDataDirURI in pages/index.tsx.
To use the personal example location data, put the file tourINSA.ttl in your personal Pod in a private area an change the path stored in privateDataDirURI in pages/index.tsx.
