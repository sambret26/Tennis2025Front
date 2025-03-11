import React, { useState, useEffect, useContext } from 'react';
import { Button, Select, Modal, Card, Space } from 'antd';
import { LogoutOutlined, KeyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { updateRole } from '../../api/userService';
import { updateCompetitions, updateMatches } from '../../api/competitionService';
import { GlobalContext } from '../../App';
import AdminConnectionModal from './Modals/AdminConnectionModal/AdminConnectionModal';
import ChangePasswordModal from './Modals/ChangePasswordModal/ChangePasswordModal';
import UsersModal from './Modals/UsersModal/UsersModal';
import TokenModal from './Modals/TokenModal/TokenModal';
import TransparentLoader from '../Loader/TransparentLoader';

const { Option } = Select;

const UserData = ({ userName, userId, role, setRole, handleLogout, profils }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage } = useContext(GlobalContext);
    
    const [newRole, setNewRole] = useState(role);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [showTokenModal, setShowTokenModal] = useState(false);

    const changeRole = async (newRole) => {
        setNewRole(newRole);
        if (role === newRole) return;
        
        try {
            setIsLoading(true);
            const response = await updateRole(userId, newRole);
            if (response === 403) {
                setShowAdminModal(true);
                return;
            }
            if (!response.token) throw new Error('Failed to connect user');
            
            setRole(newRole);
            localStorage.setItem('token', response.token);
            setGlobalSuccessMessage("Le rôle a bien été modifié.");
        } catch (error) {
            console.error(error);
            setGlobalErrorMessage("Une erreur est survenue lors de la modification du rôle.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const askLogout = () => setShowConfirm(true);
    const confirmLogout = () => {
        handleLogout();
        setShowConfirm(false);
    };
    
    const handleChangePassword = () => {
        setShowChangePasswordModal(true);
    };
    
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape' && showConfirm) {
                event.preventDefault();
                setShowConfirm(false);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showConfirm]);

    const handleUpdateCompetitions = async () => {
        try {
            await updateCompetitions();
            setGlobalSuccessMessage("La liste des compétitions a bien été mise à jour.");
        } catch (error) {
            setGlobalErrorMessage("Une erreur est survenue lors de la mise à jour de la liste des compétitions.");
        }
    }

    const handleUpdateMatches = async () => {
        try {
            await updateMatches();
            setGlobalSuccessMessage("Les matchs ont bien été mis à jour.");
        } catch (error) {
            setGlobalErrorMessage("Une erreur est survenue lors de la mise à jour des matchs.");
        }
    }
    
    return (
        <>
        <div className="user-profile-container">
        {/* En-tête */}
        <Card className="user-profile-header">
        <h1>Bienvenue, {userName}</h1>
        </Card>
        
        {/* Section des rôles */}
        <Card className="user-profile-role-section custom-cards">
        <h4>Votre rôle :</h4>
        <Space>
        <Select
        className="custom-select"
        value={role} // Utilise directement la valeur de `role`
        onChange={(value) => changeRole(value)} // Passe la valeur (ID) lors du changement
        >
        {profils.map((profil) => (
            <Option key={profil.id} value={parseInt(profil.value)}>
            {profil.label} {/* Affiche le label dans la liste déroulante */}
            </Option>
        ))}
        </Select>
        <Button icon={<KeyOutlined />} onClick={handleChangePassword}>
        Changer le mot de passe
        </Button>
        <Button icon={<LogoutOutlined />} danger onClick={askLogout}>
        Déconnexion
        </Button>
        </Space>
        </Card>
        
        {/* Section des actions administrateur */}
        {role === 2 && (
            <Card className="admin-actions-section">
            <Space>
            <Button icon={<SyncOutlined />} onClick={handleUpdateCompetitions}>
            Mettre à jour la liste des compétitions
            </Button>
            <Button icon={<SyncOutlined />} onClick={handleUpdateMatches}>
            Mettre à jour les matchs
            </Button>
            </Space>
            </Card>
        )}

        {role === 2 && (
            <Card className="admin-actions-section">
            <Space>
            <Button icon={<UserOutlined  />} onClick={() => setShowUsersModal(true)}>
            Gérer les utilisateurs
            </Button>
            <Button icon={<KeyOutlined  />} onClick={() => setShowTokenModal(true)}>
            Changer le token de connexion
            </Button>
            </Space>
            </Card>
        )}
        
        {/* Modales */}
        {showAdminModal && (
            <AdminConnectionModal
            role={newRole}
            setRole={setRole}
            onClose={() => setShowAdminModal(false)}
            userId={userId}
            />
        )}

        {showConfirm && (
            <Modal
            title="Confirmation de déconnexion"
            open={showConfirm}
            onOk={confirmLogout}
            onCancel={() => setShowConfirm(false)}
            okText="Confirmer"
            cancelText="Annuler"
            className="confirm-modal"
            >
            <p>Voulez-vous vraiment vous déconnecter ?</p>
            </Modal>
        )}
        
        {showChangePasswordModal && (
            <ChangePasswordModal
            onClose={() => setShowChangePasswordModal(false)}
            userId={userId}
            />
        )}

        {showUsersModal && (
            <UsersModal
            profils={profils}
            onClose={() => setShowUsersModal(false)}
            />
        )}

        {showTokenModal && (
            <TokenModal
            onClose={() => setShowTokenModal(false)}
            />
        )}
        
        {/* Loader */}
        {isLoading && <TransparentLoader message="Sauvegarde du rôle..." />}
        </div>
        </>
    );
};

export default UserData;