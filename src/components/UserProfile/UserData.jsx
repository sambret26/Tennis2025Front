import React, { useState, useEffect } from 'react';
import { Button, Select, Modal, Card, Space } from 'antd';
import { LogoutOutlined, KeyOutlined, SyncOutlined } from '@ant-design/icons';
import { updateRole } from '../../api/userService';
import AdminConnectionModal from './Modals/AdminConnectionModal/AdminConnectionModal';
import TransparentLoader from '../Loader/TransparentLoader';

const { Option } = Select;

const profils = [
    { id: 0, label: 'Visiteur', value: 0 },
    { id: 1, label: 'Staff', value: 1 },
    { id: 2, label: 'Admin', value: 2 },
];

const UserData = ({ userName, userId, role, setRole, handleLogout }) => {
    const [showModal, setShowModal] = useState(false);
    const [newRole, setNewRole] = useState(role);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const changeRole = async (newRole) => {
        setNewRole(newRole);
        if (role === newRole) return;

        try {
            setIsLoading(true);
            const response = await updateRole(userId, newRole);
            if (response === 403) {
                setShowModal(true);
                return;
            }
            if (!response.token) throw new Error('Failed to connect user');

            setRole(parseInt(newRole));
            localStorage.setItem('token', response.token);
        } catch (error) {
            console.error(error);
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
                            <Option key={profil.id} value={profil.value}>
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
            {role === 2 && ( // Supposons que le rôle 2 est administrateur
                <Card className="admin-actions-section">
                    <Space>
                        <Button icon={<SyncOutlined />} onClick={() => console.log('Mettre à jour les matchs')}>
                            Mettre à jour les matchs
                        </Button>
                        <Button icon={<SyncOutlined />} onClick={() => console.log('Homologation')}>
                            Mettre à jour l'homologation
                        </Button>
                    </Space>
                </Card>
            )}

            {/* Modales */}
            {showModal && (
                <AdminConnectionModal
                    role={newRole}
                    setRole={setRole}
                    onClose={() => setShowModal(false)}
                    userId={userId}
                />
            )}

            {showConfirm && (
                <Modal
                    title="Confirmation de déconnexion"
                    visible={showConfirm}
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
                <Modal
                    title="Changer le mot de passe"
                    visible={showChangePasswordModal}
                    onOk={() => setShowChangePasswordModal(false)}
                    onCancel={() => setShowChangePasswordModal(false)}
                    okText="Confirmer"
                    cancelText="Annuler"
                    className="change-password-modal"
                >
                    {/* Formulaire de changement de mot de passe ici */}
                    <p>Formulaire de changement de mot de passe...</p>
                </Modal>
            )}

            {/* Loader */}
            {isLoading && <TransparentLoader message="Mise à jour du rôle..." />}
        </div>
    );
};

export default UserData;