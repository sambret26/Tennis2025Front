import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DATA } from '../../../utils/constants';
import PropTypes from 'prop-types';
import './PlayerTooltip.css';

const infoCircle = (className, table) => {
    if (table) {
        return <td className={`bi bi-info-circle info-circle ${className}`}></td>;
    }
    return <div className={`bi bi-info-circle info-circle ${className}`}></div>;
}

const PlayerTooltip = ({ className, player, table }) => {
    return (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip>
                    <div className="tooltip-club-content">
                        <div className="bi bi-house tooltip-icon"></div>
                        <div>{player && player.club ? player.club : DATA.NC}</div>
                    </div>
                    <div className="tooltip-phone-content">
                        <div className="bi bi-telephone tooltip-icon"></div>
                        <div>{player && player.phoneNumber ? player.phoneNumber : DATA.NC}</div>
                    </div>
                    <div className="tooltip-mail-content">
                        <div className="bi bi-envelope tooltip-icon"></div>
                        <div>{player && player.email ? player.email : DATA.NC}</div>
                    </div>
                </Tooltip>
            }
        >
            {infoCircle(className, table)}
        </OverlayTrigger>
    );
}

export default PlayerTooltip;

PlayerTooltip.propTypes = {
    className: PropTypes.string.isRequired,
    player: PropTypes.object.isRequired,
    table: PropTypes.bool.isRequired
};
