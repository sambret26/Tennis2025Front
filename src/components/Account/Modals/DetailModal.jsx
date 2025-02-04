import React, { useEffect, useState } from 'react';
import { getAccountDataForADay } from '../../../api/accountService';
import './DetailModal.css';

const DetailModal = ({ day, onClose }) => {
    const [payments, setPayments] = useState([]);
    const [amountDayBefore, setAmountDayBefore] = useState(0);
    const [amountDay, setAmountDay] = useState(0);
    const [amountWithdrawn, setAmountWithdrawn] = useState(0);
    const [profit, setProfit] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAccountData = async () => {
            try {
                const data = await getAccountDataForADay(formatDate(day));
                setAmountDayBefore(data.amountDayBefore);
                setAmountWithdrawn(data.withdraws);
                const totalPayments = Array.isArray(data.payments) ? data.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0;
                setProfit(totalPayments);
                setAmountDay(data.amountDayBefore + totalPayments - data.withdraws);
                setPayments(data.payments);
            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAccountData();
    }, [day]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    const formatDate = (dateString) => {
        try {
            const data = dateString.split('/');
            if (data.length !== 3) {
                console.error("Error parsing date :", dateString);
            } 
        return data[2] + '-' + data[1] + '-' + data[0];
        } catch (error) {
            console.error("Error parsing date :", error);
        }
    };

    return (
        <div className="detail-modal">
            <div className="detail-content">
                <div className="detail-header">
                    <h2 className="detail-title">Bilan comptable du {day}</h2>
                    <button className="close-button-detail" onClick={onClose}>✖</button>
                </div>
                {isLoading ? (
                    <div className="detail-summary">
                        <div>Chargement des données du jour...</div>
                    </div>
                ) : (
                    <div className="detail-summary">
                        <span className="flex-row">
                            <p>Montant de la veille : {amountDayBefore}€</p>
                            <p>Montant du soir : {amountDay}€</p>
                        </span>
                        <span className="flex-row">
                            <p>Retraits : {amountWithdrawn}€</p>
                            <p>Bénéfice : {profit}€</p>
                        </span>
                    </div>
                )}
                {!isLoading && (        
                    <div className="detail-payments-section">
                        <h3 className="detail-subtitle">Liste des paiements :</h3>
                        <table className="detail-table">
                            <thead>
                                <tr>
                                    <th className="detail-th">Joueur</th>
                                    <th className="detail-th">Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment, index) => (
                                    <tr key={index}>
                                        <td className="detail-td">{payment.playerFullName}</td>
                                        <td className="detail-td">{payment.amount}€</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailModal;