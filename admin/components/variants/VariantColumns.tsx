import { ColumnDef } from "@tanstack/react-table";
// import { DataTable } from "@/components/custom-ui/DataTable"; // Điều chỉnh theo đúng đường dẫn
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Hàm tạo các cột dựa trên dữ liệu
export function getVariantColumns(data: VariantType[]): ColumnDef<VariantType>[] {
    const keysInData = new Set(
        data.flatMap((item) => Object.keys(item).filter((key) => item[key as keyof VariantType] !== undefined))
    );

    // Định nghĩa các cột nếu dữ liệu chứa các trường tương ứng
    const columns: ColumnDef<VariantType>[] = [];

    if (keysInData.has("color")) {
        columns.push({
            accessorKey: "color",
            header: "Color",
        });
    }

    if (keysInData.has("image")) {
        columns.push({
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => <Image src={row.original.image??""} alt="Variant" width={50} height={50} />,
        });
    }

    if (keysInData.has("size")) {
        columns.push({
            accessorKey: "size",
            header: "Size",
        });
    }

    if (keysInData.has("material")) {
        columns.push({
            accessorKey: "material",
            header: "Material",
        });
    }

    if (keysInData.has("style")) {
        columns.push({
            accessorKey: "style",
            header: "Style",
        });
    }

    if (keysInData.has("price")) {
        columns.push({
            accessorKey: "price",
            header: "Price",
        });
    }

    if (keysInData.has("inventory")) {
        columns.push({
            accessorKey: "inventory",
            header: "Inventory",
        });
    }

    if (keysInData.has("expense")) {
        columns.push({
            accessorKey: "expense",
            header: "Expense",
        });
    }

    return columns;
}
