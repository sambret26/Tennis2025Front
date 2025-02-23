import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { createOrUpdateComment } from '../../../../api/playerAvailabilityCommentService';
import './PlayerComment.css';

const { TextArea } = Input;
const { Text } = Typography;

const PlayerComment = ({ playerId, day, comment, onCommentChange, playerName, isModalOpen, setIsModalOpen, isLoading, role }) => {
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
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    };

    const getFormattedDay = () => {
        try {
            const data = day.split('-');
            return `${data[2]}/${data[1]}`;
        } catch (error) {
            console.error('Error formatting day:', error);
            return '';
        }
    };

    return (
        <>
            <span
                className={`message-icon ${isLoading ? '' : hasComment ? 'has-comment' : ''}`}
                onClick={() => setIsModalOpen(true)}
                title={hasComment ? 'Voir/modifier le message' : 'Ajouter un message'}
            >
                {isLoading ? '' : hasComment ? '💬' : '✉️'}
            </span>

            <Modal
                title={<Text >Message pour {playerName} le {getFormattedDay()}</Text>}
                visible={isModalOpen}
                onCancel={handleCancel}
                footer={
                    role === 2 ? (
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
                    placeholder="Ajouter un message..."
                    disabled={role !== 2}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                />
            </Modal>
        </>
    );
};

export default PlayerComment;