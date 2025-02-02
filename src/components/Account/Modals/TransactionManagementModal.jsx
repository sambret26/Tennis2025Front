import React, { useState, useEffect, useCallback } from 'react';
import { getTransactions, updateTransactions } from '../../../api/transactionService';
import './TransactionManagementModal.css';

const TransactionManagementModal = ({ onClose, onChange }) => {
    // Exemple de données de retraits/dépots
    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({ type: 0, date: new Date().toISOString().split('T')[0], amount: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {

        const loadTransactions = async () => {
            try {
                const data = await getTransactions();
                setTransactions(data);
            } catch (error) {
                console.error("Error loading transactions:", error);
            }
        };

        loadTransactions();
    }, []); 
    
    const handleClose = useCallback(() => {
        if (hasChanges) {
            setShowConfirmation(true);
        } else {
            onClose();
        }
    }, [hasChanges, onClose]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleClose]);

    const handleDeleteTransaction = (index) => {
        const newTransactions = [...transactions];
        newTransactions.splice(index, 1);
        setTransactions(newTransactions);
        setHasChanges(true);
    };

    const handleAddTransaction = () => {
        if (!newTransaction.amount) return;

        const amount = parseFloat(newTransaction.amount);
        const newTransactionEntry = {
            type: newTransaction.type,
            date: newTransaction.date,
            amount: amount
        }
        const updateTransactions = [...transactions, newTransactionEntry]
            .sort((a,b) => new Date(a.date) - new Date(b.date));
        setTransactions(updateTransactions);
        setNewTransaction({ date: new Date().toISOString().split('T')[0], amount: '' });
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            if(hasChanges) {
                await updateTransactions(transactions);
            }
            onClose(); //TODO : Loader
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsSaving(false);
            onChange(); //TODO : Loader
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmation(false);
        onClose();
    };

    return (
        <div className="transaction-modal">
            <div className="transaction-content">
                <div className="transaction-header">
                    <h2 className="transaction-title">Gestion des dépôts/retraits</h2>
                    <button className="close-button-transaction" onClick={handleClose}>✖</button>
                </div>
                
                <div className="transaction-section">
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th className="transaction-th">Type</th>
                                <th className="transaction-th">Date</th>
                                <th className="transaction-th">Montant</th>
                                <th className="transaction-th"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="transaction-td">{transaction.type === 1 ? 'Depot' : 'Retrait'}</td>
                                    <td className="transaction-td">{transaction.date}</td>
                                    <td className="transaction-td">{transaction.amount}€</td>
                                    <td className="transaction-td">
                                        <button className="transaction-red-button" onClick={() => handleDeleteTransaction(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td className="transaction-td"> 
                                    <select
                                        value={newTransaction.type}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                                    >
                                        <option value="0">Retrait</option>
                                        <option value="1">Depot</option>
                                    </select>
                                </td>
                                <td className="transaction-td">
                                    <input
                                        type="date"
                                        value={newTransaction.date}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                    />
                                </td>
                                <td className="transaction-td">
                                    <input
                                        type="number"
                                        value={newTransaction.amount}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                        placeholder="Montant"
                                    />
                                </td>
                                <td className="transaction-td">
                                    <button 
                                        className="transaction-green-button" 
                                        onClick={handleAddTransaction}
                                        disabled={!newTransaction.amount}
                                    >
                                        Ajouter
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="transaction-footer">
                    <button className="transaction-green-button" onClick={handleSave} disabled={isSaving}>Valider</button>
                    <button className="transaction-red-button" onClick={handleClose}>Fermer</button>
                </div>
            </div>

            {showConfirmation && (
                <div className="transaction-confirmation">
                    <div className="transaction-confirmation-content">
                        <h3>Confirmation</h3>
                        <p>Êtes-vous sûr de vouloir fermer ? <br></br>Toutes les modifications seront perdues.</p>
                        <div className="transaction-confirmation-buttons">
                            <button className="transaction-green-button" onClick={handleConfirmClose}>Confirmer</button>
                            <button className="transaction-red-button" onClick={() => setShowConfirmation(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionManagementModal;