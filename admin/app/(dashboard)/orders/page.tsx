import { DataTable } from "@/components/custom ui/DataTable";
import { OrderColumns } from "@/components/orders/OrderColumns";


const Orders = async () => {
  const res = await fetch("http://localhost:4000/api/orders", {
    method: "GET",
  });

  const orders = await res.json();
  // console.log(orders);

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center  mb-4'>
        <p className='text-heading2-bold'>Orders</p>
        
      </div>
      <DataTable columns={OrderColumns} data={orders} hiddenSearchInput={false} searchKey="_id" />
    </div>
  )
}

export default Orders