import React from 'react';
import './ConfirmModal.css';
import { Modal, Button, Typography } from 'antd';

const { Text } = Typography;

const ConfirmModal = ({ title="Confirmation", message, message2="", onSave, onCancel, className="" }) => {
    return (
        <Modal
            title={<Text >{title}</Text>}
            open={true}
            onCancel={onCancel}
            footer={
                <>
                    <Button key="cancel" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button key="save" type="primary" onClick={onSave}>
                        Confirmer
                    </Button>
                    </>
            }
            centered
            className={className}
        >
            <p>{message} {message2 && <><br />{message2}</>}</p>
        </Modal>
    )
}

export default ConfirmModal;