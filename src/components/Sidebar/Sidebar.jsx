import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Importez Link
import { GlobalContext } from '../../App';
import { DATA, ADMIN } from '../../utils/constants';
import PropTypes from 'prop-types';
import './Sidebar.css';

const Sidebar = ({ error, settingError }) => {
    const { role } = useContext(GlobalContext);
        
    const isAdmin = () => role === ADMIN;
        
    //const isStaff = () => role === STAFF;
        
    //const isStaffOrAdmin = () => isStaff() || isAdmin();
        
    const isNotAdmin = () => !isAdmin() || error || settingError;

    const isNotAdminSettings = () => !isAdmin() || (error && !settingError);
        
    //const isNotStaffOrAdmin = () => !isStaffOrAdmin() || error || settingError;
        
    const getAdminTitle = () => {
        if (isAdmin() || error) return '';
        return DATA.ADMIN_ONLY;
    };
        
    // const getStaffTitle = () => {
    //     if (isStaffOrAdmin() || error) return '';
    //     return DATA.STAFF_ONLY;
    // };
        
    return (
        <div className="side-menu">
        {/* Bouton Profil */}
        <Link to="/profil">
        <button disabled={error}>
        <i className="bi bi-person"></i>
        </button>
        </Link>
        
        {/* Boutons cachés pour l'espacement */}
        <button className="hidden"></button>
        <button className="hidden"></button>
        
        {/* Bouton Accueil */}
        <Link to="/home">
        <button disabled={error || settingError}>
        <i className="bi bi-house"></i>
        </button>
        </Link>
        
        {/* Bouton Calendrier (Admin uniquement) */}
        <Link to="/calendar">
        <button disabled={isNotAdmin()} title={getAdminTitle()}>
        <i className="bi bi-calendar-event"></i>
        </button>
        </Link>
        
        {/* Bouton Disponibilités (Admin uniquement) */}
        <Link to="/availability">
        <button disabled={isNotAdmin()} title={getAdminTitle()}>
        <i className="bi bi-person-lines-fill"></i>
        </button>
        </Link>
        
        {/* Bouton Joueurs (Admin uniquement) */}
        <Link to="/players">
        <button disabled={isNotAdmin()} title={getAdminTitle()}>
        <i className="bi bi-people"></i>
        </button>
        </Link>
        
        {/* Bouton Compte (Admin uniquement) */}
        <Link to="/account">
        <button disabled={isNotAdmin()} title={getAdminTitle()}>
        <i className="bi bi-currency-euro"></i>
        </button>
        </Link>
        
        {/* Bouton Paramètres (Admin uniquement) */}
        <Link to="/settings">
        <button disabled={isNotAdminSettings()} title={getAdminTitle()}>
        <i className="bi bi-gear"></i>
        </button>
        </Link>
        
        {/* Boutons cachés pour l'espacement */}
        <button className="hidden"></button>
        <button className="hidden"></button>
        </div>
    );
};

export default Sidebar;

Sidebar.propTypes = {
    error: PropTypes.bool.isRequired,
    settingError: PropTypes.bool.isRequired
};