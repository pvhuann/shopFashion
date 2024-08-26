import { CldUploadWidget } from 'next-cloudinary';

import { Plus, X } from "lucide-react";

import { Button } from "../ui/button";
import Image from "next/image";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}



const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    onRemove,
    value,
}) => {
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
        // console.log('Upload finished:', result.info.secure_url);
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative max-w-[200px] max-h-[200px]">
                        <div className="absolute top-0 right-0 z-10">
                            <Button type="button" onClick={() => onRemove(url)} size="sm" className="bg-red-1 text-white relative group w-10 h-10 rounded-lg">
                                <X className="h-4 w-4 absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition duration-150 group-hover:ease-in-out" />
                            </Button>
                        </div>
                        <Image
                            src={url}
                            alt="collection"
                            className="object-cover rounded-lg"
                            width={200}
                            height={200}
                        />
                    </div>
                ))}


            </div>

            <CldUploadWidget uploadPreset="kyysqcj8" onSuccess={onUpload}>
                {({ open }) => {
                    return (
                        <Button type="button" onClick={() => open()} className="bg-grey-1 text-white relative group w-[200px] h-10 rounded-xl">
                            <div className='flex items-center absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition duration-150 group-hover:ease-in-out'>
                                <Plus className="h-4 w-4" />
                                <p>Upload Image</p>
                            </div>

                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;