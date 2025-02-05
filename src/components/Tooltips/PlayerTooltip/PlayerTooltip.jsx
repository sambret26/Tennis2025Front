import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './PlayerTooltip.css';

const PlayerTooltip = ({ className, player }) => {
    return (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip>
                    <div className="tooltip-phone-content">
                        <div className="bi bi-telephone tooltip-icon"></div>
                        <div>{player && player.phoneNumber ? player.phoneNumber : 'NC'}</div>
                    </div>
                    <div className="tooltip-mail-content">
                        <div className="bi bi-envelope tooltip-icon"></div>
                        <div>{player && player.email ? player.email : 'NC'}</div>
                    </div>
                </Tooltip>
            }
        >
            <td className={`bi bi-info-circle info-circle ${className}`}></td>
        </OverlayTrigger>
    );
}

export default PlayerTooltip;