import React from 'react';
import { Checkbox, Radio, Typography } from 'antd';
import { FILTER } from '../../utils/constants';
import PropTypes from 'prop-types';
import './PlayersFilters.css';

const { Title } = Typography;
const { Group: RadioGroup } = Radio;

const PlayersFilters = ({
  filters,
  handleRankingFilterChange,
  handleCategoryFilterChange,
  handlePaymentStatusChange,
}) => {
  return (
    <div>
      <Title level={4}>{FILTER.TITLE}</Title>

      <div className="filter-group">
        <Title level={5}>{FILTER.RANKING}</Title>
        <Checkbox.Group
          options={filters.rankings}
          value={filters.selectedRankings}
          onChange={handleRankingFilterChange}
          className="rankingFilters"
        />
      </div>

      <div className="filter-group">
        <Title level={5}>{FILTER.CATEGORY}</Title>
        <Checkbox.Group
          options={filters.categories}
          value={filters.selectedCategories}
          onChange={handleCategoryFilterChange}
          className="categoryFilters"
        />
      </div>

      <div className="filter-group">
        <Title level={5}>{FILTER.PAYMENT}</Title>
        <RadioGroup
          options={[
            { label: FILTER.LABEL.ALL, value: FILTER.VALUE.ALL },
            { label: FILTER.LABEL.PAID, value: FILTER.VALUE.PAID },
            { label: FILTER.LABEL.PARTIALLY_PAID, value: FILTER.VALUE.PARTIALLY_PAID },
            { label: FILTER.LABEL.UNPAID, value: FILTER.VALUE.UNPAID },
          ]}
          value={filters.paymentStatus}
          onChange={handlePaymentStatusChange}
        />
      </div>
    </div>
  );
};

export default PlayersFilters;

PlayersFilters.propTypes = {
    filters: PropTypes.object.isRequired,
    handleRankingFilterChange: PropTypes.func.isRequired,
    handleCategoryFilterChange: PropTypes.func.isRequired,
    handlePaymentStatusChange: PropTypes.func.isRequired
};
