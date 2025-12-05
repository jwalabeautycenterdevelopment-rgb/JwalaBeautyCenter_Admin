"use client";
import { useEffect, useState } from "react";
import { User, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, clearMessage, loginAdmin } from "../../../store/slice/login";
import { errorAlert } from "../../../utils/alertService";

export default function AdminLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, message } = useSelector((state) => state.login);


    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (message) {
            navigate("/");
            dispatch(clearMessage());
        }
    }, [message, navigate]);

    useEffect(() => {
        if (error) {
            errorAlert(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginAdmin(form));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-300 via-white to-pink-200 p-4">
            <div className="w-full max-w-md bg-white/20 backdrop-blur-2xl border border-white/30 shadow-xl rounded-3xl p-6">
                <div className="text-center space-y-2 mb-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-md">
                        <span className="text-xl font-bold text-pink-700">JBC</span>
                    </div>
                    <h2 className="text-xl text-gray-800 drop-shadow-sm">Admin Login</h2>
                    <p className="text-gray-600 text-sm">Sign in to access the dashboard</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="block text-gray-700 font-medium">Email</label>
                        <div className="relative">
                            <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
                            />
                            <input
                                name="email"
                                placeholder="Enter email"
                                value={form?.email}
                                onChange={handleChange}
                                className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 bg-blue-50 text-gray-900 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-gray-700 font-medium">Password</label>
                        <div className="relative">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={form?.password}
                                onChange={handleChange}
                                className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 bg-blue-50 text-gray-900 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-pink-600/80 backdrop-blur-md hover:bg-pink-700 text-white font-medium rounded-xl py-2 shadow-md transition-colors duration-200"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
