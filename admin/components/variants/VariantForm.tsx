// 'use client'


// import { zodResolver } from '@hookform/resolvers/zod'
// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'
// import { Label } from '../ui/label'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
// import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
// import MultiTag from '../custom ui/MultiTag'


// const variantSchema = z.object({
//     color: z.array(z.string()),
//     material:z.array(z.string()),
//     size: z.array(z.string()),
//     style: z.array(z.string()),
//     image: z.string().url("Invalid URL"),
//     price: z.number().min(0, "Price must be at least 0"),
//     inventory: z.number().min(0, "Inventory must be at least 0"),
//     // sale: z.number().min(0).max(100, "Sale must be between 0 and 100"),
// })

// interface VariantProps {
//     initialData?: z.infer<typeof variantSchema> | null,
// }


// const VariantForm: React.FC<VariantProps> = ({ initialData }) => {

//     const formVariant = useForm<z.infer<typeof variantSchema>>({
//         resolver: zodResolver(variantSchema),
//         defaultValues: initialData ? initialData : {
//             color: [],
//             material: [],
//             size: [],
//             style: [],
//             image: "",
//             price: 0,
//             inventory: 0,
//             // sale: 0,
//         }
//     })

//     const [options, setOptions]= useState<string[]>([]);
//     const [selectedOption, setSelectedOption] = useState<string | null>(null);

//     //block "Submit" when "Enter" is clicked
//     const handleKeyPress = (event:
//         | React.KeyboardEvent<HTMLInputElement>
//         | React.KeyboardEvent<HTMLTextAreaElement>) => {
//         if (event.key === "Enter") {
//             event.preventDefault()
//         }
//     }


//     const isOptionDisable = (option: string) => options.includes(option);
//     const handleOptionChange = (option: string | null) => {
//         setSelectedOption(option);
//     }

//     return (
//         <div className="w-full">
//             <Label htmlFor="option" className="text-black ">OPTIONS</Label>
//         </div>
//     )
// }

// export default VariantForm

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "../custom ui/DataTable";
import { VariantColumns } from "./VariantColumns";
// import { VariantColumns } from "./VariantColumns"; // Đảm bảo import đúng

interface OptionGroup {
    id: number;
    type: string;
    values: string[];
}

const DynamicVariantsForm = () => {
    const [options, setOptions] = useState<OptionGroup[]>([]);
    const [availableOptions, setAvailableOptions] = useState<string[]>([
        "colors",
        "sizes",
        "materials",
        "style",
    ]);
    const [variants, setVariants] = useState<Array<{ [key: string]: string | number }>>([]);

    const addOption = () => {
        if (availableOptions.length === 0) {
            alert("No more options available to add.");
            return;
        }
        const newOption: OptionGroup = { id: Date.now(), type: "", values: [] };
        setOptions((prev) => [...prev, newOption]);
    };

    const handleSelectType = (id: number, type: string) => {
        setOptions((prev) =>
            prev.map((opt) => (opt.id === id ? { ...opt, type } : opt))
        );
        setAvailableOptions((prev) => prev.filter((option) => option !== type));
    };

    const handleAddValue = (id: number) => {
        setOptions((prev) =>
            prev.map((opt) =>
                opt.id === id ? { ...opt, values: [...opt.values, ""] } : opt
            )
        );
    };

    const handleRemoveValue = (id: number, index: number) => {
        setOptions((prev) =>
            prev.map((opt) =>
                opt.id === id
                    ? { ...opt, values: opt.values.filter((_, i) => i !== index) }
                    : opt
            )
        );
    };

    const handleChangeValue = (id: number, index: number, value: string) => {
        setOptions((prev) =>
            prev.map((opt) =>
                opt.id === id
                    ? {
                        ...opt,
                        values: opt.values.map((val, i) => (i === index ? value : val)),
                    }
                    : opt
            )
        );
    };

    const generateVariants = () => {
        const allValues = options.reduce((acc, option) => {
            if (option.values.length === 0) {
                alert(`Please fill in values for ${option.type}.`);
                throw new Error("Incomplete options");
            }
            acc[option.type] = option.values;
            return acc;
        }, {} as { [key: string]: string[] });

        const keys = Object.keys(allValues);
        const combinations: Array<{ [key: string]: string | number }> = [];
        const recurse = (current: any, depth: number) => {
            if (depth === keys.length) {
                combinations.push({ ...current });
                return;
            }
            const key = keys[depth];
            for (const value of allValues[key]) {
                recurse({ ...current, [key]: value }, depth + 1);
            }
        };
        recurse({}, 0);
        setVariants(combinations);
    };

    return (
        <div className="space-y-4">
            {/* Option Groups */}
            {options.map((option) => (
                <div key={option.id} className="space-y-2 border p-4 rounded-md">
                    {/* Select Content */}
                    <Select
                        onValueChange={(value) => handleSelectType(option.id, value)}
                        value={option.type}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select option type" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableOptions.map((availableOption) => (
                                <SelectItem key={availableOption} value={availableOption}>
                                    {availableOption}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Option Input Group */}
                    {option.type && (
                        <div>
                            <Label>{option.type}</Label>
                            {option.values.map((value, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={value}
                                        onChange={(e) =>
                                            handleChangeValue(option.id, index, e.target.value)
                                        }
                                        placeholder={`Enter ${option.type.slice(0, -1)}`}
                                    />
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={() => handleRemoveValue(option.id, index)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => handleAddValue(option.id)}
                            >
                                Add {option.type.slice(0, -1)}
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            {/* Add Option Button */}
            <Button type="button" onClick={addOption}>
                Add Option
            </Button>

            {/* Generate Variants Button */}
            <Button type="button" onClick={generateVariants}>
                Generate Variants
            </Button>

            {/* Display Variants Table */}
            {/* <VariantColumns data={variants} /> */}
            <DataTable columns={VariantColumns} data={variants} />
        </div>
    );
};

export default DynamicVariantsForm;

