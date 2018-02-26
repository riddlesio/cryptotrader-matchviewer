import 'babel-polyfill';

/* @ifdef LOCAL */
import dataProvider from '@riddles/match-viewer/lib/dataProvider/fixtureDataProvider';
import data from './data/dummyData.json';
/* @endif */
/* @ifdef AI_GAMES **
 import dataProvider  from '@riddles/match-viewer/lib/dataProvider/aiGamesDataProvider';
 /* @endif */
/* @ifdef RIDDLES **
 import dataProvider  from '@riddles/match-viewer/lib/dataProvider/riddlesDataProvider';
 /* @endif */
import MatchViewer from './game/MatchViewer';
const { canvas } = require('./data/gameDefaults.json');

const userAgent = navigator.userAgent;
if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    document.body.classList.add('is-safari');
}

const game = new MatchViewer({
    name: 'golad',

    dataProvider: dataProvider(/* @ifdef LOCAL */data/* @endif */),

    player: {
        // Determines whether they player's chrome should be displayed
        chrome: true,

        // Determines whether view selection should be possible
        viewstack: false,

        // Determines the player's aspect ratio, should be a number between 0 and 1
        aspectRatio: canvas.height / canvas.width,

        // Time between each step when playing
        playbackTimeout: {
            min: 100,
            max: 1000,
        },
    },
});
