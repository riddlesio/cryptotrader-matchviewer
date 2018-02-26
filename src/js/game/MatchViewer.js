import React from 'react';
import ReactDOM from 'react-dom';
import { createGame } from '@riddles/match-viewer';
import GameView from '../view/GameView.jsx';
import { parseSettings, parseCharts } from '../io/Parser';

const defaults = require('../data/gameDefaults.json');

/**
 * MatchViewer class
 * @constructor
 */
const MatchViewer = createGame({

    /**
     * MatchViewer construct function
     * Automatically executed when instantiating the HelloWorldGame class
     * @param  {Object} options
     */
    construct: function (options) {
        window.viewer = this;
    },

    /**
     * Cleans up anything which might cause memory leaks
     */
    destroy: function () {
        delete window.viewer;
    },

    getDefaults: function () {
        return defaults;
    },

    /**
     * Parses the received data
     * @param  {Object} data
     */
    handleData: function (data) {
        const matchData = data.matchData;
        const playerData = data.playerData;
        const settings = parseSettings(matchData, playerData, defaults);
        const charts = parseCharts(matchData);

        this.settings = settings;
        this.charts = charts;
        this.score = matchData.score;

        window.requestAnimationFrame(::this.render);
    },

    /**
     * Renders the game
     */
    render: function () {
        const { settings, charts, score } = this;

        const props = {
            settings,
            charts,
            score,
        };

        ReactDOM.render(<GameView { ...props }/>, this.getDOMNode());
    },
});

export default MatchViewer;
