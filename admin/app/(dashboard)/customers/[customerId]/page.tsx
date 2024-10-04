import { DataTable } from "@/components/custom ui/DataTable";


const page = async ({ params }: { params: { customerId: string } }) => {
    const res = await fetch(`${process.env.ADMIN_URL}/api/customers/${params.customerId}`, {
        method: 'GET',
    })
    const ordersByCustomerId = await res.json();
    console.log(ordersByCustomerId);

    return (
        <div>
            <p className="text-heading2-bold">List order</p>
        </div>
    )
}

export default page