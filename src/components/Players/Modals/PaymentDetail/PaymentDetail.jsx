import React, { useState, useEffect, useCallback } from 'react';
import './PaymentDetail.css';
import { updatePlayerReductions } from '../../../../api/reductionService';
import { updatePlayerPayments } from '../../../../api/paymentsService';

const PaymentDetail = ({ player, onClose, globalReductions, startDate, endDate, defaultDate, role }) => {
    const getDefaultDate = () => {
        return new Date(defaultDate).toISOString().split('T')[0]
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
        setInitialAmount(player.balance.initialAmount);
        setFinalAmount(player.balance.finalAmount);
        setRemainingAmount(player.balance.remainingAmount);
        setPayments(player.payments);
        setReductions(player.reductions);
        setHasReductionsChanges(false);
        setHasPaymentsChanges(false);
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
                isFullPayment: isFullPayment ? 1 : 0
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
        let newRemainingAmount = Math.max(0, remainingAmount - amount);
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

    const handleSave = async () => {
        try {
            setIsSaving(true);
            player.balance.initialAmount = initialAmount;
            player.balance.finalAmount = finalAmount;
            player.balance.remainingAmount = remainingAmount;
            onClose();
            if(hasReductionsChanges) {
                await updatePlayerReductions(player.id, reductions, player.balance);
                player.reductions = reductions
            }
            if(hasPaymentsChanges) {
                await updatePlayerPayments(player.id, payments, player.balance);
                player.payments = payments
            }
            player.balance.initialAmount = initialAmount;
            player.balance.finalAmount = finalAmount;
            player.balance.remainingAmount = remainingAmount;
            setHasReductionsChanges(false);
            setHasPaymentsChanges(false);
        } catch (error) {
            console.error('Error saving changes:', error);
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

    const paymentHeaders = () => {
        if(payments.length > 0) {
            return (
                <tr>
                    <th>Type</th>
                    <th>Montant</th>
                    <th>Date de paiement</th>
                    {(role === 2 && <th></th>)}
                </tr>
            )
        }
        return (
            <tr>
                <th colSpan={4}>Aucun paiement</th>
            </tr>
        )
    }

    const reductionHeaders = () => {
        if(reductions.some(reduction => reduction.default === 0)) {
            return (
                <tr>
                    <th>Motif</th>
                    <th>Montant de la réduction</th>
                    {(role === 2 && <th></th>)}
                </tr>
            )
        }
        return (
            <tr>
                <th colSpan={3}>Aucune réduction spécifique</th>
            </tr>
        )
    }

    const deletePaymentButton = (index) => {
        if(role !== 2) return;
        return (
            <td>
                <button className="red-button" onClick={() => handleDeletePayment(index)}>Supprimer</button>
            </td>
        )
    }

    const deleteReductionButton = (reduction) => {
        if(role !== 2) return;
        return (
            <td>
                <button  className="red-button" onClick={() => handleDeleteReduction(reduction)}>Supprimer</button>
            </td>
        )
    }

    const newPaymentSection = () => {
        if(role !== 2) return;
        return (
            <tr>
            <td>Nouveau paiement</td>
            <td>
                <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    placeholder="Montant"
                />
            </td>
            <td>
                <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                    min={startDate ? startDate.toISOString().split('T')[0] : undefined}
                    max={endDate ? endDate.toISOString().split('T')[0] : undefined}
                />
            </td>
            <td>
                <button
                    className="green-button"
                    onClick={handleAddPayment}
                    disabled={!newPayment.amount}
                >
                    Ajouter
                </button>
            </td>
        </tr>
        )
    }

    const newReductionSection = () => {
        if(role !== 2) return;
        return (
            <tr>
            <td>
                <input
                    type="text"
                    value={newReduction.reason}
                    onChange={(e) => setNewReduction({ ...newReduction, reason: e.target.value })}
                    placeholder="Motif de la réduction"
                    className="custom-input"
                />
            </td>
            <td>
                <input
                    type="number"
                    value={newReduction.amount}
                    onChange={(e) => setNewReduction({ ...newReduction, amount: e.target.value })}
                    className="custom-input"
                    placeholder="Montant"
                />
            </td>
            <td>
                <button
                    className="green-button"
                    onClick={handleAddReduction}
                    disabled={!newReduction.reason || !newReduction.amount}
                >
                    Ajouter
                </button>
            </td>
        </tr>
        )
    }

    const footerSection = () => {
        if(role !== 2) return;
        return (
            <div className="modal-footer">
                <button className="green-button" onClick={handleSave} disabled={isSaving}>Valider</button>
                <button className="red-button" onClick={handleClose}>Fermer</button>
            </div>
        )
    }

    return (
        <div className="payment-detail-modal">
            <div className="payment-detail-content">
                <div className="payment-detail-header">
                    <h2 className="payment-detail-title">Détail du paiement de {player.lastName} {player.firstName}</h2>
                    <button className="close-button-payment-detail" onClick={handleClose}>✖</button>
                </div>

                <div className="payment-summary">
                    <div>Montant initial : {initialAmount}€</div>
                    <div>Montant final : {finalAmount}€</div>
                    <div>Montant restant à payer : {remainingAmount}€</div>
                </div>

                <div className="payments-section">
                    <h3 className="section-title">Paiements</h3>
                    <table className="payment-table">
                        <thead>
                            {paymentHeaders()}
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td>{payment.isFullPayment ? 'Paiement final' : 'Paiement partiel'}</td>
                                    <td>{payment.amount}€</td>
                                    <td>{formatDate(payment.date)}</td>
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
                                            disabled={role !== 2}
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
                {footerSection()}
            </div>

            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <div className="confirmation-header">
                            <h3 className="confirmation-title">Confirmation</h3>
                            <button className="close-button-confirmation" onClick={() => setShowConfirmation(false)}>✖</button>
                        </div>
                        <p>Êtes-vous sûr de vouloir fermer ? <br></br>Toutes les modifications seront perdues.</p>
                        <div className="confirmation-buttons">
                            <button className="green-button" onClick={handleConfirmClose}>Confirmer</button>
                            <button className="red-button" onClick={() => setShowConfirmation(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentDetail;
