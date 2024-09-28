'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
interface dataSalesPerMonth{
    name: string;
    sales: number;
}
const SalesChart = ({data}: {data:dataSalesPerMonth[]}) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                className='w-full h-full'
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <Line type='monotone' dataKey='sales' stroke='#8884d8' />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default SalesChart