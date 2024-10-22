'use client'

import Loader from "@/components/custom ui/Loader";
import VendorForm from "@/components/vendors/VendorForm"
import { useEffect, useState } from "react"


const VendorDetails = ({ params }: { params: { vendorId: string } }) => {
    const [loading, setLoading] = useState(true);
    const [vendorDetails, setVendorDetails] = useState<VendorType | null>(null);
    const [productsByVendor, setProductsByVendor] = useState<ProductType[]>([]);

    const getVendorDetails = async () => {
        try {
            const res = await fetch(`/api/vendors/${params.vendorId}`, {
                method: 'GET',
            })

            if (res.ok) {
                const data = await res.json()
                setVendorDetails(data)
                setProductsByVendor(data.products);
            }

        } catch (error) {
            console.log("vendorDetails_GET", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getVendorDetails()
    }, [params.vendorId]);



    return loading? <Loader/>: (
        <div className="">
            {/* <div className='flex justify-between items-center m-9'>
                <p className='text-heading2-bold'>Vendor</p>
            </div>
            <hr className='' /> */}
            <VendorForm initialData={vendorDetails}/>
        </div>
    )
}

export default VendorDetails