import { getProductInOrderItem } from '@/lib/actions/actions'
import Image from 'next/image';


const OrderItem = async ({ orderItem }: { orderItem: OrderItemType }) => {
    const getItem = await getProductInOrderItem(orderItem.product.toString());

    return (
        <div>
            <div className="flex gap-4">
                <Image
                    src={getItem.imageUrl}
                    alt={orderItem.product.title}
                    width={100}
                    height={100}
                    className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between">
                    <p className="text-small-medium">
                        Title:{" "}
                        <span className="text-small-bold">
                            {getItem.title}
                        </span>
                    </p>
                    {orderItem.color && (
                        <p className="text-small-medium">
                            Color:{" "}
                            <span className="text-small-bold">
                                {orderItem.color}
                            </span>
                        </p>
                    )}
                    {orderItem.size && (
                        <p className="text-small-medium">
                            Size:{" "}
                            <span className="text-small-bold">
                                {orderItem.size}
                            </span>
                        </p>
                    )}
                    <p className="text-small-medium">
                        Unit price:{" "}
                        <span className="text-small-bold">${getItem.price}</span>
                    </p>
                    <p className="text-small-medium">
                        Quantity:{" "}
                        <span className="text-small-bold">{orderItem.quantity}</span>
                    </p>
                </div>
            </div>


        </div>
    )
}

export default OrderItem