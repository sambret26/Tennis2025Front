import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { createOrUpdateComment } from '../../../../api/playerAvailabilityCommentService';
import { GlobalContext } from '../../../../App';
import { MESSAGES, CONSOLE, DATA, ADMIN } from '../../../../utils/constants';
import PropTypes from 'prop-types';
import './PlayerComment.css';

const { TextArea } = Input;
const { Text } = Typography;

const PlayerComment = ({ playerId, day, comment, onCommentChange, playerName, isModalOpen, setIsModalOpen, isLoading }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage, role } = useContext(GlobalContext);
    
    const [commentText, setCommentText] = useState(comment?.comments || '');
    const hasComment = comment?.comments && comment.comments.trim() !== '';

    const handleCancel = useCallback(() => {
        setCommentText(comment?.comments || '');
        setIsModalOpen(false);
    }, [comment?.comments, setIsModalOpen]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleCancel();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleCancel]);

    const handleSave = async () => {
        try {
            setIsModalOpen(false);
            await createOrUpdateComment({
                playerId,
                day,
                comments: commentText.trim(),
            });
            if (onCommentChange) {
                onCommentChange();
            }
            setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.PLAYER_COMMENT);
        } catch (error) {
            console.error(CONSOLE.UPDATE.PLAYERS_COMMENT, error);
            setGlobalErrorMessage(MESSAGES.ERROR.UPDATE.PLAYER_COMMENT);
        }
    };

    const getFormattedDay = () => {
        try {
            const data = day.split('-');
            return `${data[2]}/${data[1]}`;
        } catch (error) {
            console.error(CONSOLE.FORMAT_DAY, error);
            return '';
        }
    };

    return (
        <>
            <span
                className={`message-icon ${isLoading ? '' : hasComment ? 'has-comment' : ''}`}
                onClick={() => setIsModalOpen(true)}
                title={hasComment ? DATA.PLAYER_COMMENT_UPDATE : DATA.PLAYER_COMMENT_ADD}
            >
                {isLoading ? '' : hasComment ? '💬' : '✉️'}
            </span>

            {/*TODO : Passage en confirmationModal (/!\ Sauvegarder et non confirmer)*/}
            <Modal
                title={<Text >Message pour {playerName} le {getFormattedDay()}</Text>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={
                    role === ADMIN ? (
                        <>
                            <Button key="cancel" onClick={handleCancel}>
                                Annuler
                            </Button>
                            <Button key="save" type="primary" onClick={handleSave}>
                                Sauvegarder
                            </Button>
                        </>
                    ) : null
                }
                centered
                className="comment-modal"
            >
                <TextArea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={DATA.PLAYER_COMMENT_ADD2}
                    disabled={role !== ADMIN}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                />
            </Modal>
        </>
    );
};

export default PlayerComment;

PlayerComment.propTypes = {
    playerId: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    comment: PropTypes.object,
    playerName: PropTypes.string.isRequired,
    onCommentChange: PropTypes.func,
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
};