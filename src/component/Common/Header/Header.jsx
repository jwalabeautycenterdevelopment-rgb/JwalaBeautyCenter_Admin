import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { motion } from "framer-motion";
import { logout } from "../../../store/slice/login";
import { fetchMe } from "../../../store/slice/authme";
import Image from "../../../common/Image";
const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const { adminData } = useSelector((state) => state.authme);

    useEffect(() => {
        if (adminData) {
            dispatch(fetchMe());
        }
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const text = "Admin Panel";
    const letters = text.split("");

    const container = {
        animate: {
            transition: {
                staggerChildren: 0.15,
                repeat: Infinity,
                repeatDelay: 3,
            },
        },
    };

    const letter = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };
    return (
        <header className="w-full h-16 bg-white shadow flex items-center justify-end md:justify-between px-6 border-b border-gray-200 sticky top-0 z-20">
            <motion.div
                className="text-md font-semibold hidden md:flex overflow-hidden text-gray-900"
                variants={container}
                initial="initial"
                animate="animate"
            >
                {letters?.map((letterChar, index) => (
                    <motion.span key={index} variants={letter}>
                        {letterChar === " " ? "\u00A0" : letterChar}
                    </motion.span>
                ))}
            </motion.div>

            <div className="flex items-center gap-4 relative">
                <div className="flex items-center gap-2">
                    <AiOutlineSearch className="text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-green-500"
                    />
                </div>
                <div
                    className="relative"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                >
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center cursor-pointer gap-2 text-gray-700 hover:text-green-600"
                    >
                        <AiOutlineUser className="text-lg" />
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 pt-2 w-52 bg-white border border-gray-300 shadow-md rounded-md py-2 z-10">
                            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">

                                {
                                    adminData?.profilePhoto &&
                                    <Image
                                        src={
                                            adminData?.profilePhoto

                                        }
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border"
                                    />
                                }
                                <div className="text-sm text-gray-700 font-medium capitalize leading-5">
                                    {adminData?.firstName} {adminData?.lastName}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left cursor-pointer px-4 text-sm py-2 text-red-600 hover:bg-red-100 flex items-center gap-2"
                            >
                                <AiOutlineLogout /> Logout
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
};

export default Header;
