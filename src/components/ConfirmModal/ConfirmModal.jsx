import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { MODAL } from '../../utils/constants';
import PropTypes from 'prop-types';
import './ConfirmModal.css';

const { Text } = Typography;

const ConfirmModal = ({ title=MODAL.CONFIRM.TITLE, message, message2="", onSave, onCancel, className="" }) => {
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

ConfirmModal.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    message2: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    className: PropTypes.string
};
