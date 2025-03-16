import React, { useState, useRef, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './AvailableTooltip.css';

const AvailableTooltip = ({className, match, handlePlayerAvailability, AVAILABLE, UNAVAILABLE, NO_ANSWER}) => {
    const [visible, setVisible] = useState(false);
    const buttonRef = useRef(null);

    const toogleTooltip = () => {
        setVisible(!visible);
    };

    const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            setVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
          <OverlayTrigger
            show={visible}
            placement="top"
            overlay={
                <Tooltip id="tooltip">
                    <span className="schedule-available-player" onClick={() => handlePlayerAvailability(match, AVAILABLE)}>&#10003;</span>
                    <span className="schedule-question-player" onClick={() => handlePlayerAvailability(match, NO_ANSWER)}>&#63;</span>
                    <span className="schedule-unavailable-player" onClick={() => handlePlayerAvailability(match, UNAVAILABLE)}>&#10060;</span>
                </Tooltip>}
          >
            <td className={`bi bi-check-circle schedule-actions ${className}`} onClick={toogleTooltip} ref={buttonRef}></td>
          </OverlayTrigger>
    );
};

export default AvailableTooltip;

AvailableTooltip.propTypes = {
    className: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    handlePlayerAvailability: PropTypes.func.isRequired,
    AVAILABLE: PropTypes.string.isRequired,
    UNAVAILABLE: PropTypes.string.isRequired,
    NO_ANSWER: PropTypes.string.isRequired
};
