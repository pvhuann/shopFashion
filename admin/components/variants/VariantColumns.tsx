'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

export function VariantColumns(data: VariantType[]): ColumnDef<VariantType>[] {
    const columns: ColumnDef<VariantType>[] = [];

    // Tạo danh sách các cột cần hiển thị
    const keysInData = new Set(
        data.flatMap((item) => Object.keys(item).filter((key) => item[key as keyof VariantType] !== undefined))
    );

    // Danh sách cột cần kiểm tra
    const columnConfigs: { key: keyof VariantType; header: string; isImage?: boolean }[] = [
        { key: 'color', header: 'Color' },
        { key: 'image', header: 'Image', isImage: true },
        { key: 'size', header: 'Size' },
        { key: 'material', header: 'Material' },
        { key: 'style', header: 'Style' },
        { key: 'price', header: 'Price' },
        { key: 'inventory', header: 'Inventory' },
        { key: 'expense', header: 'Expense' },
    ];

    // Tạo cột dựa trên dữ liệu có sẵn
    columnConfigs.forEach(({ key, header, isImage }) => {
        if (keysInData.has(key)) {
            columns.push({
                accessorKey: key,
                header,
                cell: ({ row }) =>
                    isImage && row.original[key] ? (
                        <Image
                            src={row.original[key] as string}
                            alt={header}
                            width={50}
                            height={50}
                            className="rounded-md"
                        />
                    ) : (
                        row.original[key] ?? '—'
                    ),
            });
        }
    });

    return columns;
}
