import { DataTable } from "@/components/custom ui/DataTable";
import { OrderColumns } from "@/components/orders/OrderColumns";


const Orders = async () => {
  const res = await fetch(`${process.env.ADMIN_URL}/api/orders`, {
    method: "GET",
  });
  const orders = await res.json();

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
// export const dynamic = "force-dynamic";
