import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { useLocation } from "react-router-dom";

const MainLayout = ({
    itemsCount,
    title = "",
    subtitle = "",
    buttonName = "",
    onButtonClick = () => { },
    children,
    className = "",
    InputOnChange = () => { },
    Inputvalue = ""
}) => {
    const location = useLocation();
    const displayTitle = title || location.pathname
        .replace("/", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className={` ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    {displayTitle && (
                        <h2 className="text-lg lg:text-3xl font-bold text-gray-700">
                            {displayTitle}
                            <span>({itemsCount})</span>
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
                {buttonName && (
                    <button
                        onClick={onButtonClick}
                        className="px-4 py-2 rounded-md bg_pink text-xs lg:text-sm font-medium text-white flex items-center lg:gap-2 transition cursor-pointer"
                    >
                        <AiOutlinePlus className="w-4 h-4" />
                        {buttonName}
                    </button>
                )}
            </div>
            <div className={`relative w-full ${className}`}>
                <AiOutlineSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={Inputvalue}
                    onChange={(e) => InputOnChange(e.target.value)}
                    placeholder={`Search ${displayTitle}`}
                    className="lg:w-120 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:none text-sm"
                />
            </div>
            <div className="mt-2">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
