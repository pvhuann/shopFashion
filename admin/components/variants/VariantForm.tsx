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


