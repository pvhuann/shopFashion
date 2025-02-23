// 'use client'
// import Loader from "@/components/custom ui/Loader";
// import VendorForm from "@/components/vendors/VendorForm";
// import { useEffect, useState } from "react";
// const VendorDetails = ({ params }: { params: { vendorId: string } }) => {
//     const [loading, setLoading] = useState(true);
//     const [vendorDetails, setVendorDetails] = useState<VendorType | null>(null);
//     const [productsByVendor, setProductsByVendor] = useState<ProductType[]>([]);
//     useEffect(() => {
//         const getVendorDetails = async () => {
//             try {
//                 const res = await fetch(`/api/vendors/${params.vendorId}`, {
//                     method: 'GET',
//                 })
//                 if (res.ok) {
//                     const data = await res.json()
//                     setVendorDetails(data)
//                     setProductsByVendor(data.products);
//                     document.title = `${data.name} | Vendors`;
//                 }
//             } catch (error) {
//                 console.log("vendorDetails_GET", error);
//             } finally {
//                 setLoading(false)
//             }
//         }
//         getVendorDetails();
//     }, [params.vendorId]);
//     return loading ? <Loader /> : (
//         <VendorForm initialData={vendorDetails} />
//     )
// }
// export default VendorDetails

import VendorForm from "@/components/vendors/VendorForm";
import { Metadata } from "next";

// fetch vendor details from vendor endpoint by vendorId
async function getVendorDetails(vendorId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`, {
            method: "GET",
            cache: "no-store" // Disable cache
        });
        if (!res.ok) throw new Error('Failed to fetch vendor details');
        return await res.json();
    } catch (error) {
        console.error("vendorDetails_GET", error);
        return null;
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { vendorId: string } }): Promise<Metadata> {
    const vendor = await getVendorDetails(params.vendorId);
    const name = vendor?.name ?? "Unknown Vendor";
    return {
        title: `${name} | Vendors | Admin Dashboard`,
        description: vendor
            ? `Vendor details: ${name}.`
            : "No found vendor.",
        openGraph:{
            title: `${name} | Vendors | Admin Dashboard`,
            description: vendor
                ? `Vendor details: ${name}.`
                : "No found vendor.",
        }
    };
}

// Vendor details page
export default async function VendorDetails({ params }: { params: { vendorId: string } }) {
    const vendorDetails = await getVendorDetails(params.vendorId);

    if (!vendorDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <h1 className="text-2xl font-bold">No vendor found!</h1>
            </div>
        );
    }
    else return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-600"> {vendorDetails.name}</h1>
            <VendorForm initialData={vendorDetails} />
        </div>
    );
}
