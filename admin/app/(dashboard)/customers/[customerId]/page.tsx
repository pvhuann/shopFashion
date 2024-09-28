import { DataTable } from "@/components/custom ui/DataTable";


const page = async ({ params }: { params: { customerId: string } }) => {
    const res = await fetch(`http://localhost:4000/api/customers/${params.customerId}`, {
        method: 'GET',
    })
    const ordersByCustomerId = await res.json();
    console.log(ordersByCustomerId);

    return (
        <div>
            
        </div>
    )
}

export default page