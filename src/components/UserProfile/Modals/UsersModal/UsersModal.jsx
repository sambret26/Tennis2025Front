import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Select, Button, Modal } from 'antd';
import { getUsers, updateUsers } from '../../../../api/userService';
import { GlobalContext } from '../../../../App';
import { MODAL, CONSOLE, MESSAGES, LOADER, DATA, TABLE } from '../../../../utils/constants';
import Loader from '../../../../components/Loader/Loader';
import PropTypes from 'prop-types';
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
                console.error(CONSOLE.FETCH.USERS, error);
                setGlobalErrorMessage(MESSAGES.ERROR.GET.USERS);
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
            setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.ROLES);
            onClose();
        } catch (error) {
            console.error(CONSOLE.UPDATE.ROLE, error);
            setGlobalErrorMessage(MESSAGES.ERROR.UPDATE.ROLE);
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
            title: TABLE.NAME_TITLE,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: TABLE.ROLE_TITLE,
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
        if (loading) return <Loader message={LOADER.USERS} global={false} />;
        return (
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
                locale={{ emptyText: DATA.NO_USERS }}
            />
        );
    };

    return (
        <Modal
            className="user-management-modal"
            title={MODAL.USERS.TITLE}
            open={true}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {MODAL.USERS.CANCEL_BUTTON}
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    onClick={handleSave}
                    loading={loading}
                >
                    {MODAL.USERS.SAVE_BUTTON}
                </Button>,
            ]}
            width={800}
        >
            {getUsersTable()}
        </Modal>
    );
};

export default UsersModal;

UsersModal.propTypes = {
    profils: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired
};
