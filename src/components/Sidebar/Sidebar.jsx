import React from 'react';
import './Sidebar.css';

const Sidebar = ({ setActiveComponent, role }) => {

    const isAdmin = () => {
        return role === 2;
    }

    const isStaff = () => {
        return role === 1;
    }

    const isStaffOrAdmin = () => {
        return isStaff() || isAdmin();
    }

    return (
        <div className="side-menu">
            <button onClick={() => setActiveComponent('profil')}>
                <i className="bi bi-person"></i>
            </button>
            <button className="hidden"></button>
            <button className="hidden"></button>
            <button onClick={() => setActiveComponent('home')}>
                <i className="bi bi-house"></i>
            </button>
            <button onClick={() => setActiveComponent('calendar')} 
                disabled={!isAdmin()}
                title={!isAdmin() ? "Seuls les administrateurs ont accès à cet onglet" : ""}
            >
                <i className="bi bi-calendar-event"></i>
            </button>
            <button onClick={() => setActiveComponent('availability')}
                disabled={!isStaffOrAdmin()}
                title={!isStaffOrAdmin() ? "Seuls les membres du staff ont accès à cet onglet" : ""}
            >
                <i className="bi bi-person-lines-fill"></i>
            </button>
            <button onClick={() => setActiveComponent('players')}
                disabled={!isStaffOrAdmin()}
                title={!isStaffOrAdmin() ? "Seuls les membres du staff ont accès à cet onglet" : ""}
            >
                <i className="bi bi-people"></i>
            </button>
            <button onClick={() => setActiveComponent('account')}
                disabled={!isAdmin()}
                title={!isAdmin() ? "Seuls les administrateurs ont accès à cet onglet" : ""}
            >
                <i className="bi bi-currency-euro"></i>
            </button>
            <button onClick={() => setActiveComponent('settings')}
                disabled={!isAdmin()}
                title={!isAdmin() ? "Seuls les administrateurs ont accès à cet onglet" : ""}
            >
                <i className="bi bi-gear"></i>
            </button>
            <button className="hidden"></button>
            <button className="hidden"></button>
        </div>
    );
};

export default Sidebar;