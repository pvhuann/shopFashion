import { format } from "date-fns";
import { getOrdersByCustomerId } from "@/lib/actions/actions";
import { auth } from "@clerk/nextjs/server";
import OrderItem from "@/components/orders/OrderItem";

const Orders = async () => {
    const { userId } = auth();
    const orders = await getOrdersByCustomerId(userId as string);
    console.log(orders);
    

    return (
        <div className="px-10 py-5 max-sm:px-3">
            <p className="text-heading3-bold mt-10 max-md:mt-4 mb-2">Your Orders</p>
            <hr />
            {!orders ||
                (orders.length === 0 && (
                    <p className="text-body-bold my-5">You have no orders yet.</p>
                ))}
            <div className="flex flex-col gap-10">
                {orders?.map((order: OrderType) => (
                    <div className="flex flex-col gap-8 p-4 hover:bg-grey-1">
                        <div className="flex gap-20 max-md:flex-col max-md:gap-3">
                            <p className="text-base-bold">Order ID: {order._id}</p>
                            <p className="text-base-bold">
                                Total Amount: ${order.totalAmount}
                            </p>
                            <p className="text-base-bold">Created At : {format(order.createdAt, "HH:mm:ss MMM do, yyyy")}</p>
                        </div>

                        <div className="flex flex-col gap-5">
                            {order.products.map((orderItem: OrderItemType) => (
                                <OrderItem orderItem={orderItem}/>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
export const dynamic = "force-dynamic";