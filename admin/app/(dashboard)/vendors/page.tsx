'use client'
import { DataTable } from '@/components/custom ui/DataTable';
import { Button } from '@/components/ui/button'
import { VendorColumns } from '@/components/vendors/VendorColumns';
import { FileDown, FileUp } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';


const Vendor = () => {

    const [vendors, setVendors] = useState([])


    const getVendors = async () => {
        try {
            const res = await fetch('/api/vendors', {
                method: "GET",
            })
            const data = await res.json();
            setVendors(data);
            console.log("success");

        } catch (error) {
            console.log("vendors_GET", error);
        }
    }

    useEffect(() => {
        getVendors()
    }, []);

    const handleExportToExcel = async() => {
        // Create a new worksheet from the vendor data
        const ws = await XLSX.utils.json_to_sheet(vendors);
        
        // Create a new workbook and add the worksheet
        const wb = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, "Vendors");
        // Generate an Excel file and download it
        await XLSX.writeFile(wb, "vendors.xlsx");

    };

    const router = useRouter();
    return (
        <>
            <div className='p-10'>
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex gap-4 items-center'>
                            <p className='text-heading2-bold text-black'>Vendors</p>
                            <p className='px-2 shadow-lg bg-gray-200 rounded-lg'>{vendors.length}</p>
                        </div>
                        <div>
                            <Button className='hover:text-blue-700 px-0' type='button' onClick={()=>handleExportToExcel()}>
                                <FileDown />
                                <span>Export</span>
                            </Button>
                            <Button className='hover:text-blue-700' type='button'>
                                <FileUp />
                                <span>Import</span>
                            </Button>
                        </div>

                    </div>
                    <Button type='button' onClick={() => router.push('/vendor/add-vendor')} className='bg-blue-600  px-4 py-2 rounded-lg text-white hover:shadow-lg hover:bg-blue-800'>+Add Vendor</Button>
                </div>
                {/* <div className='flex'>
                        <Button>All products</Button>
                        <Button>Publish</Button>
                        <Button>Unpublish</Button>
                </div> */}
                <hr className='my-10' />
                <DataTable columns={VendorColumns} data={vendors} hiddenSearchInput={false} searchKey='name' />

            </div>
        </>
    )
}

export default Vendor