"use client";
import Button from "../../../common/Button";
import { Card, SalesOverview, StatCard } from "../../../common/DashboardCart";
import {
    ShoppingCart,
    DollarSign,
    Package,
    AlertTriangle,
    MoreHorizontal,
    TrendingUpDown
} from "lucide-react";

const stats = [
    {
        title: "Total Orders",
        value: "3",
        hint: "+12% from last month",
        icon: ShoppingCart,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Revenue",
        value: "$271.94",
        hint: "+8.2% from last month",
        icon: DollarSign,
        color: "bg-green-50 text-green-600",
    },
    {
        title: "Active Products",
        value: "2",
        hint: "2 published",
        icon: Package,
        color: "bg-purple-50 text-purple-600",
    },
    {
        title: "Low Stock Alerts",
        value: "0",
        hint: "Requires attention",
        icon: AlertTriangle,
        color: "bg-amber-50 text-amber-600",
    },
];


const orderStatus = [
    { label: "Pending", value: 1, color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
    { label: "Confirmed", value: 1, color: "bg-blue-100 text-blue-800", icon: "✅" },
    { label: "Shipped", value: 1, color: "bg-orange-100 text-orange-800", icon: "🚚" },
    { label: "Delivered", value: 0, color: "bg-emerald-100 text-emerald-800", icon: "📦" },
];

function OrderStatus() {
    const totalOrders = orderStatus.reduce((sum, s) => sum + s.value, 0);

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Order Status</h3>
                    <p className="text-sm text-slate-500">Current order distribution</p>
                </div>
                <div className="text-sm font-medium text-slate-700">{totalOrders} Total</div>
            </div>

            <div className="space-y-4">
                {orderStatus.map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${s.color.split(" ")[0]}`}></span>
                            <span className="text-sm font-medium text-slate-700">{s.label}</span>
                            <span className="text-xs">{s.icon}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-800">{s.value}</span>
                            <span className="text-xs text-slate-400">
                                ({Math.round((s.value / totalOrders) * 100)}%)
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="bg-yellow-400 w-1/4"></div>
                    <div className="bg-blue-500 w-1/4"></div>
                    <div className="bg-orange-500 w-1/4"></div>
                    <div className="bg-emerald-500 w-1/4 opacity-30"></div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Pending</span>
                    <span>Confirmed</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                </div>
            </div>
        </Card>
    );
}


const recentOrders = [
    {
        id: "JBC-2024-0001",
        customer: "Sarah Johnson",
        amount: "$89.97",
        status: "confirmed",
        statusColor: "bg-blue-50 text-blue-600 border-blue-200",
        date: "2/1/2024",
    },
    {
        id: "JBC-2024-0002",
        customer: "Emily Chen",
        amount: "$124.99",
        status: "shipped",
        statusColor: "bg-orange-50 text-orange-600 border-orange-200",
        date: "2/2/2024",
    },
];

function RecentOrdersTable() {
    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
                    <p className="text-sm text-slate-500">Latest customer orders</p>
                </div>

                <Button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
                    View All
                </Button>
            </div>

            <div className="space-y-4">
                {recentOrders?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-slate-600" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{order.id}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${order.statusColor}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-600">{order.customer}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold">{order.amount}</p>
                            <p className="text-sm text-slate-500">{order.date}</p>
                        </div>

                        <button className="p-2 hover:bg-slate-200 rounded">
                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
}


export default function Dashboard() {
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-600 mt-2 flex items-center gap-2">
                            Welcome back! Here's your store overview 👋
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700">
                            <TrendingUpDown className="w-4 h-4" /> View Reports
                        </Button>

                        <Button className="px-4 py-2.5 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow-lg">
                            <Package className="w-4 h-4" /> Add Product
                        </Button>
                    </div>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats?.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </section>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <SalesOverview />
                    </div>

                    <div>
                        <OrderStatus />
                    </div>
                </section>
                <section>
                    <RecentOrdersTable />
                </section>

            </div>
        </div>
    );
}
