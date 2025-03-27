'use client'

import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Badge } from '../ui/badge'
import { X } from 'lucide-react'


interface MultiSelectProps {
    collections: CollectionIdTitleType[],
    value: string[],
    onChange: (value: string) => void,
    onRemove: (value: string) => void,

}
const MultiSelect: React.FC<MultiSelectProps> = ({ collections, value, onChange, onRemove }) => {

    const [isShow, setIsShow] = useState(false)
    const [inputValue, setInputValue] = useState("")
    let selected: CollectionIdTitleType[];

    if (value.length === 0) {
        selected = []
    } else {
        selected = value.map((id: string) => 
            collections.find((collection) => collection._id === id)
    )as CollectionType[]
    }

    const selectable = collections.filter((collection) => !selected.includes(collection))



    return (
        <Command className='border'>
            <div className='flex flex-wrap gap-1 rounded-md'>
                {
                    selected.map((collection)=> (
                        <Badge key={collection._id} className='flex items-center gap-1 h-6 bg-grey-1 text-white'>
                            <span>{collection.title}</span>
                            <X className='h-4 w-4 rounded-full md:hover:bg-red-1' onClick={() => onRemove(collection._id)} />
                        </Badge>
                    ))
                }
            </div>
            <CommandInput placeholder='Select or search collection...'
                value={inputValue}
                onValueChange={setInputValue}
                onFocus={() => setIsShow(true)}
                onBlur={() => setIsShow(false)}
            />
            {isShow && (
                <>
                    <CommandList className=''>
                        <CommandEmpty>No result found.</CommandEmpty>
                        <CommandGroup>
                            {
                                selectable.map((collection) => (
                                    <CommandItem className='hover:bg-grey-2 cursor-pointer'
                                        key={collection._id}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onSelect={() => {
                                            onChange(collection._id)
                                            setInputValue("")
                                        }}
                                    >
                                        {collection.title}
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>

                </>
            )}
        </Command>
    )
}

export default MultiSelect