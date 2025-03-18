import React, { useState, useEffect, useContext } from 'react';
import { Button, Select, Card, Space } from 'antd';
import { LogoutOutlined, KeyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { updateRole } from '../../api/userService';
import { updateCompetitions, updateMatches } from '../../api/competitionService';
import { GlobalContext } from '../../App';
import { LOADER, MESSAGES, CONSOLE, MODAL, BUTTON, ADMIN } from '../../utils/constants';
import AdminConnectionModal from './Modals/AdminConnectionModal/AdminConnectionModal';
import ChangePasswordModal from './Modals/ChangePasswordModal/ChangePasswordModal';
import UsersModal from './Modals/UsersModal/UsersModal';
import TokenModal from './Modals/TokenModal/TokenModal';
import TransparentLoader from '../Loader/TransparentLoader';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import PropTypes from 'prop-types';

const { Option } = Select;

const UserData = ({ userName, userId, role, setRole, handleLogout, profils }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage, setGlobalLoadingMessage } = useContext(GlobalContext);
    
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
            if (!response.token) throw new Error(CONSOLE.CONNECTION);
            
            setRole(newRole);
            localStorage.setItem('token', response.token);
            setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.ROLE);
        } catch (error) {
            console.error(error);
            setGlobalErrorMessage(MESSAGES.ERROR.UPDATE.ROLE);
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
        setGlobalLoadingMessage(LOADER.COMPETITIONS);
        try {
            await updateCompetitions();
            setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.COMPETITIONS);
        } catch (error) {
            setGlobalErrorMessage(MESSAGES.ERROR.UPDATE.COMPETITIONS);
        }
    }

    const handleUpdateMatches = async () => {
        setGlobalLoadingMessage(LOADER.MATCHES);
        try {
            await updateMatches();
            setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.MATCHES);
        } catch (error) {
            setGlobalErrorMessage(MESSAGES.ERROR.UPDATE.MATCHES);
        }
    }
    
    return (
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
            {BUTTON.CHANGE_PASSWORD}
        </Button>
        <Button icon={<LogoutOutlined />} danger onClick={askLogout}>
            {BUTTON.DISCONNECTION}
        </Button>
        </Space>
        </Card>
        
        {/* Section des actions administrateur */}
        {role === ADMIN && (
            <Card className="admin-actions-section">
            <Space>
            <Button icon={<SyncOutlined />} onClick={handleUpdateCompetitions}>
            {BUTTON.UPDATE_COMPETITIONS}
            </Button>
            <Button icon={<SyncOutlined />} onClick={handleUpdateMatches}>
            {BUTTON.UPDATE_MATCHES}
            </Button>
            </Space>
            </Card>
        )}

        {role === ADMIN && (
            <Card className="admin-actions-section">
            <Space>
            <Button icon={<UserOutlined  />} onClick={() => setShowUsersModal(true)}>
            {BUTTON.MANAGE_USERS}
            </Button>
            <Button icon={<KeyOutlined  />} onClick={() => setShowTokenModal(true)}>
            {BUTTON.CHANGE_TOKEN}
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
            <ConfirmModal
                title={MODAL.CONFIRM.DISCONNECTION_TITLE}
                message={MODAL.CONFIRM.DISCONNECTION}
                onSave={confirmLogout}
                onCancel={() => setShowConfirm(false)}
                className="not-center-modal"
            />
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
        {isLoading && <TransparentLoader message={LOADER.ROLE} />}
        </div>
    );
};

export default UserData;

UserData.propTypes = {
    userName: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    role: PropTypes.number.isRequired,
    setRole: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
    profils: PropTypes.array.isRequired
};
