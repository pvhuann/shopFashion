import { DataTable } from "@/components/custom ui/DataTable";
import { CustomerColumns } from "@/components/customers/CustomerColumns";


const Customers = async() => {
  const res= await fetch(`${process.env.ADMIN_URL}/api/customers`, {
    method: "GET",
  })

  const customers= await res.json();
  // console.log(customers);
  
  return (
    <div className='p-10'>
      <p className="text-heading2-bold">Customer</p>
      <DataTable columns={CustomerColumns} data={customers} hiddenSearchInput={false} searchKey="name" />
    </div>
  )
}

export default Customers