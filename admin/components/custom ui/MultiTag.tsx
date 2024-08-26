'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface MultiTagProps {
    placeholder: string;
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}


const MultiTag: React.FC<MultiTagProps> = ({ value, onChange, onRemove,placeholder }) => {
    const [inputValue, setInputValue] = useState('')

    const addValue = (item: string) => {
        onChange(item)
        setInputValue("")
    }

    return (
        <>

            <Input className=''
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        addValue(inputValue);
                    }
                }}
            />
            <div className='flex'>
                {
                    value.map((item, index) => (
                        <Badge key={index} className='flex items-center gap-1 h-6 bg-grey-1 text-white'>
                            <p>{item}</p>
                            <X className='h-4 w-4 rounded-full md:hover:bg-red-1' onClick={() => onRemove(item)} />
                        </Badge>
                    ))
                }
            </div>


        </>
    )
}

export default MultiTag