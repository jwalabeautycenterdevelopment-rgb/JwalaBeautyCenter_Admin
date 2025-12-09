"use client";
import { useEffect } from "react";
import Button from "../../../common/Button";
import { Card, SalesOverview, StatCard } from "../../../common/DashboardCart";
import {
    ShoppingCart,
    Package,
    AlertTriangle,
    MoreHorizontal,
    TrendingUpDown,
    IndianRupee
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../../../store/slice/dashboardSlice";
import { Link, Links } from "react-router-dom";

export default function Dashboard() {
    const { dashboardData } = useSelector((state) => state.adminDashboard);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAdminDashboard());
    }, []);

    const stats = [
        {
            title: "Total Orders",
            value: dashboardData?.totals?.totalOrders?.toString() || "0",
            hint: "Total orders placed",
            icon: ShoppingCart,
            color: "bg-blue-50 text-blue-600",
        },
        {
            title: "Revenue",
            value: `₹${dashboardData?.totals?.totalRevenue?.toString() || "0"}`,
            hint: "Total revenue generated",
            icon: IndianRupee,
            color: "bg-green-50 text-green-600",
        },
        {
            title: "Active Products",
            value: dashboardData?.totals?.activeProducts?.toString() || "0",
            hint: "Products available for sale",
            icon: Package,
            color: "bg-purple-50 text-purple-600",
        },
        {
            title: "Total Customers",
            value: dashboardData?.totals?.totalCustomers?.toString() || "0",
            hint: "Registered customers",
            icon: AlertTriangle,
            color: "bg-amber-50 text-amber-600",
        },
    ];

    const calculateOrderStatus = () => {
        if (!dashboardData?.recentOrders) return [];
        const statusCount = {
            "Pending": 0,
            "Confirmed": 0,
            "Shipped": 0,
            "Delivered": 0
        };

        dashboardData.recentOrders.forEach(order => {
            const status = order.status || "Pending";
            if (statusCount[status] !== undefined) {
                statusCount[status]++;
            }
        });

        return [
            {
                label: "Pending",
                value: statusCount["Pending"],
                color: "bg-yellow-100 text-yellow-800",
                icon: "⏳"
            },
            {
                label: "Confirmed",
                value: statusCount["Confirmed"],
                color: "bg-blue-100 text-blue-800",
                icon: "✅"
            },
            {
                label: "Shipped",
                value: statusCount["Shipped"],
                color: "bg-orange-100 text-orange-800",
                icon: "🚚"
            },
            {
                label: "Delivered",
                value: statusCount["Delivered"],
                color: "bg-emerald-100 text-emerald-800",
                icon: "📦"
            },
        ];
    };

    function OrderStatus() {
        const orderStatus = calculateOrderStatus();
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
                    {orderStatus?.map((s) => (
                        <div key={s.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${s.color.split(" ")[0]}`}></span>
                                <span className="text-sm font-medium text-slate-700">{s.label}</span>
                                <span className="text-xs">{s.icon}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-800">{s.value}</span>
                                <span className="text-xs text-slate-400">
                                    ({totalOrders > 0 ? Math.round((s.value / totalOrders) * 100) : 0}%)
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex h-2 rounded-full bg-slate-100 overflow-hidden">
                        {orderStatus.map((s, index) => (
                            <div
                                key={s.label}
                                className={`${getStatusColor(s.label)}`}
                                style={{ width: totalOrders > 0 ? `${(s.value / totalOrders) * 100}%` : "0%" }}
                            ></div>
                        ))}
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        {orderStatus.map((s) => (
                            <span key={s.label}>{s.label}</span>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    function getStatusColor(status) {
        switch (status) {
            case "Pending": return "bg-yellow-400";
            case "Confirmed": return "bg-blue-500";
            case "Shipped": return "bg-orange-500";
            case "Delivered": return "bg-emerald-500";
            default: return "bg-gray-300";
        }
    }

    function RecentOrdersTable() {
        const recentOrders = dashboardData?.recentOrders || [];

        const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
                case "pending": return "bg-yellow-50 text-yellow-600 border-yellow-200";
                case "confirmed": return "bg-blue-50 text-blue-600 border-blue-200";
                case "shipped": return "bg-orange-50 text-orange-600 border-orange-200";
                case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-200";
                default: return "bg-gray-50 text-gray-600 border-gray-200";
            }
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
        };

        return (
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
                        <p className="text-sm text-slate-500">Latest customer orders</p>
                    </div>
                    <Link to={"/order"} className="px-4 py-2 border text-sm border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
                        View All
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                        recentOrders.slice(0, 3).map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center">
                                        <ShoppingCart className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{order.orderId}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600">{order.shippingAddress?.fullName || "Customer"}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">₹{order.totalAmount}</p>
                                    <p className="text-sm text-slate-500">
                                        {formatDate(order.placedAt || order.createdAt)}
                                    </p>
                                </div>
                                <button className="p-2 hover:bg-slate-200 rounded">
                                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No recent orders</p>
                        </div>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-600 text-md  font-medium mt-2 flex items-center gap-2">
                            Welcome back! Here's your store overview{" "}
                            <motion.span
                                className="inline-block"
                                animate={{ rotate: [0, 20, -20, 20, -20, 0] }}
                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                            >
                                👋
                            </motion.span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to={"/reports"} className="px-4 flex gap-1 items-center py-2.5 border border-slate-200 rounded-lg text-slate-700">
                            <TrendingUpDown className="w-4 h-4" /> View Reports
                        </Link>
                        <Link to={"/products"} className="px-4 py-2 text-sm bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow-lg">
                            Add Product
                        </Link>
                    </div>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats?.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </section>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <SalesOverview
                            salesDataset={dashboardData?.salesData || []}
                        />
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