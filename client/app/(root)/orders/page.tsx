// import OrderItem from '@/components/OrderItem';
// import { getOrdersByCustomerId, getProductDetails } from '@/lib/actions/actions'
// import { auth } from '@clerk/nextjs/server';
// import Image from 'next/image';
// import React from 'react'

// const Orders = async () => {
//     const { userId } = auth()
//     const orders = await getOrdersByCustomerId(userId as string);
//     console.log("orders:__", orders[0]);
//     // const product1= await getProductDetails();
//     // console.log(orders[0].products[0].product ?? "ok");
    

//     return (
//         <div className='px-10'>
//             <p className='text-heading2-bold mt-10'>Orders</p>
//             <hr />
//             {!orders || orders.length === 0 && (
//                 <p className='text-body-semibold mt-10'>You have no order!</p>
//             )}

//             <div className='flex flex-col gap-6 mt-6'>
//                 {orders?.map((order: OrderType, index: number) => (
//                         <div className='flex flex-col gap-4' key={index}>
//                             <p className='text-base-bold'>Order {index + 1}</p>
//                             <p>Total: {order.totalAmount}</p>
//                             <p>ID: {order._id}</p>
//                             <div>
//                                 {  Promise.all(order.products.map((item:OrderItemType)=> (
//                                     <div key={item._id}>
//                                         {/* <OrderItem item={item}/> */}
//                                         <Image
//                                             src={item.product.collections?.[0].image}
//                                             // src={'https://res.cloudinary.com/dti2tnjem/image/upload/v1725893207/q927td8ecqjgwey0npql.jpg'}
//                                             width={200}
//                                             height={200}
//                                             alt='product'
//                                         />
//                                         <p>{item.color}</p>
//                                         <p>{item.size}</p>
//                                         <p>{item.quantity}</p>
//                                         <p>{item.product.price?? 0}</p>
//                                     </div>
//                                 )))}
//                             </div>

                            
//                         </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default Orders



import OrderItem from "@/components/OrderItem";
import { getOrdersByCustomerId } from "@/lib/actions/actions";
import { auth } from "@clerk/nextjs/server";
const Orders = async () => {
    const { userId } = auth();
    const orders = await getOrdersByCustomerId(userId as string);

    // console.log(orders[0].products);

    return (
        <div className="px-10 py-5 max-sm:px-3">
            <p className="text-heading3-bold my-10">Your Orders</p>
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
                        </div>

                        <div className="flex flex-col gap-5">
                            {order.products.map((orderItem: OrderItemType) => (
                                // <div className="flex gap-4">
                                //     <Image
                                //         src={orderItem.product.media?.[0]}
                                //         alt={orderItem.product.title}
                                //         width={100}
                                //         height={100}
                                //         className="w-32 h-32 object-cover rounded-lg"
                                //     />
                                //     <div className="flex flex-col justify-between">
                                //         <p className="text-small-medium">
                                //             Title:{" "}
                                //             <span className="text-small-bold">
                                //                 {orderItem.product.title}
                                //             </span>
                                //         </p>
                                //         {orderItem.color && (
                                //             <p className="text-small-medium">
                                //                 Color:{" "}
                                //                 <span className="text-small-bold">
                                //                     {orderItem.color}
                                //                 </span>
                                //             </p>
                                //         )}
                                //         {orderItem.size && (
                                //             <p className="text-small-medium">
                                //                 Size:{" "}
                                //                 <span className="text-small-bold">
                                //                     {orderItem.size}
                                //                 </span>
                                //             </p>
                                //         )}
                                //         <p className="text-small-medium">
                                //             Unit price:{" "}
                                //             <span className="text-small-bold">{orderItem.product.price}</span>
                                //         </p>
                                //         <p className="text-small-medium">
                                //             Quantity:{" "}
                                //             <span className="text-small-bold">{orderItem.quantity}</span>
                                //         </p>
                                //     </div>
                                // </div>
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