'use client'

import { useState } from 'react'
import { Input } from '../ui/input'
import { X } from 'lucide-react';


interface MultiTagProps {
    placeholder?: string;
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
            <div className={`${value.length === 0 ? 'hidden' : 'flex p-2 rounded-lg border gap-1 overflow-x-auto'}`}>
                {
                    value.map((item, index) => (
                        <div key={index} className='flex items-center gap-1 h-6 bg-gray-200 text-black rounded-full p-2'>
                            <p>{item}</p>
                            <X className='h-3 w-3 rounded-full md:hover:bg-red-1' onClick={() => onRemove(item)} />
                        </div>
                    ))
                }
            </div>


        </>
    )
}

export default MultiTag