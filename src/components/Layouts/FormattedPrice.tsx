// components/FormattedPrice.tsx

import React from 'react';

interface FormattedPriceProps {
  current: number;
  previous?: number | null;
}

const getPriceClass = (current: number, previous?: number | null): string => {
  if (previous === null || previous === undefined) {
    return '';
  }
  return current > previous ? 'text-blue-500' : current < previous ? 'text-red-500' : '';
};

const addCommas = (number: number): string => {
  const parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const FormattedPrice: React.FC<FormattedPriceProps> = ({ current, previous }) => {
  const priceClass = getPriceClass(current, previous);
  return (
    <p className={`font-medium ${priceClass || 'text-dark dark:text-white'}`}>
      {addCommas(current)}
    </p>
  );
};

export default FormattedPrice;
