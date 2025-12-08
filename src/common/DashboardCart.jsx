"use client";

import { useState } from "react";
import {  TrendingUpDown } from "lucide-react";

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
                    {
                        
                    }
                    <Icon className="w-4 h-4" />
                </div>
            </div>
        </Card>
    );
}

export function SalesOverview() {
    const [filter, setFilter] = useState("month");

    const dayData = [
        { month: "Mon", sales: 12 },
        { month: "Tue", sales: 18 },
        { month: "Wed", sales: 10 },
        { month: "Thu", sales: 15 },
        { month: "Fri", sales: 20 },
        { month: "Sat", sales: 25 },
        { month: "Sun", sales: 22 },
    ];

    const weekData = [
        { month: "W1", sales: 140 },
        { month: "W2", sales: 160 },
        { month: "W3", sales: 120 },
        { month: "W4", sales: 170 },
    ];

    const monthData = [
        { month: "Jan", sales: 65 },
        { month: "Feb", sales: 78 },
        { month: "Mar", sales: 90 },
        { month: "Apr", sales: 81 },
        { month: "May", sales: 56 },
        { month: "Jun", sales: 55 },
        { month: "Jul", sales: 40 },
    ];

    const salesData =
        filter === "day" ? dayData : filter === "week" ? weekData : monthData;

    const maxSales = Math.max(...salesData.map((d) => d.sales));

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
                    {["day", "week", "month"].map((type) => (
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
            <div className="space-y-4">
                <div className="flex items-end justify-between h-32 pt-4">
                    {salesData.map((data) => (
                        <div key={data.month} className="flex flex-col items-center flex-1">
                            <div className="text-xs text-slate-500 mb-2">{data.month}</div>
                            <div
                                className="w-6 bg-linear-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-300"
                                style={{ height: `${(data.sales / maxSales) * 80}%` }}
                            ></div>
                            <div className="text-xs font-medium text-slate-700 mt-1">{data.sales}</div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-slate-600">Sales Volume</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
