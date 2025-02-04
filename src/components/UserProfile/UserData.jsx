import React, { useState, useEffect } from 'react';
import { updateRole } from '../../api/userService';
import AdminConnectionModal from './Modals/AdminConnectionModal/AdminConnectionModal';
import TransparentLoader from '../Loader/TransparentLoader';

const UserData = ({ userName, userId, role, setRole, handleLogout, profils }) => {

    const [showModal, setShowModal] = useState(false);
    const [newRole, setNewRole] = useState(role);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const changeRole = async (newRole) => {
        setNewRole(newRole);
        if(role === newRole) {
            return;
        }
        try {
            setIsLoading(true);
            const response = await updateRole(userId, newRole);
            if(response === 403) {
                setShowModal(true);
                return;
            }
            if(!response.token) {
                throw new Error('Failed to connect user');
            }
            setRole(newRole);
            localStorage.setItem('token', response.token);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const askLogout = () => {
        setShowConfirm(true);
    };

    const confirmLogout = () => {
        handleLogout();
        setShowConfirm(false);
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                if(showConfirm) {
                    setShowConfirm(false);
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [ showConfirm]);

    return (
        <div>
            <h1 className='user-profile-title'>Bienvenue, {userName}</h1>
            <div className='user-profile-role'>
                <h4>Votre rôle : </h4>
                <select value={role} onChange={(e) => changeRole(e.target.value)}>
                    {profils.map((profil) => (
                        <option key={profil.id} value={profil.value} defaultValue={profil.value === role}>
                            {profil.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className='deconnection-button'>
                <button className='deconnection-red-button' onClick={askLogout}>Déconnexion</button>
                {showModal && (
                    <AdminConnectionModal
                        role={newRole}
                        setRole={setRole}
                        onClose={() => setShowModal(false)}
                        userId={userId}
                    />
                )}
            </div>
            {isLoading && <TransparentLoader message="Mise à jour du rôle..." />}
            {showConfirm && (
                <div className="deconnection-confirmation">
                    <div className="deconnection-confirmation-content">
                        <div className="deconnection-confirmation-header">
                            <h3 className="deconnection-confirmation-title">Confirmation</h3>
                            <button className="close-button-deconnection-confirmation" onClick={() => setShowConfirm(false)}>✖</button>
                        </div>
                        <p>Voulez-vous vraiment vous déconnecter ?</p>
                        <div className="deconnection-confirmation-buttons">
                            <button className="deconnection-green-button" onClick={confirmLogout}>Confirmer</button>
                            <button className="deconnection-red-button" onClick={() => setShowConfirm(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserData;