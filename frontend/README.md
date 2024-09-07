# Nature GO


## Install dependencies

```npm install```

## Run

```npx expo start```

# Run through a GitHub CodeSpace

```npx expo start --tunnel```

Click the `Make public` button on the popup, or in the `Ports` tab. 

## Run with local config

To run on web using a local server, use

```$env:ENVIRONMENT = 'local'; npx expo start --web```

## Deployment

```eas update --channel preview --message "update message"```
