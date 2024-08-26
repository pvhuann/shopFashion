import React, { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'

interface MultiSelectProps{
    collections: CollectionType[],
    value: string[],
    onChange: (value: string) => void,
    onRemove: (value: string) => void,
    
}
const MultiSelect: React.FC<MultiSelectProps> = ({collections, value, onChange,onRemove}) => {

    const [isShow, setIsShow] = useState(false)
    return (
        <Command className='border'>
            <div className=''>

            </div>
            <CommandInput placeholder='Select or search collection...'
                onFocus={() => setIsShow(true)}
                onBlur={() => setIsShow(false)}
            />
            {isShow && (
                <>                    
                        <CommandList className=''>
                            <CommandEmpty>No result found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem >
                                    <span>abc</span>
                                </CommandItem>
                                <CommandItem>
                                    <span>jkl</span>
                                </CommandItem>
                                <CommandItem>
                                    <span>jkl</span>
                                </CommandItem>
                                <CommandItem>
                                    <span>jkl</span>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    
                </>
            )}
        </Command>
    )
}

export default MultiSelect