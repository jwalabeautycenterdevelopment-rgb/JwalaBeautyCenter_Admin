import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    AiOutlineDashboard,
    AiOutlineSetting
} from "react-icons/ai";
import { MdAddPhotoAlternate, MdOutlineProductionQuantityLimits, MdPersonSearch } from "react-icons/md";
import {
    LuFolder,
    LuFolders,
    LuGitBranch,
    LuTag,
    LuPackage,
    LuChevronDown
} from "react-icons/lu";

import logo from "../../../assets/navbar_icon.svg";
import { GiKnightBanner } from "react-icons/gi";
import { FaGift, FaUserCheck } from "react-icons/fa";

const Sidebar = () => {
    const [openCatalog, setOpenCatalog] = useState(true);
    return (
        <aside className="h-screen bg-white shadow-md flex flex-col border-r border-gray-300">
            <div className="flex items-center h-16 border-b border-gray-200 px-4">
                <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-4">
                <nav className="flex flex-col gap-1">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 transition 
                            ${isActive ? "bg-[#dfabb3] text-white" : ""}`
                        }
                    >
                        <AiOutlineDashboard className="text-xl" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/banner"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 
                            ${isActive ? "bg-[#dfabb3] text-white" : ""}`
                        }
                    >
                        <GiKnightBanner className="text-xl" />
                        Banner
                    </NavLink>
                    <button
                        onClick={() => setOpenCatalog(!openCatalog)}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <LuFolder className="text-xl" />
                            Catalog
                        </div>
                        <LuChevronDown
                            className={`transition-transform duration-200 ${openCatalog ? "rotate-180" : ""}`}
                        />
                    </button>
                    {openCatalog && (
                        <div className="ml-8 flex flex-col gap-1 mt-1">
                            <NavLink
                                to="/parent-categories"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-orange-600 
                                    ${isActive ? "text-orange-600 font-medium" : ""}`
                                }
                            >
                                <LuFolders className="text-lg" />
                                Parent Categories
                            </NavLink>
                            <NavLink
                                to="/subcategories"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-orange-600 
                                    ${isActive ? "text-orange-600 font-medium" : ""}`
                                }
                            >
                                <LuGitBranch className="text-lg" />
                                Subcategories
                            </NavLink>
                            <NavLink
                                to="/products"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-orange-600 
                                    ${isActive ? "text-orange-600 font-medium" : ""}`
                                }
                            >
                                <LuPackage className="text-lg" />
                                Products
                            </NavLink>
                        </div>
                    )}
                    {/* <button
                        onClick={() => setOpenType(!openType)}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <LuTag className="text-xl" />
                            Types
                        </div>
                        <LuChevronDown
                            className={`transition-transform duration-200 ${openType ? "rotate-180" : ""}`}
                        />
                    </button>

                    {openType && (
                        <div className="ml-8 flex flex-col gap-1 mt-1">
                            <NavLink
                                to="/type"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-orange-600 
                                    ${isActive ? "text-orange-600 font-medium" : ""}`
                                }
                            >
                                <LuFolder className="text-lg" />
                                Types
                            </NavLink>
                            <NavLink
                                to="/typename"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-orange-600 
                                    ${isActive ? "text-orange-600 font-medium" : ""}`
                                }
                            >
                                <LuGitBranch className="text-lg" />
                                Type Name
                            </NavLink>
                        </div>
                    )} */}
                    <NavLink
                        to="/ad-banner"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 
                            ${isActive ? "bg-[#dfabb3] text-white" : ""}`
                        }
                    >
                        <MdAddPhotoAlternate className="text-xl" />
                        Ad Banner
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 
                            ${isActive ? "bg-[#dfabb3] text-white" : ""}`
                        }
                    >
                        <AiOutlineSetting className="text-xl" />
                        Profile
                    </NavLink>
                    <NavLink
                        to="/order"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 
                            ${isActive ? "bg-[#dfabb3] text-white" : ""}`
                        }
                    >
                        <MdOutlineProductionQuantityLimits className="text-xl" />
                        Order
                    </NavLink>
                    <NavLink
                        to="/offers"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 
                            ${isActive ? "bg-[#dfabb3] text-white" : ""}`
                        }
                    >
                        <FaGift className="text-xl" />
                        Offers
                    </NavLink>
                    <NavLink
                        to="/brands"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 
                            ${isActive ? "bg-[#dfabb3] text-white" : ""}`
                        }
                    >
                        <LuTag className="text-xl" />
                        Brands
                    </NavLink>
                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 
                            ${isActive ? "bg-[#dfabb3] text-white" : ""}`
                        }
                    >
                        <FaUserCheck className="text-xl" />
                        Users
                    </NavLink>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
