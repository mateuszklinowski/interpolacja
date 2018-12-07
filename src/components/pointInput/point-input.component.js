import React from 'react';
import './styles.css';

export const PointInput = (props) => {

    return (
        <div className="point-wrapper">
            <span className="point-element">(</span>
            <input className="point-input" type="number" placeholder="X" onChange={(e)=>props.onXChange(e.target.value, props.index)}/>
            <span className="point-element">,</span>
            <input className="point-input" type="number" placeholder="Y" onChange={(e)=>props.onYChange(e.target.value, props.index)}/>
            <span className="point-element">)</span>
        </div>

    )
};
