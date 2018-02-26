# Golad game match viewer

## Setting up

This guide assumes the following software to be installed and globally
accessible:

- Git
- Node.js >= 4.x
- NPM 2.x/3.x

To start developing, execute the following commands:

```
git clone https://github.com/riddlesio/golad-matchviewer.git
cd golad-matchviewer
npm install
npm run dev-build
```

### Building assets

To compile for development, run the following command:

```
npm run dev-build
```

To compile for production, run the following command:

```
npm run build
```

### Running the test server

Run the following command:

```
node server.js
```

### Developing a Match Viewer

## Application flow

The GameViewer's entry point is the `src/js/bootstrap.js` file. This file is
included for development purposes. For production, the bootstrapping file is
provided by the build pipeline of either TheAIGames.com or Riddles.io.

### Data handling

#### Update: CorrectMe, this is outdated

Data retrieval is managed by `AbstractGame`. When data has been successfully
retrieved, the handleData callback in your game's implementation is called.
An example implementation can be found in the `src/js/game/HelloWorldGame.js`
file.

### Rendering

State rendering is initiated by calling the render method in your GameViewer.
This method should render to the DOM by utilising [React](https://facebook.github.io/react/)
or a similar templating engine.