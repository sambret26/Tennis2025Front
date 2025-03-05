import React from 'react';
import { Checkbox, Radio, Typography } from 'antd';
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
      <Title level={4}>Filtres</Title>

      <div className="filter-group">
        <Title level={5}>Classements</Title>
        <Checkbox.Group
          options={filters.rankings}
          value={filters.selectedRankings}
          onChange={handleRankingFilterChange}
          className="rankingFilters"
        />
      </div>

      <div className="filter-group">
        <Title level={5}>Catégories</Title>
        <Checkbox.Group
          options={filters.categories}
          value={filters.selectedCategories}
          onChange={handleCategoryFilterChange}
          className="categoryFilters"
        />
      </div>

      <div className="filter-group">
        <Title level={5}>Statut de paiement</Title>
        <RadioGroup
          options={[
            { label: 'Tous', value: 'all' },
            { label: 'Payé', value: 'paid' },
            { label: 'Partiellement payé', value: 'partiallyPaid' },
            { label: 'Non payé', value: 'unpaid' },
          ]}
          value={filters.paymentStatus}
          onChange={handlePaymentStatusChange}
        />
      </div>
    </div>
  );
};

export default PlayersFilters;