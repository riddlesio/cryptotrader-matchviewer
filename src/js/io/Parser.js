/**
 * Parses the passed data object into settings which are usable by the viewer
 * @param   {Object} data       The JSON data received from the server
 * @param   {Object} playerData The data about the participating players from the server
 * @param   {Object} [defaults] The default settings as passed from the gameViewer
 * @returns {Object}            The settings object
 */
function parseSettings(data, playerData, defaults = {}) {

    return {
        ...defaults,
        ...data.settings,
        players: parsePlayerNames(playerData),
    };
}

function parsePlayerNames(playerData) {

    return playerData.map((player) => ({
        alias: player.name || '',
        emailHash: player.emailHash || '',
    }));
}

function parseCharts(data) {
    const { charts, states } = data;

    return Object.assign({}, ...Object.keys(charts).map(pair => {  // Map each chart
        let upperYLimit = 0;
        let lowerYLimit = Number.MAX_SAFE_INTEGER;
        let volumeLimit = 0;
        let upperValueLimit = 0;
        let lowerValueLimit = Number.MAX_SAFE_INTEGER;
        let orderLimit = 0;

        const initialStacks = {};
        Object.keys(states[0].stacks).forEach(key => {
            initialStacks[key] = 0;
        });
        const stacksLimit = { ...initialStacks };

        return {
            [pair]: {
                chart: charts[pair].map(({ timestamp, high, low, volume, ...rest }) => {
                    const state = states.find(state => state.timestamp === timestamp);
                    const date = new Date(timestamp * 1000);

                    // OHLC limits
                    upperYLimit = high > upperYLimit ? high : upperYLimit;
                    lowerYLimit = low < lowerYLimit ? low : lowerYLimit;
                    volumeLimit = volume > volumeLimit ? volume : volumeLimit;

                    // Value and value limits
                    const value = state ? state.value : 0;
                    if (value) {
                        upperValueLimit = value > upperValueLimit ? value : upperValueLimit;
                        lowerValueLimit = value < lowerValueLimit ? value : lowerValueLimit;
                    }

                    // Stacks and stacks limit
                    const stacks = state ? state.stacks : initialStacks;
                    if (stacks) {
                        Object.keys(stacks).forEach(key => {
                            stacksLimit[key] = stacks[key] > stacksLimit[key]
                                ? stacks[key]
                                : stacksLimit[key];
                        });
                    }

                    // Orders and order limit
                    const orders = state && state.orders ? state.orders : [];
                    orderLimit = orders.length > orderLimit ? orders.length : orderLimit;

                    return { high, low, volume, date, value, stacks, orders, ...rest };
                }),
                upperYLimit,
                lowerYLimit,
                volumeLimit,
                upperValueLimit,
                lowerValueLimit,
                stacksLimit,
                orderLimit,
            },
        };
    }));
}

export {
    parseSettings,
    parseCharts,
};
