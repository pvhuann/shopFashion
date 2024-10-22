'use client'

import { DataTable } from "@/components/custom ui/DataTable"
import { ProductColumns } from "@/components/products/ProductColumns"
import { Button } from "@/components/ui/button"
import { FileDown, FileUp, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import * as XLSX from 'xlsx';



const Products = () => {
  const [products, setProducts] = useState([])
  const router = useRouter()
  const getAllProduct = async () => {
    try {
      const res = await fetch(`/api/products`, {
        method: "GET",
      })

      const data = await res.json();
      setProducts(data);

    } catch (error) {
      console.log("products_GET", error);

    }
  }

  useEffect(() => {
    getAllProduct();
  }, [])

  const handleExportToExcel = async () => {
    // Create a new worksheet from the vendor data
    const ws = await XLSX.utils.json_to_sheet(products);

    // Create a new workbook and add the worksheet
    const wb = await XLSX.utils.book_new();
    await XLSX.utils.book_append_sheet(wb, ws, "Products");
    // Generate an Excel file and download it
    await XLSX.writeFile(wb, "products.xlsx");

  };
  return (
    // <div className='p-10'>
    //   <div className='flex justify-between items-center  mb-4'>
    //     <p className='text-heading2-bold'>Products</p>
    //     <Button type='button' className='bg-blue-1 text-white' onClick={() => router.push('products/new')}>
    //       <Plus className='w-4 h-4' />
    //       <p>Create product</p>
    //     </Button>
    //   </div>
    //   <DataTable columns={ProductColumns} data={products} hiddenSearchInput={false} searchKey="title" />
    // </div>
    <>
      <div className='p-10'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-4 items-center'>
              <p className='text-heading2-bold text-black'>Products</p>
              <p className='px-2 shadow-lg bg-gray-200 rounded-lg'>{products.length}</p>
            </div>
            <div>
              <Button className='hover:text-blue-700 px-0' type='button' onClick={() => handleExportToExcel()}>
                <FileDown />
                <span>Export</span>
              </Button>
              <Button className='hover:text-blue-700' type='button'>
                <FileUp />
                <span>Import</span>
              </Button>
            </div>

          </div>
          <Button type='button' onClick={() => router.push('/vendor/add-vendor')} className='bg-blue-600  px-4 py-2 rounded-lg text-white hover:shadow-lg hover:bg-blue-800'>+Add product</Button>
        </div>
        {/* <div className='flex'>
                        <Button>All products</Button>
                        <Button>Publish</Button>
                        <Button>Unpublish</Button>
                </div> */}
        <hr className='my-10' />
        <DataTable columns={ProductColumns} data={products} hiddenSearchInput={false} searchKey='name' />

      </div>
    </>
  )
}

export default Products