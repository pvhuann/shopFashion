import { DataTable } from "@/components/custom ui/DataTable";
import { OrderItemColumns } from "@/components/orderItems/OrderItemColumns";


const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
    const res = await fetch(`http:localhost:4000/api/orders/${params.orderId}`, {
        method: 'GET',
    })

    const { orderDetails, customer } = await res.json();
    const { streetName, city, state, country, postalCode } = orderDetails.shippingAddress;

    return (
        <div className="p-5 flex flex-col gap-4">
            <div className="text-heading2-bold">OrderDetails</div>
            <div className="flex flex-col gap-2">
                <p className="text-base-bold">
                    Order Id: <span className="text-base-medium">{orderDetails._id}</span>
                </p>
                <p className="text-base-bold">
                    Customer name: <span className="text-base-medium">{customer.name}</span>
                </p>
                <p className="text-base-bold">
                    Shipping Address: <span className="text-base-medium">{streetName?? "null"}, {city}, {state}, {country}, {postalCode}</span>
                </p>
                <p className="text-base-bold">
                    Total Amount: <span className="text-base-medium">{orderDetails.totalAmount}</span>
                </p>
                <p className="text-base-bold">
                    Shipping rate Id: <span className="text-base-medium">{orderDetails.shippingRate}</span>
                </p>
            </div>
            <DataTable columns={OrderItemColumns} data={orderDetails.products} hiddenSearchInput={true} searchKey=""/>
        </div>
    )
}

export default OrderDetails