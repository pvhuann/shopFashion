import React, { useState } from 'react'
import MultiTag from '../custom ui/MultiTag';
import { SelectContent, SelectItem } from '../ui/select';
import { Delete } from 'lucide-react';

interface OptionsProps {
    value: string[],
    arrayOptions: string[],
    onChange: (value: string[]) => void,
    onRemove: (index: number) => void,
}
const OptionForm: React.FC<OptionsProps> = ({ value, onChange, onRemove, arrayOptions }) => {
    const [options, setOptions] = useState<string[]>(arrayOptions);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionChange= (option: string)=>{
        setSelectedOption(option);
        onChange([...value, option]);
    }

    const isOptionDisable = (option: string) => {
        return value.includes(option);
    }
    return (
        <>
            <div>OptionForm</div>
            <SelectContent>
                {/* <MultiTag value={value} onChange={onChange} onRemove={onRemove} placeholder='Add option' /> */}
                <SelectContent>
                    {options.map((option, index) => (
                        <SelectItem key={index} onClick={() => handleOptionChange(option)} disabled={isOptionDisable(option)} value={''}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectContent>
            <Delete size={16} className='bg-red-500'/>
            
        </>

    )
}

export default OptionForm