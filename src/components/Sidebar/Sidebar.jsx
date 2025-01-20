import React from 'react';
import './Sidebar.css'; // Assurez-vous d'avoir ce fichier CSS pour le style

const Sidebar = ({ setActiveComponent }) => {
    return (
        <div className="side-menu">
            <button onClick={() => setActiveComponent('home')}>
                <i className="bi bi-house"></i>
            </button>
            <button onClick={() => setActiveComponent('calendar')}>
                <i className="bi bi-calendar-event"></i>
            </button>
            <button onClick={() => setActiveComponent('availability')}>
                <i className="bi bi-person-lines-fill"></i>
            </button>
            <button onClick={() => setActiveComponent('players')}>
                <i className="bi bi-people"></i>
            </button>
            <button onClick={() => setActiveComponent('accounts')}>
                <i className="bi bi-currency-euro"></i>
            </button>
            <button onClick={() => setActiveComponent('settings')}>
                <i className="bi bi-gear"></i>
            </button>
        </div>
    );
};

export default Sidebar;