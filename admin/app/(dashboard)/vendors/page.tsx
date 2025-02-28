
import { DataTable } from '@/components/custom ui/DataTable';
import { VendorActions } from '@/components/vendors/VendorActions';
import { VendorColumns } from '@/components/vendors/VendorColumns';
import { Metadata } from 'next';
async function getAllVendors() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`, {
            method: "GET",
            // cache: "no-store",
        })
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("vendors_GET", error);
    }
}

export const generateMetadata = async (): Promise<Metadata> => {
    const vendors = await getAllVendors();
    return {
        title: "Vendors | Admin Dashboard",
        description: `List of ${vendors.length} vendors`,
    }
}

export default async function VendorPage() {
    const vendors = await getAllVendors();
    if (!vendors.length) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <h1 className="text-2xl font-bold">No vendors found!</h1>
            </div>
        );
    }
    else return (
        <>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col gap-2 w-full">
                        {/* Title and quantity */}
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-black">Vendors</h1>
                            <span className="px-2 py-1 text-lg font-semibold bg-gray-200 rounded-lg shadow">
                                {vendors.length}
                            </span>
                        </div>
                        {/* Actions */}
                        <VendorActions vendors={vendors} />
                    </div>
                </div>

                <hr className="my-4" />

                {/* Table vendor */}
                <DataTable columns={VendorColumns} data={vendors} hiddenSearchInput={false} searchKey="name" />
            </div>
        </>
    )
}

