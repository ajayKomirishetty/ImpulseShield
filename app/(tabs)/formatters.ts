export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value / 100); // Assuming value is like 0.97 for 0.97%
};

export const formatChange = (value: number): string => {
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${formatCurrency(Math.abs(value))}`;
};

export const formatChangePercent = (value: number): string => {
    const sign = value >= 0 ? '+' : ''; // Percentage already includes sign for negative
    return `${sign}${formatPercentage(value)}`;
};

import Colors from '@/constants/colors';

export const getHorizonColor = (horizon: 'short' | 'medium' | 'long' | string): string => {
    switch (horizon) {
        case 'short':
            return Colors.success;
        case 'medium':
            return Colors.warning;
        case 'long':
            return Colors.purple;
        default:
            return Colors.primary;
    }
};

