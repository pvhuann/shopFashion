"use client";

import { Button } from "@/components/ui/button";
import { FileDown, FileUp } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

interface ProductActionsProps {
    products: any[];
}

export const ProductActions = ({ products }: ProductActionsProps) => {
    const router = useRouter();
    //Xử lý xuất Excel
    const handleExportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(products);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "products.xlsx");
    };

    return (
        <div className="flex justify-between">
            <div>
                <div className="flex gap-4">
                    <Button className="hover:text-blue-700 px-4 py-2" type="button" onClick={handleExportToExcel}>
                        <FileDown className="mr-2" />
                        Export
                    </Button>
                    <Button className="hover:text-blue-700 px-4 py-2" type="button" disabled>
                        <FileUp className="mr-2" />
                        Import
                    </Button>
                </div>
                {/* Bộ lọc trạng thái */}
                <div className="flex gap-4">
                    <Button className="bg-gray-200 hover:bg-gray-300">All Products</Button>
                    <Button className="bg-green-200 hover:bg-green-300">Published</Button>
                    <Button className="bg-red-200 hover:bg-red-300">Unpublished</Button>
                </div>
            </div>
            {/* Nút Add Product */}
            <Button
                type="button"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:bg-blue-800"
                onClick={() => router.push("/products/add-product")}
            >
                + Add Product
            </Button>
        </div>
    );
};
