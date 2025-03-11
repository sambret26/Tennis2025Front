import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './PlayerTooltip.css';

const infoCircle = (className, table) => {
    if (table) {
        return <td className={`bi bi-info-circle info-circle ${className}`}></td>;
    }
    return <div className={`bi bi-info-circle info-circle ${className}`}></div>;
}

const TeamTooltip = ({ className, team, table }) => {
    return (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip>
                    <div className="tooltip-club-content">
                        <div className="bi bi-house tooltip-icon"></div>
                        <div>{team && team.player1 && team.player1.club ? team.player1.club : 'NC'}</div>
                    </div>
                    <div className="tooltip-phone-content">
                        <div className="bi bi-telephone tooltip-icon"></div>
                        <div>{team && team.player1 && team.player1.phoneNumber ? team.player1.phoneNumber : 'NC'}</div>
                    </div>
                    <div className="tooltip-mail-content">
                        <div className="bi bi-envelope tooltip-icon"></div>
                        <div>{team && team.player1 && team.player1.email ? team.player1.email : 'NC'}</div>
                    </div>
                    <div className="tooltip-club-content">
                        <div className="bi bi-house tooltip-icon"></div>
                        <div>{team && team.player2 && team.player2.club ? team.player2.club : 'NC'}</div>
                    </div>
                    <div className="tooltip-phone-content">
                        <div className="bi bi-telephone tooltip-icon"></div>
                        <div>{team && team.player2 && team.player2.phoneNumber ? team.player2.phoneNumber : 'NC'}</div>
                    </div>
                    <div className="tooltip-mail-content">
                        <div className="bi bi-envelope tooltip-icon"></div>
                        <div>{team && team.player2 && team.player2.email ? team.player2.email : 'NC'}</div>
                    </div>
                </Tooltip>
            }
        >
            {infoCircle(className, table)}
        </OverlayTrigger>
    );
}

export default TeamTooltip;