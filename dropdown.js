import React from 'react';
import './styles.css';

const Dropdown = ({playersList, setPlayer}) => {
    return (
        <div>
            <div className="select-player">
                <button className="dropbtn">Change Player</button>
                <div className='dropdown-content'>
                    {Object.keys(playersList).map((key, ind) => {
                        return <div className='dropdown-list-item' key={ind} onClick={() => setPlayer(key)}>{key}</div>
                    })}
                </div>
            </div>
            
        </div>
        
        
    );
}

export default Dropdown;