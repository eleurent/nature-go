# Nature go

## Run

```npx expo start```

Usfeful options: `--web`, and `--tunnel` for serving mobile through a GitHub CodeSpace.

## Run with local config

To run on web using a local server, use

```$env:ENVIRONMENT = 'local'; npx expo start --web```

## Deployment

```eas update --channel preview --message "update message"```
