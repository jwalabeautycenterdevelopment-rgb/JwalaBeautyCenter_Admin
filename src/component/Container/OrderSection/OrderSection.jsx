import { useEffect, useState } from "react";
import { FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MainLayout from "../../../common/MainLayout";
import { clearAdminOrderError, clearAdminOrderMessage, getAdminOrders, updateOrdersStatus } from "../../../store/slice/OrderSlice";
import { useDispatch, useSelector } from "react-redux";
import { paymentStatusBadge, statusBadge } from "../../../utils/paymentBadge";
import { successAlert, errorAlert } from "../../../utils/alertService";
const ITEMS_PER_PAGE = 10;

const OrderSection = () => {
    const dispatch = useDispatch();
    const { allOrders, error, successMessage } = useSelector((state) => state.order);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        dispatch(getAdminOrders());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            successAlert(successMessage);
            dispatch(getAdminOrders())
            dispatch(clearAdminOrderMessage())
        }
        if (error) {
            errorAlert(error);
            dispatch(clearAdminOrderError())
        }
    }, [successMessage, error]);

    const filteredOrders = Array.isArray(allOrders)
        ? allOrders.filter(order => {
            if (!search.trim()) return true;
            const searchLower = search.toLowerCase();
            return (
                order.orderId?.toLowerCase().includes(searchLower) ||
                order.shippingAddress?.fullName?.toLowerCase().includes(searchLower) ||
                order.userId?.email?.toLowerCase().includes(searchLower) ||
                order._id?.toLowerCase().includes(searchLower)
            );
        })
        : [];


    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const getItemsCount = (order) => {
        return order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    const handlePageChange = (newPage) => {
        setPage(Math.max(1, Math.min(totalPages, newPage)));
    };


    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrdersStatus({ orderId, newStatus }))
    };


    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md text-sm ${page === i
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        <FiChevronLeft />
                    </button>
                    {pages}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        );
    };
    const renderOrderDetails = () => {
        if (!selectedOrder || !isDetailOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Order Details - {selectedOrder.orderId}</h3>
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3">Customer Information</h4>
                                <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.shippingAddress?.fullName}</p>
                                <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.userId?.email}</p>
                                <p className="text-sm"><span className="font-medium">Phone:</span> {selectedOrder.shippingAddress?.phone}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3">Shipping Address</h4>
                                <p className="text-sm">{selectedOrder.shippingAddress?.address}</p>
                                <p className="text-sm">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                                <p className="text-sm">{selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-medium mb-3">Order Items ({getItemsCount(selectedOrder)})</h4>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left p-3 text-sm font-medium">Product</th>
                                            <th className="text-left p-3 text-sm font-medium">Variant</th>
                                            <th className="text-left p-3 text-sm font-medium">Quantity</th>
                                            <th className="text-left p-3 text-sm font-medium">Price</th>
                                            <th className="text-left p-3 text-sm font-medium">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items?.map((item, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-3 text-sm">
                                                    {item.productId?.name || "N/A"}
                                                </td>
                                                <td className="p-3 text-sm">
                                                    {item.variant?.name || item.variant?.type || "Standard"}
                                                    {item.variant?.sku && <div className="text-xs text-gray-500">SKU: {item.variant.sku}</div>}
                                                </td>
                                                <td className="p-3 text-sm">{item.quantity}</td>
                                                <td className="p-3 text-sm">₹{item.price}</td>
                                                <td className="p-3 text-sm font-medium">
                                                    ₹{item.price * item.quantity}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(selectedOrder.status).classes}`}>
                                    {statusBadge(selectedOrder.status).label}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Payment Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusBadge(selectedOrder.paymentStatus).classes}`}>
                                    {paymentStatusBadge(selectedOrder.paymentStatus).label}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Payment Method:</span>
                                <span>{selectedOrder.paymentMethod || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Order Date:</span>
                                <span>{formatDate(selectedOrder.placedAt || selectedOrder.createdAt)}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Total Amount:</span>
                                    <span className="text-xl font-bold">₹{selectedOrder.totalAmount}</span>
                                </div>
                                {selectedOrder.totalDiscountAmount > 0 && (
                                    <div className="flex justify-between items-center text-sm text-green-600">
                                        <span>Discount Applied:</span>
                                        <span>- ₹{selectedOrder.totalDiscountAmount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={setSearch}
            subtitle="Manage your main Order"
            itemsCount={filteredOrders.length}
        >
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-x-auto my-10">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">OrderID</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Customer</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Items</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Amount</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Payment</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">OrderStatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOrders?.length > 0 ? (
                            paginatedOrders?.map((order) => {
                                const status = statusBadge(order.status);
                                const paymentStatus = paymentStatusBadge(order.paymentStatus);

                                return (
                                    <tr key={order._id} className="border-t border-gray-300 hover:bg-gray-50">
                                        <td className="p-3 text-xs font-medium">{order.orderId}</td>
                                        <td className="p-3 text-sm">
                                            <div>{order.shippingAddress?.fullName}</div>
                                            <div className="text-xs text-gray-500">{order.userId?.email}</div>
                                        </td>
                                        <td className="p-3 text-sm">{getItemsCount(order)}</td>
                                        <td className="p-3 text-sm">{formatDate(order.placedAt || order.createdAt)}</td>
                                        <td className="p-3 text-sm font-medium">₹{order.totalAmount}</td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatus.classes}`}>
                                                {paymentStatus.label}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="p-2 rounded-md border hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                                title="View Order"
                                            >
                                                <FiEye />
                                            </button>
                                        </td>
                                        <td>
                                            <select
                                                value={order?.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {renderPagination()}
            {renderOrderDetails()}
        </MainLayout>
    );
};
export default OrderSection;