import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getTransactions, updateTransactions } from '../../../api/transactionService';
import { GlobalContext } from '../../../App';
import './TransactionManagementModal.css';

const TransactionManagementModal = ({ onClose, onChange, setIsTransparentLoaderVisible }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage } = useContext(GlobalContext);

    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({ type: 0, date: new Date().toISOString().split('T')[0], amount: '' });
    const [hasChanges, setHasChanges] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const loadTransactions = async () => {
            try {
                const data = await getTransactions();
                setTransactions(data);
            } catch (error) {
                console.error("Error loading transactions:", error);
            } finally {
                setIsLoading(false);
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
                if(showConfirmation) {
                    setShowConfirmation(false);
                } else {
                    handleClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleClose, showConfirmation]);

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
            onClose();
            if(hasChanges) {
                setIsTransparentLoaderVisible(true);
                await updateTransactions(transactions);
            }
            setGlobalSuccessMessage('Les modifications ont été enregistrées.');
        } catch (error) {
            console.error('Error saving changes:', error);
            setGlobalErrorMessage('Une erreur est survenue lors de l\'enregistrement des modifications.');
        } finally {
            onChange();
            setIsTransparentLoaderVisible(false);
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmation(false);
        onClose();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Obtenir le jour
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtenir le mois (0-11)
        return `${day}/${month}`; // Retourner le format jj/mm
    };

    const headers = () => {
        if(transactions.length > 0) {
            return (
                <tr>
                    <th className="transaction-th">Type</th>
                    <th className="transaction-th">Date</th>
                    <th className="transaction-th">Montant</th>
                    <th className="transaction-th"></th>
                </tr>
            )
        }
        return (
            <tr>
                <th className="transaction-th" colSpan={4}>Aucune transaction</th>
            </tr>
        )
    }

    const transactionSection = () => {

        if (isLoading) {
            return (
                <div className="transaction-summary">
                    <div>Chargement des transactions...</div>
                </div>
            )
        }
        return (
            <div className="transaction-section">
            <table className="transaction-table">
                <thead>
                    {headers()}
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td className="transaction-td">{transaction.type === 1 ? 'Depot' : 'Retrait'}</td>
                            <td className="transaction-td">{formatDate(transaction.date)}</td>
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
        )
    }

    const footerSection = () => {
        if (isLoading) return;
        return (
            <div className="transaction-footer">
                <button className="transaction-green-button" onClick={handleSave} >Valider</button>
                <button className="transaction-red-button" onClick={handleClose}>Fermer</button>
            </div>
        )
    }

    return (
        <div className="transaction-modal">
            <div className="transaction-content">
                <div className="transaction-header">
                    <h2 className="transaction-title">Gestion des dépôts/retraits</h2>
                    <button className="close-button-transaction" onClick={handleClose}>✖</button>
                </div>
                {transactionSection()}
                {footerSection()}
            </div>
            {showConfirmation && (
                <div className="transaction-confirmation">
                    <div className="transaction-confirmation-content">
                        <div className="transaction-confirmation-header">
                            <h3 className="transaction-confirmation-title">Confirmation</h3>
                            <button className="close-button-transaction-confirmation" onClick={() => setShowConfirmation(false)}>✖</button>
                        </div>
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