import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Search,
    Filter,
    Mail,
    Phone,
    Calendar,
    MapPin,
    CheckCircle,
    XCircle,
    User,
    Package
} from "lucide-react";
import MainLayout from "../../../common/MainLayout";
import { getAllUsers } from "../../../store/slice/usersSlice";

const UserSection = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const filteredUsers = users?.filter((user) => {
        const matchesSearch =
            search === "" ||
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.mobile.includes(search);

        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "active" && user.status === 1) ||
            (filterStatus === "inactive" && user.status === 0);

        return matchesSearch && matchesStatus;
    }) || [];

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt) - new Date(a.createdAt);
            case "oldest":
                return new Date(a.createdAt) - new Date(b.createdAt);
            case "name":
                return a.firstName.localeCompare(b.firstName);
            default:
                return 0;
        }
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === sortedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(sortedUsers.map((user) => user._id));
        }
    };

    const handleStatusToggle = (userId, currentStatus) => {
        console.log(`Toggling status for user ${userId} from ${currentStatus}`);
    };

    const getStatusBadge = (status) => {
        return status === 1 ? (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                <CheckCircle size={12} />
                Active
            </span>
        ) : (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                <XCircle size={12} />
                Inactive
            </span>
        );
    };

    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={(e) => setSearch(e)}
            subtitle="Manage and view all registered users"
            itemsCount={sortedUsers.length}
        >
            <div className="p-6 space-y-6">
                <div className="flex justify-end gap-4 px-4 rounded-lg md:flex-row md:items-center">
                    <div className="flex gap-2">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">By Name</option>
                        </select>
                    </div>
                </div>
                {selectedUsers?.length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-800">
                                {selectedUsers?.length} user(s) selected
                            </p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded hover:bg-blue-200">
                                    Export Selected
                                </button>
                                <button className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200">
                                    Delete Selected
                                </button>
                                <button
                                    onClick={() => setSelectedUsers([])}
                                    className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="overflow-hidden bg-white  rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 px-6 py-3">
                                        <input
                                            type="checkbox"
                                            checked={
                                                sortedUsers.length > 0 &&
                                                selectedUsers.length === sortedUsers.length
                                            }
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Orders
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <User className="w-12 h-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-500">
                                                    No users found
                                                </p>
                                                {search && (
                                                    <p className="text-xs text-gray-400">
                                                        Try adjusting your search or filters
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedUsers.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user._id)}
                                                    onChange={() => handleSelectUser(user._id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className=" w-10 h-10">
                                                        <img
                                                            src={user.profileImage}
                                                            alt={user.firstName}
                                                            className="object-cover w-10 h-10 rounded-full"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src =
                                                                    "https://ui-avatars.com/api/?name=" +
                                                                    encodeURIComponent(user.firstName) +
                                                                    "&background=random";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {user._id.substring(0, 8)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-900">
                                                        <Mail size={14} />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Phone size={14} />
                                                        {user.mobile}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.myOrders?.length > 0
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    <Package size={14} className="mr-1" />
                                                    {user.myOrders?.length || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.shippingAddress?.length > 0 ? (
                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                        <MapPin size={14} />
                                                        Address saved
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">
                                                        No address
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(user.status)}
                                                    <button
                                                        onClick={() =>
                                                            handleStatusToggle(user._id, user.status)
                                                        }
                                                        className="p-1 text-gray-400 hover:text-gray-600"
                                                        title="Toggle status"
                                                    >
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {sortedUsers.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
                            <div className="text-sm text-gray-700">
                                Showing{" "}
                                <span className="font-medium">{sortedUsers.length}</span> of{" "}
                                <span className="font-medium">{users?.totalUsers || 0}</span>{" "}
                                users
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                                    Previous
                                </button>
                                <button className="px-3 py-1 text-sm text-white bg-blue-600 border rounded hover:bg-blue-700">
                                    1
                                </button>
                                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default UserSection;