import Customer from "../models/Customer";
import Orders from "../models/Orders";
import { connectToDB } from "../mongoDB"

const getTotalSales = async () => {
    await connectToDB();

    const orders = await Orders.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    return { totalOrders, totalRevenue };
}

const getTotalCustomers = async () => {
    await connectToDB();
    const customers = await Customer.find();
    const totalCustomers = customers.length;
    return totalCustomers;
}

const getSalesPerMonth = async () => {
    await connectToDB();
    const orders = await Orders.find();

    const salesPerMonth = orders.reduce((acc, order) => {
        const monthIndex = new Date(order.createdAt).getMonth(); // 0 for Janruary --> 11 for December
        acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
        // For June
        // acc[5] = (acc[5] || 0) + order.totalAmount (orders have monthIndex 5)
        return acc
    }, {});

    const graphData = Array.from({ length: 12 }, (_, i) => {
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
        // if i === 5 => month = "Jun"
        return { name: month, sales: salesPerMonth[i] || 0 }
    })


    return graphData;
}
export { getTotalSales, getTotalCustomers, getSalesPerMonth }