import { DataTable } from "@/components/custom ui/DataTable";
import { OrderColumns } from "@/components/orders/OrderColumns";


const page = async ({ params }: { params: { customerId: string } }) => {
    const res = await fetch(`${process.env.ADMIN_URL}/api/customers/${params.customerId}`, {
        method: 'GET',
    })
    const ordersByCustomerId = await res.json();
    console.log(ordersByCustomerId);

    return (
        <div className="p-10">
            <div className="pb-6">
                <p className="text-heading2-bold">List order of {ordersByCustomerId.name}</p>
                <hr />
            </div>
            <DataTable columns={OrderColumns} data={ordersByCustomerId} />
        </div>
    )
}

export default page