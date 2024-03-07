import * as React from 'react';

function Dropdown({ dropdownVisible }){
    return (
        <div hidden={dropdownVisible} >
            <select className='options'>
                <option>light</option>
                <option>dark</option>
            </select>
        </div>
    );
};

export default Dropdown;