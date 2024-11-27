import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import MultiTag from '../custom ui/MultiTag'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'


const formOptionSchema = z.object({
    color: z.array(z.string()),
    material: z.array(z.string()),
    size: z.array(z.string()),
    style: z.array(z.string()),
    image: z.string().url("Invalid URL"),
})

const listOptions = Object.keys(formOptionSchema.shape);



const VariantOption = ({ params }: { params: { option: string, array: string[] } }) => {

    const form = useForm<z.infer<typeof formOptionSchema>>({
        resolver: zodResolver(formOptionSchema),
        defaultValues: {
            color: [],
            material: [],
            size: [],
            style: [],
            image: '',
        }
    })
    const ot = []

    const [options, setOptions] = useState<string[]>([])

    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionChange = (option: string | null) => {
        setSelectedOption(option);
    }

    const isOptionDisable = (option: string) => options.includes(option);

    const handleAddOption = (option: string) => {
        setOptions([...options, option]);
    }


    return (

        <div className="flex gap-4 w-full">
            <div className="w-1/5">
                <Select value={selectedOption || ""} onValueChange={handleOptionChange} >
                    <SelectTrigger id="">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                        <SelectItem value={params.option} disabled={isOptionDisable(params.option)}>{params.option}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1">
                {/* <MultiTag
                    placeholder={`Enter ${params.option}s`}
                    value={params.array}
                    onChange={(tag) => field.onChange([...params.array, tag])}
                    onRemove={(tagRemove) => {
                        field.onChange([...field.value.filter((item) => item !== tagRemove)])
                    }}
                /> */}
                <FormField
                    control={form.control}
                    name={params.option}
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Tags</FormLabel> */}
                            <FormControl>
                                <MultiTag
                                    placeholder={`Enter ${params.option}s`}
                                    value={params.array}
                                    onChange={(tag) => field.onChange([...params.array, tag])}
                                    onRemove={(tagRemove) => {
                                        field.onChange([...field.value.filter((item: string) => item !== tagRemove)])
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="text-red-1" />
                        </FormItem>
                    )}
                />
            </div>
        </div>

    )
}

export default VariantOption