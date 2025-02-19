
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "../custom ui/DataTable";
import { VariantColumns } from "./VariantColumns";

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

    const variantColumns = VariantColumns(variants);

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
            <DataTable columns={variantColumns} data={variants} />
        </div>
    );
};

export default DynamicVariantsForm;

