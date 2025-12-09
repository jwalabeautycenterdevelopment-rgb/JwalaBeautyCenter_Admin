"use client";
import { useEffect, useState } from "react";
import { TrendingUpDown } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { fetchAdminDashboard } from "../store/slice/dashboardSlice";
import { useDispatch } from "react-redux";

export function SalesOverview({ salesDataset }) {
    const dispatch = useDispatch();
    const [filter, setFilter] = useState("month");
    useEffect(() => {
        dispatch(fetchAdminDashboard({ sales: filter }));
    }, [filter])

    const salesMapData = salesDataset.map((item) => ({
        month: item.label,
        sales: item.totalRevenue,
    }));
    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Sales Overview</h3>
                    <p className="text-sm text-slate-500 capitalize">
                        {filter}ly sales performance
                    </p>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-1">
                    {["day", "week", "month"]?.map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1 rounded-md text-sm transition-all ${filter === type
                                ? "bg-white shadow text-slate-800 font-medium"
                                : "text-slate-600"
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesMapData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#colorSales)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}


export function Card({ children, className = "" }) {
    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 ${className}`}>
            {children}
        </div>
    );
}

export function StatCard({ title, value, hint, icon: Icon, color }) {
    return (
        <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xs font-medium text-slate-600">{title}</h3>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                    <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <TrendingUpDown className="w-3 h-3 text-green-500" />
                        {hint}
                    </p>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
        </Card>
    );
}