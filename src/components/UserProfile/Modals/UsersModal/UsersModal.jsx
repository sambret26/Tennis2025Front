import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Select, Button, Modal } from 'antd';
import { getUsers, updateUsers } from '../../../../api/userService';
import { GlobalContext } from '../../../../App';
import Loader from '../../../../components/Loader/Loader';
import './UsersModal.css';

const { Option } = Select;

const UsersModal = ({ profils, onClose }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage } = useContext(GlobalContext);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modifiedRoles, setModifiedRoles] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getUsers();
                setUsers(response);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
                setGlobalErrorMessage("Une erreur est survenue lors de la récupération des utilisateurs.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [setGlobalErrorMessage]);

    const handleRoleChange = (userId, newRole) => {
        setUsers((prev) => {
            const updatedUsers = [...prev];
            const user = updatedUsers.find((user) => user.id === userId);
            if (user) {
                user.profileValue = newRole;
            }
            return updatedUsers;
        });
        setModifiedRoles((prev) => ({
            ...prev,
            [userId]: newRole,
        }));
    };

    const handleSave = useCallback(async () => {
        if (Object.keys(modifiedRoles).length === 0) {
            onClose();
            return;
        }
        setLoading(true);
        try {
            await updateUsers(modifiedRoles);
            setGlobalSuccessMessage("Les rôles ont été mis à jour avec succès !");
            onClose();
        } catch (error) {
            console.error("Erreur lors de la mise à jour des rôles :", error);
            setGlobalErrorMessage("Une erreur est survenue lors de la mise à jour des rôles.");
        } finally {
            setLoading(false);
        }
    }, [modifiedRoles, onClose, setGlobalSuccessMessage, setGlobalErrorMessage]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleSave]);

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Rôle',
            dataIndex: 'role',
            key: 'role',
            render: (role, record) => (
                <Select
                    value={record.profileValue}
                    onChange={(value) => handleRoleChange(record.id, value)}
                >
                    {profils.map((profil) => (
                        <Option key={profil.id} value={parseInt(profil.value)}>
                            {profil.label}
                        </Option>
                    ))}
                </Select>
            ),
        },
    ];

    const getUsersTable = () => {
        if (loading) return <Loader message="Chargement des utilisateurs..." global={false} />;
        return (
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
                locale={{ emptyText: 'Aucun utilisateur recensé' }}
            />
        );
    };

    return (
        <Modal
            className="user-management-modal"
            title="Gestion des utilisateurs"
            open={true}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Annuler
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    onClick={handleSave}
                    loading={loading}
                >
                    Sauvegarder
                </Button>,
            ]}
            width={800}
        >
            {getUsersTable()}
        </Modal>
    );
};

export default UsersModal;