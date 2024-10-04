
import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSalesPerMonth, getTotalCustomers, getTotalSales } from "@/lib/actions/actions";
import { CircleDollarSign, CircleUser, ShoppingCart } from "lucide-react";

export default async function Home() {
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalCustomers = await getTotalCustomers();
  const graphData = await getSalesPerMonth();
  // console.log("data: ",graphData);
  

  return (
    <div className="p-10">
      <p className="text-heading2-bold">Dashboard</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <CircleDollarSign />
          </CardHeader>
          <CardContent>
            <p className="text-base-bold">$ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingCart />
          </CardHeader>
          <CardContent>
            <p className="text-base-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Customers</CardTitle>
            <CircleUser />
          </CardHeader>
          <CardContent>
            <p className="text-base-bold">{totalCustomers}</p>
          </CardContent>
        </Card>

      </div>

      <Card className="mt-10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Chart</CardTitle>
          <CircleDollarSign />
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData}/>
        </CardContent>
      </Card>
    </div>
  );
}
