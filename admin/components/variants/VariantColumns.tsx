import { ColumnDef } from "@tanstack/react-table";
// import { DataTable } from "@/components/custom-ui/DataTable"; // Điều chỉnh theo đúng đường dẫn
import { Button } from "@/components/ui/button";
import { DataTable } from "../custom ui/DataTable";

// Định nghĩa các cột cho bảng variants
const variantColumns: ColumnDef<{ [key: string]: string | number }, any>[] = [
    {
        accessorKey: 'color', // Chỉ định tên của key trong mỗi item
        header: 'Color',
    },
    {
        accessorKey: 'size',
        header: 'Size',
    },
    {
        accessorKey: 'material',
        header: 'Material',
    },
    {
        accessorKey: 'style',
        header: 'Style',
    },
    {
        accessorKey: 'price',
        header: 'Price',
    },
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => (
            <Button variant="destructive" onClick={() => handleDelete(row.index)}>
                Delete
            </Button>
        ),
    },
];

const handleDelete = (index: number) => {
    // Logic để xóa dòng, cập nhật lại state variants
    alert(`Delete variant at index ${index}`);
};

export const VariantColumns = ({ data }: { data: any[] }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Generated Variants</h2>
            <DataTable columns={variantColumns} data={data} />
        </div>
    );
};
