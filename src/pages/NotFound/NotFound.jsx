import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <motion.h1
                className="text-9xl font-bold text-gray-800 mb-6 rotate-continuous"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                404
            </motion.h1>
            <motion.p
                className="text-2xl text-gray-600 mb-4"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                Oops! The page you're looking for doesn't exist.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Link
                    to="/"
                    className="px-6 py-2 text-md text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200"
                >
                    Go Back to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
