import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { BarSeries, CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { fitDimensions } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';
import { OHLCTooltip, SingleValueTooltip, HoverTooltip } from 'react-stockcharts/lib/tooltip';
import {
    CrossHairCursor,
    MouseCoordinateX,
    MouseCoordinateY,
    CurrentCoordinate,
} from 'react-stockcharts/lib/coordinates';

import getClosest from '../util/getClosest';

const dateFormat = timeFormat('%m-%d %H:%M');

function getYLimits({ chartData, settings }) {

    const {
        upperYLimit,
        lowerYLimit,
        volumeLimit,
        upperValueLimit,
        lowerValueLimit,
        stacksLimit,
        orderLimit,
    } = chartData;

    const orderYExtents = () => [orderLimit, 0];

    let chartYExtents = d => [d.high, d.low];
    let volumeYExtents = d => d.volume;
    let valueYExtents = d => d.value;
    let USDTYExtents = d => d.stacks['USDT'];
    let BTCYExtents = d => d.stacks['BTC'];
    let ETHYExtents = d => d.stacks['ETH'];

    if (settings.lockY) {
        const valueDiff = upperValueLimit - lowerValueLimit;

        chartYExtents = () => [upperYLimit, lowerYLimit];
        volumeYExtents = () => [volumeLimit, 0];
        valueYExtents = () => [upperValueLimit + valueDiff, lowerValueLimit - valueDiff];
        USDTYExtents = () => [stacksLimit['USDT'] * 1.2, 0];
        BTCYExtents = () => [stacksLimit['BTC'] * 1.2, 0];
        ETHYExtents = () => [stacksLimit['ETH'] * 1.2, 0];
    }

    return {
        orderYExtents,
        chartYExtents,
        volumeYExtents,
        valueYExtents,
        USDTYExtents,
        BTCYExtents,
        ETHYExtents,
    };
}

function mapProps({ pair, chartData, width, height, ratio, settings }) {

    const { chart } = chartData;

    const {
        margin,
        showGrid,
        mouseMoveEvent,
        panEvent,
        zoomEvent,
        zoomAnchor,
        clamp,
        showCandles,
        showValue,
        showVolume,
        showStacks,
        colors,
    } = settings;

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(chart);

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];

    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
    const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};

    const ohclFormat = pair.indexOf('USDT') >= 0 ? '.2f' : '.5f';

    const candleClass = showCandles ? '' : 'hidden';
    const volumeClass = showVolume ? '' : 'hidden';
    const valueClass = showValue ? '' : 'hidden';
    const stacksClass = showStacks ? '' : 'hidden';

    return {
        height,
        width,
        ratio,
        data,
        margin,
        xExtents,
        xScale,
        xAccessor,
        displayXAccessor,
        mouseMoveEvent,
        panEvent,
        zoomEvent,
        clamp,
        zoomAnchor,
        colors,
        yGrid,
        xGrid,
        ohclFormat,
        candleClass,
        volumeClass,
        valueClass,
        stacksClass,
    }
}

// fitWidth only works with extension of React.Component and without compose()
//
// Can't split charts into multiple components sadly, because of this we have to
// show/hide charts through classes and CSS :(
class ChartComponent extends React.Component {

    componentDidMount() {
        const order = document.querySelector('.Order');
        const element = getClosest(getClosest(order, 'g'), 'g');
        const { margin } = this.props.settings;
        const translateY = (2 * (margin.bottom - 25)) + 22;

        element.style.transform = `translateY(${translateY}px) scale(1, -1)`;
    }

    render() {

        const {
            height,
            width,
            ratio,
            data,
            margin,
            xExtents,
            xScale,
            xAccessor,
            displayXAccessor,
            mouseMoveEvent,
            panEvent,
            zoomEvent,
            clamp,
            zoomAnchor,
            colors,
            yGrid,
            xGrid,
            ohclFormat,
            candleClass,
            volumeClass,
            valueClass,
            stacksClass,
        } = mapProps(this.props);

        const {
            orderYExtents,
            chartYExtents,
            volumeYExtents,
            valueYExtents,
            USDTYExtents,
            BTCYExtents,
            ETHYExtents,
        } = getYLimits(this.props);

        return (
            <ChartCanvas
                height={height}
                width={width}
                ratio={ratio}
                type="svg"
                data={data}
                seriesName="MSFT"
                margin={margin}
                xExtents={xExtents}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                mouseMoveEvent={mouseMoveEvent}
                panEvent={panEvent}
                zoomEvent={zoomEvent}
                clamp={clamp}
                zoomAnchor={zoomAnchor}
            >
                {/* Order bars */}
                <Chart
                    id={0}
                    yExtents={orderYExtents}
                    height={margin.bottom - 25}
                    origin={(w, h) => [0, h - (margin.bottom - 25)]}
                >
                    <BarSeries
                        className="Order"
                        yAccessor={d => d.orders.length}
                        fill={colors['orders']}
                    />
                </Chart>

                {/* Candlesticks */}
                <Chart id={1} yExtents={chartYExtents}>
                    <XAxis
                        axisAt="bottom"
                        orient="bottom"
                        zoomEnabled={zoomEvent}
                        {...xGrid}
                    />
                    <YAxis
                        axisAt="right"
                        orient="right"
                        ticks={5}
                        zoomEnabled={zoomEvent}
                        {...yGrid}
                    />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format('.3f')}
                    />
                    <CandlestickSeries className={candleClass} />
                    <OHLCTooltip
                        origin={[0, -15]}
                        ohlcFormat={format(ohclFormat)}
                    />

                    <HoverTooltip
                        yAccessor={d => d.orders.length}
                        tooltipContent={({ currentItem }) => {
                            return {
                                x: null,
                                y: currentItem.orders.map(order => ({
                                    label: `${order.pair} ${order.type}`,
                                    value: order.amount,
                                }))
                            };
                        }}
                        fontSize={12}
                        bgFill="transparent"
                        bgheight={0}
                        bgwidth={0}
                    />
                </Chart>

                {/* Volume bars */}
                <Chart
                    id={2}
                    yExtents={volumeYExtents}
                    height={height / 3}
                    origin={(w, h) => [0, h - (height / 3)]}
                >
                    <YAxis
                        className={volumeClass}
                        axisAt="left"
                        orient="left"
                        ticks={5}
                        tickFormat={format('.2s')}
                        zoomEnabled={zoomEvent}
                    />
                    <MouseCoordinateX
                        at="bottom"
                        orient="bottom"
                        displayFormat={dateFormat}
                    />
                    <MouseCoordinateY
                        at="left"
                        orient="left"
                        displayFormat={format('.4s')}
                    />
                    <BarSeries className={volumeClass} yAccessor={d => d.volume} />
                </Chart>

                {/* Value Line */}
                <Chart id={3} yExtents={valueYExtents}>
                    <LineSeries
                        className={valueClass}
                        yAccessor={d => d.value}
                        stroke={colors['value']}
                    />
                    <CurrentCoordinate
                        className={valueClass}
                        yAccessor={d => d.value}
                        fill={colors['value']}
                    />
                    <SingleValueTooltip
                        className={valueClass}
                        origin={[0, 5]}
                        yLabel="Value"
                        labelStroke={colors['value']}
                        yDisplayFormat={format('.2f')}
                        yAccessor={d => d.value}
                    />
                </Chart>

                {/* USDT Line */}
                <Chart id={4} yExtents={USDTYExtents}>
                    <LineSeries
                        className={stacksClass}
                        yAccessor={d => d.stacks['USDT']}
                        stroke={colors['USDT']}
                    />
                    <CurrentCoordinate
                        className={stacksClass}
                        yAccessor={d => d.stacks['USDT']}
                        fill={colors['USDT']}
                    />
                    <SingleValueTooltip
                        className={stacksClass}
                        origin={[0, 20]}
                        yLabel="USDT"
                        labelStroke={colors['USDT']}
                        yDisplayFormat={format('.2f')}
                        yAccessor={d => d.stacks['USDT']}
                    />
                </Chart>

                {/* BTC Line */}
                <Chart id={5} yExtents={BTCYExtents}>
                    <LineSeries
                        className={stacksClass}
                        yAccessor={d => d.stacks['BTC']}
                        stroke={colors['BTC']}
                    />
                    <CurrentCoordinate
                        className={stacksClass}
                        yAccessor={d => d.stacks['BTC']}
                        fill={colors['BTC']}
                    />
                    <SingleValueTooltip
                        className={stacksClass}
                        origin={[0, 35]}
                        yLabel="BTC"
                        labelStroke={colors['BTC']}
                        yDisplayFormat={format('.5f')}
                        yAccessor={d => d.stacks['BTC']}
                    />
                </Chart>

                {/* ETH Line */}
                <Chart id={6} yExtents={ETHYExtents}>
                    <LineSeries
                        className={stacksClass}
                        yAccessor={d => d.stacks['ETH']}
                        stroke={colors['ETH']}
                    />
                    <CurrentCoordinate
                        className={stacksClass}
                        yAccessor={d => d.stacks['ETH']}
                        fill={colors['ETH']}
                    />
                    <SingleValueTooltip
                        className={stacksClass}
                        origin={[0, 50]}
                        yLabel="ETH"
                        labelStroke={colors['ETH']}
                        yDisplayFormat={format('.5f')}
                        yAccessor={d => d.stacks['ETH']}
                    />
                </Chart>

                <CrossHairCursor />
            </ChartCanvas>
        );
    }
}

export default fitDimensions(ChartComponent);
