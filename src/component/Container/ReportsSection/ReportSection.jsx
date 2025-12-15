import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchReport } from "../../../store/slice/reportSlice"
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import {
    ShoppingBag,
    Users,
    Package,
    Tag,
    TrendingUp,
    DollarSign,
    Calendar,
    Award,
    ShoppingCart,
    BarChart3,
    Percent,
    Filter,
    X
} from 'lucide-react'
import Image from "../../../common/Image"
import { getSubCategory } from "../../../store/slice/subCategorySlice"
import { getBrands } from "../../../store/slice/brandsSlice"
import SingleSelectDropdown from "../../../common/SingleSelectDropdown"
import { useRef } from "react";

const ReportSection = () => {
    const dispatch = useDispatch()
    const pdfRef = useRef();
    const [filterType, setFilterType] = useState('month')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        categoryId: '',
        brandId: '',
        granularity: '',
        last30: false,
        startDate: '',
        endDate: ''
    })
    const { reportData: data, loading } = useSelector((state) => state.report)
    const { allSubCategories, } = useSelector((state) => state.subcategory);
    const { allBrands, } = useSelector(
        (state) => state.brands
    );

    useEffect(() => {
        dispatch(getSubCategory())
        dispatch(getBrands())
    }, [dispatch])

    useEffect(() => {
        const payload = {
            filterType,
            ...filters
        }
        Object.keys(payload).forEach(key => {
            if (payload[key] === '' || payload[key] === false) {
                delete payload[key]
            }
        })
        dispatch(fetchReport(payload))
    }, [dispatch, filterType, filters])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const resetFilters = () => {
        setFilters({
            categoryId: '',
            brandId: '',
            granularity: '',
            last30: false,
            startDate: '',
            endDate: ''
        })
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const downloadPDF = () => {
        const doc = new jsPDF("p", "pt", "a4");
        let y = 40;

        doc.setFontSize(20);
        doc.text("Store Dashboard Report", 40, y);
        y += 40;

        doc.setFontSize(16);
        doc.text("Store Overview", 40, y);
        y += 20;

        autoTable(doc, {
            startY: y,
            head: [[
                "Total Revenue",
                "Total Orders",
                "Active Products",
                "Active Categories",
                "Active Sub Categories",
                "Active Brands",
                "Total Customers"
            ]],
            body: [[
                `₹${data?.summary?.totalRevenue || 0}`,
                data?.summary?.totalOrders || 0,
                data?.summary?.activeProducts || 0,
                data?.summary?.activeCategories || 0,
                data?.summary?.activeSubCategories || 0,
                data?.summary?.activeBrands || 0,
                data?.summary?.totalCustomers || 0
            ]],
            theme: "grid",
            styles: {
                fontSize: 10,
                cellPadding: 8,
                halign: "center"
            },
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: 255
            }
        });

        y = doc.lastAutoTable.finalY + 40;

        // ===== Best Selling Products Section =====
        doc.setFontSize(16);
        doc.text("Best Selling Products", 40, y);
        y += 15;

        const totalSold =
            data?.bestSellingProducts?.reduce(
                (sum, item) => sum + item.totalSold,
                0
            ) || 0;

        doc.setFontSize(10);
        doc.text(`Total Products Sold: ${totalSold}`, 40, y);
        y += 15;

        const tableData = (data?.bestSellingProducts || []).map(item => {
            const productName = item.product?.name || "N/A";
            const variantName =
                item.product?.isVariant && item.product?.variants?.length > 0
                    ? item.product.variants[0]?.name
                    : null;

            const displayName = variantName
                ? `${productName} (${variantName})`
                : productName;

            return [
                displayName,
                item.totalSold || 0,
                `₹${item.revenue || 0}`
            ];
        });

        autoTable(doc, {
            startY: y,
            head: [["Product Name", "Sold", "Revenue"]],
            body: tableData,
            theme: "grid",
            styles: { fontSize: 11, cellPadding: 6 },
            columnStyles: {
                0: { halign: "left" },
                1: { halign: "center" },
                2: { halign: "center" }
            },
            headStyles: { fillColor: [59, 130, 246], textColor: 255 }
        });

        doc.save("dashboard.pdf");
    };


    const getProductImage = (product) => {
        if (product.productImages && product.productImages.length > 0) {
            return product.productImages[0]
        }
        if (product.variants && product.variants.length > 0 && product.variants[0].variantImages) {
            return product.variants[0].variantImages[0]
        }
        return null
    }

    const revenueChartData = data?.graph?.map(item => ({
        date: formatDate(item.date),
        revenue: item.revenue,
        orders: item.orders
    })) || []

    const brandSalesData = data?.brandWiseSales?.map((brand, index) => ({
        name: brand.brandName,
        value: brand.revenue,
        fill: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]
    })) || []

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    {payload?.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.name === 'revenue' ? `₹${entry.value}` : entry.value}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6" ref={pdfRef}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Overview of your store performance</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={downloadPDF}
                        className="px-4 py-2 bg-red-600 text-sm  cursor-pointer text-white rounded-lg hover:bg-red-700"
                    >
                        Export PDF
                    </button>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                        <option value="day">Day</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Filter size={16} />
                        Filters
                        {(filters.categoryId || filters.brandId || filters.last30 || filters.startDate) && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                !
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={resetFilters}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                            <SingleSelectDropdown
                                label="category"
                                options={allSubCategories}
                                value={filters.categoryId}
                                onChange={(val) => handleFilterChange('categoryId', val)}
                                searchable={true}
                            />
                        </div>
                        <div>
                            <SingleSelectDropdown
                                label="Brands"
                                options={allBrands}
                                value={filters.brandId}
                                onChange={(val) => handleFilterChange('brandId', val)}
                                searchable={true}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quick Filters
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleFilterChange('last30', !filters.last30)}
                                    className={`px-3 py-1 text-sm rounded ${filters.last30 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                >
                                    Last 30 Days
                                </button>
                                <button
                                    onClick={() => {
                                        const today = new Date().toISOString().split('T')[0]
                                        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                        handleFilterChange('startDate', lastWeek)
                                        handleFilterChange('endDate', today)
                                        handleFilterChange('last30', false)
                                    }}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Last 7 Days
                                </button>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Custom Date Range
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <span className="flex items-center">to</span>
                                <div className="flex-1">
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Active Filters
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {filters.categoryId && (
                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        Category: {allSubCategories.find(c => c._id === filters.categoryId)?.name || 'Selected'}
                                        <button
                                            onClick={() => handleFilterChange('categoryId', '')}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {filters.brandId && (
                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                        Brand: {allBrands.find(b => b._id === filters.brandId)?.name || 'Selected'}
                                        <button
                                            onClick={() => handleFilterChange('brandId', '')}
                                            className="ml-1 text-green-600 hover:text-green-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {filters.last30 && (
                                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                        Last 30 Days
                                        <button
                                            onClick={() => handleFilterChange('last30', false)}
                                            className="ml-1 text-yellow-600 hover:text-yellow-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {filters.startDate && filters.endDate && (
                                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                        {filters.startDate} to {filters.endDate}
                                        <button
                                            onClick={() => {
                                                handleFilterChange('startDate', '')
                                                handleFilterChange('endDate', '')
                                            }}
                                            className="ml-1 text-purple-600 hover:text-purple-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {!filters.categoryId && !filters.brandId && !filters.last30 && !filters.startDate && (
                                    <span className="text-gray-500 text-sm">No filters applied</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">₹{data?.summary?.totalRevenue || 0}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-600 text-sm">This month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <DollarSign className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{data?.summary?.totalOrders || 0}</p>
                            <div className="flex items-center mt-2">
                                <ShoppingCart className="h-4 w-4 text-blue-500 mr-1" />
                                <span className="text-blue-600 text-sm">All time orders</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <ShoppingBag className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Products</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{data?.summary?.activeProducts || 0}</p>
                            <div className="flex items-center mt-2">
                                <Package className="h-4 w-4 text-orange-500 mr-1" />
                                <span className="text-orange-600 text-sm">In stock</span>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Package className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Customers</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{data?.summary?.totalCustomers || 0}</p>
                            <div className="flex items-center mt-2">
                                <Users className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-600 text-sm">Registered users</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Users className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Revenue & Orders</h2>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-500" />
                            {filters.granularity && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {filters.granularity}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="h-80 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                                <YAxis
                                    stroke="#666"
                                    fontSize={12}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Brand Sales</h2>
                        <Award className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={brandSalesData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ₹${entry.value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {brandSalesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {allBrands?.map((brand, index) => (
                            <div key={brand._id} className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: brandSalesData[index]?.fill || '#8884d8' }}
                                    />
                                    <span className="text-sm text-gray-700">{brand.brandName}</span>
                                </div>
                                <span className="font-semibold text-gray-800">₹{brand.revenue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Best Selling Products</h2>
                        <TrendingUp className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        {data?.bestSellingProducts?.map((item) => {
                            const product = item.product
                            const image = getProductImage(product)
                            const price = product.variants?.length > 0
                                ? product.variants[0].offerPrice || product.variants[0].price
                                : product.offerPrice || product.price

                            return (
                                <div key={item._id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className=" mr-4">
                                        {image ? (
                                            <Image
                                                src={`${image}`}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Package className="h-6 w-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-medium text-gray-800 truncate w-80">{product.name}</h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm text-gray-600">₹{price}</span>
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold text-green-600 mr-2">
                                                    ₹{item.revenue}
                                                </span>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    {item.totalSold} sold
                                                </span>
                                            </div>
                                        </div>
                                        {product.variants?.length > 0 && (
                                            <div className="mt-2">
                                                <span className="text-xs text-gray-500">
                                                    {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                        <ShoppingCart className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        {data?.recentOrders?.slice(0, 3).map((order) => (
                            <div key={order._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-medium text-gray-800">{order.orderId}</span>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.placedAt).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Product {item.productId?.slice(-6)}...
                                                </span>
                                                {item.variant && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                                                            {item.variant.name}
                                                        </span>
                                                        {item.variant.type && (
                                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {item.variant.type}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-800">
                                                    {item.quantity} × ₹{item.price}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Total: ₹{item.quantity * item.price}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                    <div>
                                        <span className="text-sm text-gray-600">Payment:</span>
                                        <span className={`ml-2 text-sm font-medium ${order.paymentStatus === 'paid'
                                            ? 'text-green-600'
                                            : 'text-yellow-600'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">
                                        ₹{order.totalAmount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Store Overview</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <Tag className="h-5 w-5 text-gray-500 mr-2" />
                                <span className="text-gray-700">Active Categories</span>
                            </div>
                            <span className="font-bold text-gray-800">{data?.summary?.activeCategories || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <Award className="h-5 w-5 text-gray-500 mr-2" />
                                <span className="text-gray-700">Active Brands</span>
                            </div>
                            <span className="font-bold text-gray-800">{data?.summary?.activeBrands || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <Percent className="h-5 w-5 text-gray-500 mr-2" />
                                <span className="text-gray-700">Sub Categories</span>
                            </div>
                            <span className="font-bold text-gray-800">{data?.summary?.activeSubCategories || 0}</span>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Monthly Sales Performance</h2>
                        <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.monthWiseSales || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="_id"
                                    stroke="#666"
                                    fontSize={12}
                                    label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                                />
                                <YAxis
                                    stroke="#666"
                                    fontSize={12}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip formatter={(value, name) => [
                                    name === 'totalRevenue' ? `₹${value}` : value,
                                    name === 'totalRevenue' ? 'Revenue' : 'Orders'
                                ]} />
                                <Legend />
                                <Bar
                                    dataKey="totalRevenue"
                                    name="Revenue"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="totalOrders"
                                    name="Orders"
                                    fill="#10b981"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportSection