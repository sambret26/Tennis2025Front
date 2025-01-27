import React, { useState, useEffect, useCallback } from 'react';
import './PaymentDetail.css';
import { updatePlayerReductions } from '../../api/reductionService';
import { updatePlayerPayments } from '../../api/paymentsService';

const PaymentDetail = ({ player, onClose, onSave, globalReductions }) => {
    const [initialAmount, setInitialAmount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [reductions, setReductions] = useState([]);
    const [payments, setPayments] = useState([]);
    const [newReduction, setNewReduction] = useState({ reason: '', amount: '' });
    const [newPayment, setNewPayment] = useState({ amount: '', date: new Date().toISOString().split('T')[0] });
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

    const handleDeleteReduction = (index) => {
        const deletedReduction = reductions[index];
        const updatedReductions = reductions.filter((_, i) => i !== index);
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
        const newPaymentEntry = {
            amount: amount,
            date: newPayment.date,
            isFullPayment: 0
        }

        const updatedPayments = [...payments, newPaymentEntry];

        updatedPayments.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (isFullPayment) {
            updatedPayments[updatedPayments.length - 1].isFullPayment = true;
        }

        setPayments(updatedPayments);

        // Réinitialiser le champ de paiement
        setNewPayment({ amount: '', date: new Date().toISOString().split('T')[0] });

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

    const handleClose = () => {
        if (hasReductionsChanges || hasPaymentsChanges) {
            setShowConfirmation(true);
        } else {
            onClose();
        }
    };

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
            onClose();
            onSave(); 
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
                            <tr>
                                <th>Type</th>
                                <th>Montant</th>
                                <th>Date de paiement</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td>{payment.isFullPayment ? 'Paiement final' : 'Paiement partiel'}</td>
                                    <td>{payment.amount}€</td>
                                    <td>{formatDate(payment.date)}</td>
                                    <td>
                                        <button className="red-button" onClick={() => handleDeletePayment(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>Nouveau paiement</td>
                                <td>
                                    <input
                                        type="number"
                                        value={newPayment.amount}
                                        onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                                        placeholder="Montant"
                                        style={{ textAlign: 'center' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={newPayment.date}
                                        onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
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
                                        />
                                        <label className="reduction-label">{globalReduction.reason}</label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <table className="reduction-table">
                        <thead>
                            <tr>
                                <th>Motif</th>
                                <th>Montant de la réduction</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reductions
                                .filter(reduction => reduction.default === 0)
                                .map((reduction, index) => (
                                <tr key={index}>
                                    <td>{reduction.reason}</td>
                                    <td>{reduction.amount}€</td>
                                    <td>
                                        <button  className="red-button" onClick={() => handleDeleteReduction(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={newReduction.reason}
                                        onChange={(e) => setNewReduction({ ...newReduction, reason: e.target.value })}
                                        style={{ textAlign: 'center', width: '200px', height: '40px', margin: '5px 0' }}
                                        placeholder="Motif de la réduction"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={newReduction.amount}
                                        onChange={(e) => setNewReduction({ ...newReduction, amount: e.target.value })}
                                        style={{ textAlign: 'center', width: '200px', height: '40px', margin: '5px 0' }}
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
                        </tbody>
                    </table>
                </div>

                <div className="modal-footer">
                    <button className="green-button" onClick={handleSave} disabled={isSaving}>Valider</button>
                    <button className="red-button" onClick={handleClose}>Fermer</button>
                </div>
            </div>

            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <h3>Confirmation</h3>
                        <p>Êtes-vous sûr de vouloir fermer ? Toutes les modifications non enregistrées seront perdues.</p>
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
