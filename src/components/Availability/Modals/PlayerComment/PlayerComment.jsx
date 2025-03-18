import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { createOrUpdateComment } from '../../../../api/playerAvailabilityCommentService';
import { GlobalContext } from '../../../../App';
import { MESSAGES, CONSOLE, DATA, ADMIN } from '../../../../utils/constants';
import PropTypes from 'prop-types';
import './PlayerComment.css';

const { TextArea } = Input;
const { Text } = Typography;

const PlayerComment = ({ player, day, comment, onCommentChange, isModalOpen, isLoading, setSelectedPlayerId }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage, role } = useContext(GlobalContext);
    
    const [commentText, setCommentText] = useState(comment?.comments || '');
    const hasComment = comment?.comments && comment.comments.trim() !== '';

    const handleCancel = useCallback(() => {
        setCommentText(comment?.comments || '');
        setSelectedPlayerId(null);
    }, [comment?.comments, setSelectedPlayerId]);

    const handleSave = useCallback(async () => {
        try {
            setSelectedPlayerId(null);
            await createOrUpdateComment({
                playerId: player.id,
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
    }, [player, day, commentText, onCommentChange, setSelectedPlayerId, setGlobalSuccessMessage, setGlobalErrorMessage]);

    useEffect(() => {
        setCommentText(comment?.comments || '');
    }, [comment]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleCancel();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleCancel, handleSave]);

    const getFormattedDay = () => {
        try {
            const data = day.split('-');
            return `${data[2]}/${data[1]}`;
        } catch (error) {
            console.error(CONSOLE.FORMAT_DAY, error);
            return '';
        }
    };

    const getClassName = () => {
        if (isLoading) return 'message-icon not-a-button';
        return `message-icon not-a-button ${hasComment ? 'has-comment' : ''}`;
    };

    const getValue = () => {
        if (isLoading) return '';
        return hasComment ? '💬' : '✉️';
    };

    return (
        <>
            <button
                className={getClassName()}
                onClick={() => setSelectedPlayerId(player.id)}
                title={hasComment ? DATA.PLAYER_COMMENT_UPDATE : DATA.PLAYER_COMMENT_ADD}
            >
                {getValue()}
            </button>

            <Modal
                title={<Text >Message pour {player.fullName} le {getFormattedDay()}</Text>}
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
    player: PropTypes.object.isRequired,
    day: PropTypes.string.isRequired,
    comment: PropTypes.object,
    onCommentChange: PropTypes.func,
    isModalOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setSelectedPlayerId: PropTypes.func.isRequired
};