import React, { useState } from 'react'
import MultiTag from '../custom ui/MultiTag';
import { SelectContent, SelectItem } from '../ui/select';
import { Delete } from 'lucide-react';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { useFormContext } from 'react-hook-form';

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
}
const OptionForm: React.FC<OptionsProps> = ({ value, onChange, onRemove, arrayOptions }) => {
    const [options, setOptions] = useState<string[]>(arrayOptions);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const { control } = useFormContext();

    function handleOptionChange(option: string) {
        setSelectedOption(option);
        onChange([...value, option]);
    }

    function isOptionDisable(option: string) {
        return value.includes(option);
    }

    return (
        <>
            <div>OptionForm</div>
            <div>
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
                <div className="flex-1">
                    <FormField
                        control={control}
                        name={`variantSchema.${selectedOption}`}
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel>Tags</FormLabel> */}
                                <FormControl>
                                    <MultiTag
                                        placeholder={`Enter ${selectedOption ?? "..."} values`}
                                        value={field.value}
                                        onChange={(tag) => field.onChange([...field.value, tag])}
                                        onRemove={(tagRemove) => {
                                            field.onChange([...field.value.filter((item: string) => item !== tagRemove)])
                                        }}
                                    />
                                    {/* <Input
                                    placeholder={`Enter ${selectedOption ?? "..."} values`}
                                    value={}
                                /> */}
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />
                </div>
                <Delete size={16} className='bg-red-500' />
            </div>

        </>

    )
}

export default OptionForm