
import ActionsItemButton from '@/components/custom ui/ActionsItemButton';
import { DataTable } from '@/components/custom ui/DataTable';
import { VendorColumns } from '@/components/vendors/VendorColumns';
import { Metadata } from 'next';
const getAllVendors = async()=> {
    try {
        const res = await fetch(`${process.env.INTERNAL_API_URL}/vendors`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        })
        if (!res.ok) throw new Error("Failed to fetch vendors");
        const data:VendorType[] = await res.json();
        return data;
    } catch (error) {
        console.log("vendors_GET", error);
        return [];
    }
}

export const generateMetadata = async (): Promise<Metadata> => {
    const vendors = await getAllVendors();
    return {
        title: "Vendors | Admin Dashboard",
        description: `List of ${vendors?.length ?? 0} vendors`,
    }
}

export default async function VendorPage() {
    const vendors = await getAllVendors();
        return (
            <>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col gap-2 w-full">
                        {/* Title and quantity */}
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-black">Vendors</h1>
                            <span className="px-2 py-1 text-lg font-semibold bg-gray-200 rounded-lg shadow">
                                {vendors.length}
                            </span>
                        </div>
                        {/* Actions */}
                        <ActionsItemButton itemType="vendors" basePath="vendor" arrayItem={vendors} />
                    </div>
                    <hr className="my-4" />

                    {/* Table vendor */}
                    <DataTable columns={VendorColumns} data={vendors} hiddenSearchInput={false} searchKey="name" />
                </div>
            </>
        )
}

