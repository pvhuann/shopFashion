'use client'
import { FileDown, FileUp, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { utils, writeFile } from 'xlsx';
interface ActionsItemButtonProps {
    arrayItem: any[];
    itemType: string;
    basePath: string;
}
const ActionsItemButton = ({ itemType,arrayItem ,basePath }: ActionsItemButtonProps) => {

    const router = useRouter();
    const handleExportToExcel = () => {
        const ws = utils.json_to_sheet(arrayItem);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, `${itemType}`);
        writeFile(wb, `${itemType}.xlsx`);
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
                    <Button className="bg-gray-200 hover:bg-gray-300">All {itemType}</Button>
                    <Button className="bg-green-200 hover:bg-green-300">Published</Button>
                    <Button className="bg-red-200 hover:bg-red-300">Unpublished</Button>
                </div>
            </div>
            {/* Add item button */}
            <Button
                type="button"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:bg-blue-800"
                onClick={() => router.push(`${itemType}/add-${basePath}`)}
            >
                + Add {basePath}
            </Button>
        </div>
    )
}

export default ActionsItemButton