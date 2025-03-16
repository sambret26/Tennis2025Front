import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getTransactions, updateTransactions } from '../../../api/transactionService';
import { GlobalContext } from '../../../App';
import { getLocaleDate } from '../../../utils/dateUtils';
import { DATA, MESSAGES, CONSOLE, MODAL, LOADER, BUTTON } from '../../../utils/constants';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import PropTypes from 'prop-types';
import './TransactionManagementModal.css';

const TransactionManagementModal = ({ onClose, onChange, setIsTransparentLoaderVisible }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage } = useContext(GlobalContext);

    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({ type: 0, date: getLocaleDate(new Date()), amount: '' });
    const [hasChanges, setHasChanges] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const loadTransactions = async () => {
            try {
                const data = await getTransactions();
                setTransactions(data);
            } catch (error) {
                setGlobalErrorMessage(MESSAGES.ERROR.GET.TRANSACTION);
                console.error(CONSOLE.FETCH.TRANSACTION, error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTransactions();
    }, [setGlobalErrorMessage]); 
    
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
        setNewTransaction({ date: getLocaleDate(new Date()), amount: '' });
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            onClose();
            if(hasChanges) {
                setIsTransparentLoaderVisible(true);
                await updateTransactions(transactions);
                setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.TRANSACTION);
            }
        } catch (error) {
            console.error(CONSOLE.UPDATE.TRANSACTION, error);
            setGlobalErrorMessage(MESSAGES.ERROR.UPDATE.TRANSACTION);
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
                <th className="transaction-th" colSpan={4}>{DATA.NO_TRANSACTION}</th>
            </tr>
        )
    }

    const transactionSection = () => {

        if (isLoading) {
            return (
                <div className="transaction-summary">
                    <div>{LOADER.TRANSACTION}</div>
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
                        <tr key={transaction}>
                            <td className="transaction-td">{transaction.type === 1 ? DATA.DEPOSIT : DATA.WITHDRAWAL}</td>
                            <td className="transaction-td">{formatDate(transaction.date)}</td>
                            <td className="transaction-td">{transaction.amount}€</td>
                            <td className="transaction-td">
                                <button className="white-button" onClick={() => handleDeleteTransaction(index)}>{BUTTON.DELETE}</button>
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
                                className="blue-button"
                                onClick={handleAddTransaction}
                                disabled={!newTransaction.amount}
                            >
                                {BUTTON.ADD}
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
                <button className="white-button" onClick={handleClose}>{BUTTON.CLOSE}</button>
                <button className="blue-button" onClick={handleSave} >{BUTTON.VALIDATE}</button>
            </div>
        )
    }

    return (
        <div className="transaction-modal">
            <div className="transaction-content">
                <div className="transaction-header">
                    <h2 className="transaction-title">{DATA.MANAGEMENT}</h2>
                    <button className="close-button" onClick={handleClose}>✖</button>
                </div>
                {transactionSection()}
                {footerSection()}
            </div>
            {showConfirmation && (
                <ConfirmModal
                    message={MODAL.CONFIRM.CLOSE_1}
                    message2={MODAL.CONFIRM.CLOSE_2}
                    onSave={handleConfirmClose}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
};

export default TransactionManagementModal;

TransactionManagementModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    setIsTransparentLoaderVisible: PropTypes.func.isRequired
};
