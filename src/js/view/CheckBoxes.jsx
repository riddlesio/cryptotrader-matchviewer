import React from 'react';

function CheckBox({ label, value, onChange }) {

    return (
        <div className="Checkbox">
            <label>{ label }</label>
            <input
                type="checkbox"
                defaultChecked={value}
                onChange={onChange}
            />
        </div>
    );
}

function CheckBoxes({ checkBoxes, getOnChange }) {
    const leftBoxes = checkBoxes.filter(box => box.align === 'left');
    const rightBoxes = checkBoxes.filter(box => box.align === 'right');

    return (
        <div className="Checkboxes">
            <div className="Checkboxes-left">
                {
                    leftBoxes.map(box =>
                        <CheckBox key={box.name} onChange={getOnChange(box.name)} {...box} />
                    )
                }
            </div>
            <div className="Checkboxes-right">
                {
                    rightBoxes.map(box =>
                        <CheckBox key={box.name} onChange={getOnChange(box.name)} {...box} />
                    )
                }
            </div>
        </div>
    );
}

export default CheckBoxes;
