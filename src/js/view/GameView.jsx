import React from 'react';

import Tabs from './Tabs.jsx';
import Chart from './Chart.jsx';
import Player from './Player.jsx';
import CheckBoxes from './CheckBoxes.jsx';

function getPairs(charts) {
    return Object.keys(charts).sort();
}

class GameView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tab: getPairs(props.charts)[0],
            lockY: true,
            showCandles: true,
            showVolume: true,
            showValue: true,
            showStacks: false,
        };
    }

    getOnTabClick(pair) {
        return () => this.setState({ tab: pair });
    }

    getCheckboxToggle(type) {
        return () => this.setState({ [type]: !this.state[type] });
    }

    render() {
        const { charts, settings, score } = this.props;
        const { tab, lockY, showCandles, showVolume, showValue, showStacks } = this.state;
        const { chart, players } = settings;

        const chartSettings = {
            lockY,
            showCandles,
            showVolume,
            showValue,
            showStacks,
            ...chart,
        };

        return (
            <div className={ 'CryptoTrader-wrapper' }>
                <div className="CryptoTrader">
                    <div className="ui-top">
                        <Tabs
                            pairs={getPairs(charts)}
                            selectedTab={tab}
                            getOnTabClick={::this.getOnTabClick}
                        />
                        {
                            players[0] &&
                            <Player player={players[0]} score={score} />
                        }
                    </div>
                    <div className="CryptoTrader-chart-wrapper">
                        <Chart pair={tab} chartData={charts[tab]} settings={chartSettings} />
                    </div>
                    <div className="ui-bottom">
                        <CheckBoxes
                            getOnChange={::this.getCheckboxToggle}
                            checkBoxes={[
                                {
                                    name: 'showCandles',
                                    label: 'Show candles',
                                    value: showCandles,
                                    align: 'left',
                                }, {
                                    name: 'showVolume',
                                    label: 'Show volume',
                                    value: showVolume,
                                    align: 'left',
                                }, {
                                    name: 'showValue',
                                    label: 'Show value',
                                    value: showValue,
                                    align: 'left',
                                }, {
                                    name: 'showStacks',
                                    label: 'Show stacks',
                                    value: showStacks,
                                    align: 'left',
                                }, {
                                    name: 'lockY',
                                    label: 'Lock y-axis',
                                    value: lockY,
                                    align: 'right',
                                },
                            ]}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default GameView;
