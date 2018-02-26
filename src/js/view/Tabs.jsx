import React from 'react';

function Tab({ id, name, onClick, selected }) {
    const className = selected ? 'Tab Tab--selected' : 'Tab';

    return (
        <div className={className} onClick={onClick}>
            <span className="Tab-name">
                { name }
            </span>
        </div>
    );
}

function getTabMapper({ getOnTabClick, selectedTab }) {
    return pair => (
        <Tab
            key={pair}
            name={pair}
            onClick={getOnTabClick(pair)}
            selected={selectedTab === pair}
        />
    );
}

function Tabs({ pairs, selectedTab, getOnTabClick }) {
    return (
        <div className="Tabs">
            { pairs.map(getTabMapper({ getOnTabClick, selectedTab })) }
        </div>
    );
}

export default Tabs;
