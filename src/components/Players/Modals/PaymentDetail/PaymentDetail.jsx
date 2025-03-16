import React, { useState, useEffect, useCallback, useContext } from 'react';
import { updatePlayerReductions } from '../../../../api/reductionService';
import { updatePlayerPayments } from '../../../../api/paymentsService';
import { getLocaleDate } from '../../../../utils/dateUtils.js';
import { GlobalContext } from '../../../../App';
import { MODAL, LOADER, MESSAGES, DATA, BUTTON } from '../../../../utils/constants';
import Loader from '../../../Loader/Loader';
import ConfirmModal from '../../../ConfirmModal/ConfirmModal';
import './PaymentDetail.css';

const PaymentDetail = ({ player, onClose, globalReductions, startDate, endDate, defaultDate  }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage, role, ADMIN } = useContext(GlobalContext);
    
    const getDefaultDate = () => {
        return getLocaleDate(new Date(defaultDate))
    }
    
    const [initialAmount, setInitialAmount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [reductions, setReductions] = useState([]);
    const [payments, setPayments] = useState([]);
    const [newReduction, setNewReduction] = useState({ reason: '', amount: '' });
    const [newPayment, setNewPayment] = useState({ amount: '', date: getDefaultDate() });
    const [hasReductionsChanges, setHasReductionsChanges] = useState(false);
    const [hasPaymentsChanges, setHasPaymentsChanges] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showNegativeConfirmation, setShowNegativeConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const updateFinalPayment = useCallback((newRemainingAmount) => {
        if (newRemainingAmount === 0 && payments.length > 0) {
            const lastPaymentIndex = payments.length - 1;
            const updatedPayments = [...payments];
            updatedPayments[lastPaymentIndex].isFullPayment = true;
            setPayments(updatedPayments); 
        }
        if (newRemainingAmount > 0 && payments.length > 0) {
            const lastPaymentIndex = payments.length - 1;
            const updatedPayments = [...payments];
            updatedPayments[lastPaymentIndex].isFullPayment = false;
            setPayments(updatedPayments); 
        }
    }, [payments]);
    
    useEffect(() => {
        setIsLoading(true);
        setInitialAmount(player.balance.initialAmount);
        setFinalAmount(player.balance.finalAmount);
        setRemainingAmount(player.balance.remainingAmount);
        setPayments(player.payments);
        setReductions(player.reductions);
        setHasReductionsChanges(false);
        setHasPaymentsChanges(false);
        setIsLoading(false);
    }, [player]);
    
    const handleAddReduction = () => {
        if (!newReduction.reason || !newReduction.amount) return;
        
        const amount = parseFloat(newReduction.amount);
        
        setReductions([...reductions, {
            ...newReduction,
            amount: amount,
            reason: newReduction.reason,
            default: 0
        }]);
        setNewReduction({ reason: '', amount: '' });
        let newFinalAmount = finalAmount - amount;
        setFinalAmount(newFinalAmount);
        let newRemainingAmount = remainingAmount - amount;
        setRemainingAmount(newRemainingAmount);
        updateFinalPayment(newRemainingAmount)
        setHasReductionsChanges(true);
    };
    
    const handleAddDefaultReduction = (defaultReason, defaultAmount) => {
        if (!defaultReason || !defaultAmount) return;
        
        const amount = parseFloat(defaultAmount);
        
        setReductions([...reductions, {
            reason: defaultReason,
            amount: amount,
            default: 1
        }]);
        let newFinalAmount = finalAmount - amount;
        setFinalAmount(newFinalAmount);
        let newRemainingAmount = remainingAmount - amount;
        setRemainingAmount(newRemainingAmount);
        updateFinalPayment(newRemainingAmount)
        setHasReductionsChanges(true);
    }
    
    const handleDeleteReduction = (reductionToDelete) => {
        const deletedReduction = reductions.find(reduction => reduction === reductionToDelete);
        const updatedReductions = reductions.filter(reduction => reduction !== reductionToDelete);
        setReductions(updatedReductions);
        let newFinalAmount = finalAmount + deletedReduction.amount;
        setFinalAmount(newFinalAmount);
        let newRemainingAmount = remainingAmount + deletedReduction.amount;
        setRemainingAmount(newRemainingAmount);
        updateFinalPayment(newRemainingAmount)
        setHasReductionsChanges(true);
    };
    
    const handleDeleteDefaultReduction = (reductionToDelete) => {
        setReductions((prev) => prev.filter(reduction => reduction.reason !== reductionToDelete.reason));
        let newFinalAmount = finalAmount + reductionToDelete.amount;
        setFinalAmount(newFinalAmount);
        let newRemainingAmount = remainingAmount + reductionToDelete.amount;
        setRemainingAmount(newRemainingAmount);
        updateFinalPayment(newRemainingAmount)
        setHasReductionsChanges(true);
    }
    
    const handleAddPayment = () => {
        if (!newPayment.amount) return;
        
        const amount = parseFloat(newPayment.amount);
        const isFullPayment = amount >= remainingAmount;
        
        const paymentIndex = payments.findIndex(payment => payment.date === newPayment.date);
        const updatedPayments = [...payments];
        if (paymentIndex !== -1) {
            updatedPayments[paymentIndex] = {
                ...updatedPayments[paymentIndex],
                amount: updatedPayments[paymentIndex].amount + amount,
                isFullPayment: 0
            };
        } else {
            const newPaymentEntry = {
                amount: amount,
                date: newPayment.date,
                isFullPayment: 0
            };
            updatedPayments.push(newPaymentEntry);
        }
        
        updatedPayments.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (isFullPayment) {
            updatedPayments[updatedPayments.length - 1].isFullPayment = true;
        }
        
        setPayments(updatedPayments);
        
        // Réinitialiser le champ de paiement
        setNewPayment({ amount: '', date: getDefaultDate() });
        
        // Mettre à jour le montant restant
        let newRemainingAmount = remainingAmount - amount;
        setRemainingAmount(newRemainingAmount);
        setHasPaymentsChanges(true);
    };
    
    const handleDeletePayment = (index) => {
        const deletedPayment = payments[index];
        const updatedPayments = payments.filter((payment, i) => {
            if (i !== index) {
                payment.isFullPayment = false;
                return true;
            }
            return false;
        });
        let newRemainingAmount = remainingAmount + deletedPayment.amount;
        setRemainingAmount(newRemainingAmount);
        
        setPayments(updatedPayments);
        setHasPaymentsChanges(true);
    };
    
    const handleClose = useCallback(() => {
        if (hasReductionsChanges || hasPaymentsChanges) {
            setShowConfirmation(true);
        } else {
            onClose();
        }
    }, [hasReductionsChanges, hasPaymentsChanges, onClose]);
    
    const handleConfirmClose = () => {
        setShowConfirmation(false);
        onClose();
    };

    const handleAskSave = () => {
        if (remainingAmount < 0) {
            setShowNegativeConfirmation(true);
        } else {
            handleSave();
        }
    }
    
    const handleSave = async () => {
        try {
            setIsSaving(true);
            player.balance.initialAmount = initialAmount;
            player.balance.finalAmount = finalAmount;
            player.balance.remainingAmount = remainingAmount;
            const updatePromises = [];
            if(hasReductionsChanges) {
                updatePromises.push(updatePlayerReductions(player.id, reductions, player.balance));
                player.reductions = reductions
            }
            if(hasPaymentsChanges) {
                updatePromises.push(updatePlayerPayments(player.id, payments, player.balance));
                player.payments = payments
            }
            setHasReductionsChanges(false);
            setHasPaymentsChanges(false);
            onClose();
            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
                setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.UPDATE);
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            setGlobalErrorMessage(MESSAGES.ERROR.UPDATE.UPDATE);
        } finally {
            setIsSaving(false);
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Obtenir le jour
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtenir le mois (0-11)
        return `${day}/${month}`; // Retourner le format jj/mm
    };

    const redIfNegative = (value=0) => {
        return remainingAmount-value < 0 ? 'red payment-td' : 'payment-td';
    };
    
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                if(showConfirmation) {
                    setShowConfirmation(false);
                } else if (showNegativeConfirmation) {
                    setShowNegativeConfirmation(false);
                } else {
                    handleClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleClose, showConfirmation, showNegativeConfirmation]);
    
    const paymentHeaders = () => {
        if(payments.length > 0) {
            return (
                <tr>
                    <th>{DATA.PAYMENT}</th>
                    <th>{DATA.DATE_PAYMENT}</th>
                    <th>{DATA.AMOUNT}</th>
                    {(role === ADMIN && <th></th>)}
                </tr>
            )
        }
        return (
            <tr>
                <th colSpan={4}>{DATA.NO_PAYMENT}</th>
            </tr>
        )
    }
    
    const reductionHeaders = () => {
        if(reductions.some(reduction => reduction.default === 0)) {
            return (
                <tr>
                    <th>{DATA.REASON}</th>
                    <th>{DATA.REDUCTION_AMOUNT}</th>
                    {(role === ADMIN && <th></th>)}
                </tr>
            )
        }
        return (
            <tr>
                <th colSpan={3}>{DATA.NO_REDUCTION}</th>
            </tr>
        )
    }
    
    const deletePaymentButton = (index) => {
        if(role !== ADMIN) return;
        return (
            <td>
                <button className="white-button" onClick={() => handleDeletePayment(index)}>{BUTTON.DELETE}</button>
            </td>
        )
    }
    
    const deleteReductionButton = (reduction) => {
        if(role !== ADMIN) return;
        return (
            <td>
                <button  className="white-button" onClick={() => handleDeleteReduction(reduction)}>{BUTTON.DELETE}</button>
            </td>
        )
    }
    
    const newPaymentSection = () => {
        if(role !== ADMIN) return;
        return (
            <tr>
                <td className="payment-td">{DATA.NEW_PAYMENT}</td>
                <td className="payment-td">
                    <input
                        type="date"
                        value={newPayment.date}
                        onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                        min={startDate ? getLocaleDate(startDate) : undefined}
                        max={endDate ? getLocaleDate(endDate) : undefined}
                    />
                </td>
                <td className={redIfNegative(newPayment.amount)}>
                    <input
                        type="number"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                        placeholder="Montant"
                    />
                </td>
                <td className="payment-td">
                    <button
                        className="blue-button"
                        onClick={handleAddPayment}
                        disabled={!newPayment.amount}
                    >
                        {BUTTON.ADD}
                    </button>
                </td>
            </tr>
        )
    }
    
    const newReductionSection = () => {
        if(role !== ADMIN) return;
        return (
            <tr>
                <td>
                    <input
                        type="text"
                        value={newReduction.reason}
                        onChange={(e) => setNewReduction({ ...newReduction, reason: e.target.value })}
                        placeholder={DATA.REDUCTION}
                        className="custom-input"
                />
                </td>
                <td>
                    <input
                        type="number"
                        value={newReduction.amount}
                        onChange={(e) => setNewReduction({ ...newReduction, amount: e.target.value })}
                        className="custom-input"
                        placeholder={DATA.AMOUNT}
                />
                </td>
                <td>
                    <button
                        className="blue-button"
                        onClick={handleAddReduction}
                        disabled={!newReduction.reason || !newReduction.amount}
                    >
                        {BUTTON.ADD}
                    </button>
                </td>
            </tr>
        )
    }
    
    const footerSection = () => {
        if(role !== ADMIN) return;
        return (
            <div className="modal-footer">
                <button className="white-button" onClick={handleClose}>{BUTTON.CANCEL}</button>
                <button className="blue-button" onClick={handleAskSave} disabled={isSaving}>{BUTTON.VALIDATE}</button>
            </div>
        )
    }
    
    const detailSection = () => {
        return (
            <div className="details-section">
                <div className="payment-summary">
                    <div>{DATA.INITIAL_AMOUNT} : {initialAmount}€</div>
                    <div>{DATA.FINAL_AMOUNT} : {finalAmount}€</div>
                    <div className={redIfNegative()}>{DATA.REMAINING_AMOUNT} : {remainingAmount}€</div>
                </div>
                
                <div className="payments-section">
                    <h3 className="section-title">{DATA.PAYMENTS}</h3>
                    <table className="payment-table">
                        <thead>
                            {paymentHeaders()}
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                <td className="payment-td">{payment.isFullPayment ? DATA.PAYMENT_FINAL : DATA.PAYMENT_PARTIAL}</td>
                                <td className="payment-td">{formatDate(payment.date)}</td>
                                <td className="payment-td">{payment.amount}€</td>
                                {deletePaymentButton(index)}
                                </tr>
                            ))}
                            {newPaymentSection()}
                        </tbody>
                    </table>
                </div>
                
                <div className="reductions-section">
                    <h3 className="section-title">Réductions</h3>
                    <div className="reductions-section">
                        <div className="reduction-checkbox-container">
                            {globalReductions.map((globalReduction) => {
                                // Vérifiez si la raison de la réduction globale existe dans les réductions du joueur
                                const isChecked = reductions.some(reduction => reduction.reason === globalReduction.reason);
                                
                                return (
                                    <div key={globalReduction.id}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked} // Définir l'état checked en fonction de la condition
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    handleAddDefaultReduction(globalReduction.reason, globalReduction.amount);
                                                } else {
                                                    handleDeleteDefaultReduction(globalReduction);
                                                }
                                            }}
                                            disabled={role !== ADMIN}
                                        />
                                        <label className="reduction-label">{globalReduction.reason}</label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <table className="reduction-table">
                        <thead>
                            {reductionHeaders()}
                        </thead>
                        <tbody>
                            {reductions
                                .filter(reduction => reduction.default === 0)
                                .map((reduction, index) => (
                                <tr key={index}>
                                    <td>{reduction.reason}</td>
                                    <td>{reduction.amount}€</td>
                                {deleteReductionButton(reduction)}
                                </tr>
                            ))}
                            {newReductionSection()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    if (isLoading) return <Loader message={LOADER.LOADING} global={false} />;

    return (
        <div className="payment-detail-modal">
            <div className="payment-detail-content">
                <div className="payment-detail-header">
                    <h2 className="payment-detail-title">{DATA.PAYMENT_DETAIL} {player.lastName} {player.firstName}</h2>
                    <button className="close-button" onClick={handleClose}>✖</button>
                </div>
                {detailSection()}
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

            {showNegativeConfirmation && (
                <ConfirmModal
                    message={MODAL.CONFIRM.NEGATIVE_1}
                    message2={MODAL.CONFIRM.NEGATIVE_2}
                    onSave={handleConfirmClose}
                    onCancel={() => setShowNegativeConfirmation(false)}
                />
            )}

        </div>
    );
};

export default PaymentDetail;