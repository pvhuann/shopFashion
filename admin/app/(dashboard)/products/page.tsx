// 'use client'

// import { DataTable } from "@/components/custom ui/DataTable"
// import Loader from "@/components/custom ui/Loader"
// import { ProductColumns } from "@/components/products/ProductColumns"
// import { Button } from "@/components/ui/button"
// import { FileDown, FileUp } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import * as XLSX from 'xlsx';



// const Products = () => {
//   const [loading, setLoading]= useState(true)
//   const [products, setProducts] = useState([])
//   const router = useRouter()
//   const getAllProduct = async () => {
//     try {
//       const res = await fetch(`/api/products`, {
//         method: "GET",
//       })

//       const data = await res.json();
//       setProducts(data);

//     } catch (error) {
//       console.log("products_GET", error);

//     }finally{
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     getAllProduct();
//   }, [])

//   const handleExportToExcel = async () => {
//     // Create a new worksheet from the vendor data
//     const ws = await XLSX.utils.json_to_sheet(products);

//     // Create a new workbook and add the worksheet
//     const wb = await XLSX.utils.book_new();
//     await XLSX.utils.book_append_sheet(wb, ws, "Products");
//     // Generate an Excel file and download it
//     await XLSX.writeFile(wb, "products.xlsx");

//   };
//   return loading? <Loader/>: (
//     <>
//       <div className='p-10'>
//         <div className='flex justify-between items-center'>
//           <div className='flex flex-col gap-2'>
//             <div className='flex gap-4 items-center'>
//               <p className='text-heading2-bold text-black'>Products</p>
//               <p className='px-2 shadow-lg bg-gray-200 rounded-lg'>{products.length}</p>
//             </div>
//             <div>
//               <Button className='hover:text-blue-700 px-0' type='button' onClick={() => handleExportToExcel()}>
//                 <FileDown />
//                 <span>Export</span>
//               </Button>
//               <Button className='hover:text-blue-700' type='button'>
//                 <FileUp />
//                 <span>Import</span>
//               </Button>
//             </div>

//           </div>
//           <Button type='button' onClick={() => router.push('/products/add-product')} className='bg-blue-600  px-4 py-2 rounded-lg text-white hover:shadow-lg hover:bg-blue-800'>+Add product</Button>
//         </div>
//         <div className='flex'>
//                         <Button className="">All products</Button>
//                         <Button>Publish</Button>
//                         <Button>UnPublish</Button>
//                 </div>
//         <hr className='my-10' />
//         <DataTable columns={ProductColumns} data={products} hiddenSearchInput={false} searchKey='name' />

//       </div>
//     </>
//   )
// }

// export default Products


import { Metadata } from "next";
import { DataTable } from "@/components/custom ui/DataTable";
import { ProductColumns } from "@/components/products/ProductColumns";
import { ProductActions } from "@/components/products/ProductActions";
// Lấy tất cả sản phẩm từ server
async function getAllProducts() {
  const res = await fetch(`${process.env.INTERNAL_API_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data;
}
// Metadata of the page
export const generateMetadata = async (): Promise<Metadata> => {
  const products = await getAllProducts();
  return {
    title: `Products | Admin Dashboard`,
    description: `List of (${products.length} products).`,
  };
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  if (!products.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <h1 className="text-2xl font-bold">No products found!</h1>
      </div>
    );
  }
  else return (
    <div className="p-6">
      {/* Header */}  
        <div className="flex flex-col gap-2 w-full">
          {/* Title and quantity */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-black">Products</h1>
            <span className="px-2 py-1 text-lg font-semibold bg-gray-200 rounded-lg shadow">
              {products.length}
            </span>
          </div>
          {/* Actions */}
          <ProductActions products={products} />
        </div>
      <hr className="my-4" />
      {/* Table vendor */}
      <DataTable columns={ProductColumns} data={products} hiddenSearchInput={false} searchKey="name" />
    </div>
  );
}
