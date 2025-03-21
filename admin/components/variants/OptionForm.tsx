import React, { useState } from 'react'
import MultiTag from '../custom ui/MultiTag';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Delete } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFormContext } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus } from 'lucide-react';

interface OptionsProps {
    value: string[],
    arrayOptions: [
        "colors",
        "sizes",
        "materials",
        "style",
    ],
    onChange: (value: string[]) => void,
    onRemove: (index: number) => void,
    disabledOptions?: string[],
}

const OptionForm: React.FC<OptionsProps> = ({ value, onChange, onRemove, arrayOptions, disabledOptions = [] }) => {
    const [options, setOptions] = useState<string[]>(arrayOptions);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const { control } = useFormContext();

    function handleOptionChange(option: string) {
        setSelectedOption(option);
        if (!value.includes(option)) {
            onChange([...value, option]);
        }
    }

    function isOptionDisable(option: string) {
        return disabledOptions.includes(option);
    }

    const handleAddValue = () => {
        if (selectedOption && inputValue.trim()) {
            const field = control._formValues[`variantSchema.${selectedOption}`] || [];
            control._formValues[`variantSchema.${selectedOption}`] = [...field, inputValue.trim()];
            setInputValue('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Select onValueChange={handleOptionChange} value={selectedOption || ""}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select variant type" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        {options.map((option, index) => (
                            <SelectItem 
                                key={index} 
                                value={option}
                                disabled={isOptionDisable(option)}
                            >
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex-1 flex items-center gap-2">
                    <Input
                        placeholder={`Enter ${selectedOption || 'variant'} value`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddValue();
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAddValue}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => onRemove(value.indexOf(selectedOption || ""))}
                >
                    <Delete className="h-4 w-4" />
                </Button>
            </div>

            {value.map((option, index) => (
                <FormField
                    key={index}
                    control={control}
                    name={`variantSchema.${option}`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="capitalize">{option}</FormLabel>
                            <FormControl>
                                <MultiTag
                                    placeholder={`Enter ${option} values`}
                                    value={field.value || []}
                                    onChange={(tag) => field.onChange([...(field.value || []), tag])}
                                    onRemove={(tagRemove) => {
                                        field.onChange([...(field.value || []).filter((item: string) => item !== tagRemove)])
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
            ))}
        </div>
    )
}

export default OptionForm