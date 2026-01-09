"use client";

import React, { useState, useEffect } from 'react';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string | number;
    onChange: (value: string) => void;
    className?: string;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({ value, onChange, className, ...props }) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        // Convert incoming number/string to formatted string for display
        if (value === '' || value === undefined || value === null) {
            setDisplayValue('');
        } else {
            setDisplayValue(formatCurrency(value.toString()));
        }
    }, [value]);

    const formatCurrency = (val: string) => {
        // Remove non-numeric chars except decimal
        const number = val.replace(/[^0-9.]/g, '');
        if (!number) return '';

        // Split integer and decimal parts
        const parts = number.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Rejoin, limiting to 2 decimal places if needed (optional)
        return parts.join('.');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Remove commas for the raw value
        const rawValue = inputValue.replace(/,/g, '');

        // Validate if it's a valid number format (allow single decimal point)
        if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
            onChange(rawValue);
            setDisplayValue(formatCurrency(rawValue));
        }
    };

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
                type="text"
                value={displayValue}
                onChange={handleChange}
                className={`pl-7 ${className}`} // Add padding for $ sign
                {...props}
            />
        </div>
    );
};
