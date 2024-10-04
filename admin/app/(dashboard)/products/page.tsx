'use client'

import { DataTable } from "@/components/custom ui/DataTable"
import { ProductColumns } from "@/components/products/ProductColumns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"



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
  return (
    <div className='p-10'>
      <div className='flex justify-between items-center  mb-4'>
        <p className='text-heading2-bold'>Products</p>
        <Button type='button' className='bg-blue-1 text-white' onClick={() => router.push('products/new')}>
          <Plus className='w-4 h-4' />
          <p>Create product</p>
        </Button>
      </div>
      <DataTable columns={ProductColumns} data={products} hiddenSearchInput={false} searchKey="title" />
    </div>
  )
}

export default Products