import React, { useState } from 'react';
import { createOrUpdateComment } from '../../api/playerAvailabilityCommentService';
import './PlayerComment.css';

const PlayerComment = ({ playerId, day, comment, onCommentChange, playerName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentText, setCommentText] = useState(comment?.comments || '');
    const hasComment = comment?.comments && comment.comments.trim() !== '';

    const handleSave = async () => {
        try {
            await createOrUpdateComment({
                playerId,
                day,
                comments: commentText.trim()
            });
            setIsModalOpen(false);
            if (onCommentChange) {
                onCommentChange();
            }
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    };

    const handleCancel = () => {
        setCommentText(comment?.comments || '');
        setIsModalOpen(false);
    };

    return (
        <>
            <span 
                className={`message-icon ${hasComment ? 'has-comment' : ''}`}
                onClick={() => setIsModalOpen(true)}
                title={hasComment ? "Voir/modifier le message" : "Ajouter un message"}
            >
                {hasComment ? '💬' : '✉️'}
            </span>

            {isModalOpen && (
                <div className="comment-modal" onClick={(e) => {
                    if (e.target.className === 'comment-modal') {
                        handleCancel();
                    }
                }}>
                    <div className="comment-modal-content">
                        <div className="comment-modal-header">
                            <h2>Message pour {playerName}</h2>
                            <button 
                                className="comment-modal-close"
                                onClick={handleCancel}
                            >
                                ×
                            </button>
                        </div>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Ajouter un message..."
                            className="comment-textarea"
                        />
                        <div className="comment-modal-footer">
                            <button 
                                onClick={handleSave}
                                className="comment-button save"
                            >
                                Sauvegarder
                            </button>
                            <button 
                                onClick={handleCancel}
                                className="comment-button cancel"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlayerComment;
