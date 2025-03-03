
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
    const handleOnnSuccess = (result: any) => {
        onChange(result.info.secure_url);
        // console.log('Upload finished:', result.info.secure_url);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="mb-4 flex flex-wrap items-center gap-4 w-full">
                {value.map((url,index) => (
                    <div key={index} className="relative max-w-[200px] max-h-[200px]">
                        <div className="absolute top-0 right-0 z-10">
                            <Button type="button" onClick={() => onRemove(url)}  className="bg-red-1 text-white relative group w-8 h-8 rounded-none rounded-tr-lg rounded-bl-lg">
                                <X className="h-4 w-4 absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition duration-150 group-hover:ease-in-out" />
                            </Button>
                        </div>
                        <Image
                            src={url}
                            alt="image"
                            className="rounded-lg object-cover"
                            width={200}
                            height={200}
                        />
                    </div>
                ))}
            </div>

            <CldUploadWidget uploadPreset="kyysqcj8" onSuccess={handleOnnSuccess}>
                {({ open }) => {
                    return (
                        <Button type="button" onClick={() => open()} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover: text-white relative group w-[200px] h-10 rounded-xl">
                            <div className='flex items-center absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                                <Plus className="h-4 w-4" />
                                <p>Upload Image</p>
                            </div>
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>

        // <CldUploadWidget uploadPreset="kyysqcj8" onSuccess={handleOnnSuccess}>
        //     {({ open }) => {
        //         return (
        //             <Card className='shadow-lg'>
        //                 <CardHeader>
        //                     <CardTitle>Product media</CardTitle>
        //                 </CardHeader>
        //                 <hr />
        //                 <CardContent className="bg-gray-100 m-10 p-2 rounded-lg border-dashed border-2 flex flex-col gap-2 items-center " >
        //                     <img src="/oc-browse.svg" alt="" className="w-[150px] h-[200px]" />
        //                     <p className="text-base-bold text-black">Drag and drop your file here</p>
        //                     <p>or</p>
        //                     <Button onClick={() => open()} type="button" className="p-2 bg-white rounded-lg">Browser file</Button>
        //                     <FormField
        //                         control={form.control}
        //                         name="media"
        //                         render={({ field }) => (
        //                             <FormItem>
        //                                 <FormControl>
        //                                     <div className='flex flex-wrap gap-2'>
        //                                         {
        //                                             field.value.map((url, index) => (
        //                                                 <div key={index} className="relative max-w-[200px] max-h-[200px]">
        //                                                     <div className="absolute top-0 right-0 z-10">
        //                                                         <Button type="button"
        //                                                             // onClick={() => form.setValue("media", [...form.getValues("media").filter((item) => item !== url)])}
        //                                                             onClick={() => field.onChange([...field.value.filter((item) => item !== url)])}
        //                                                             size="sm" className="bg-red-1 text-white relative group w-6 h-6 rounded-lg">
        //                                                             <X className="h-2 w-2 absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition duration-150 group-hover:ease-in-out" />
        //                                                         </Button>
        //                                                     </div>
        //                                                     <Image
        //                                                         src={url}
        //                                                         alt="image"
        //                                                         className="rounded-lg object-cover w-[300px] h-[150px]"
        //                                                         width={200}
        //                                                         height={200}
        //                                                     />

        //                                                 </div>
        //                                             ))
        //                                         }
        //                                     </div>
        //                                 </FormControl>
        //                                 <FormMessage className="text-red-1" />
        //                             </FormItem>
        //                         )}
        //                     />
        //                     {/* <div >
        //                                     <Image src={form.getValues("media")[0]} alt="" width={100} height={100} className='' />
        //                                 </div> */}

        //                 </CardContent>
        //             </Card>
        //         )
        //     }}
        // </CldUploadWidget>

    )
};

export default ImageUpload;