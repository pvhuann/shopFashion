import React from 'react';

interface ColorSelectProps {
    colors: { name: string; hexCode?: string }[];
    selectedColor: string;
    onChange: (color: string) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ colors, selectedColor, onChange }) => {
    return (
        <select value={selectedColor} onChange={(e) => onChange(e.target.value)}>
            {colors.map((color) => (
                <option key={color.name} value={color.name}>
                    {color.name}
                </option>
            ))}
        </select>
    );
};