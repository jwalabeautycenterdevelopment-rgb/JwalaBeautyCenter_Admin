import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

const SingleSelectDropdown = ({
    label = "",
    options = [],
    value = "",
    onChange,
    searchable = false
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const filtered = options.filter((opt) =>
            opt.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [search, options]);

    const handleSelect = (id) => {
        onChange(id);
        setOpen(false);
    };

    const selectedItem = options.find((o) => o._id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium mb-1">{label}</label>
            )}
            <div
                className="w-full p-3 border border-pink-300 rounded-lg cursor-pointer 
                flex items-center justify-between bg-white relative"
                onClick={() => setOpen(!open)}
            >
                <span className={value ? "text-gray-900" : "text-gray-400"}>
                    {selectedItem ? selectedItem.name : "Select Category"}
                </span>

                <div className="flex items-center gap-2">
                    {value && (
                        <X
                            size={16}
                            className="text-gray-500 hover:text-red-500 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onChange("");        
                                setSearch("");      
                            }}
                        />
                    )}

                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
            </div>

            {open && (
                <div className="absolute w-full mt-1 bg-white shadow-lg border rounded-lg z-30 max-h-64 overflow-y-auto">

                    {searchable && (
                        <div className="p-2 border-b flex items-center gap-2">
                            <Search size={15} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full outline-none text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    )}

                    {filteredOptions.map((item) => (
                        <div
                            key={item._id}
                            className={`p-3 cursor-pointer hover:bg-pink-50 
                                ${value === item._id ? "bg-pink-100 font-semibold" : ""}`}
                            onClick={() => handleSelect(item._id)}
                        >
                            {item.name}
                        </div>
                    ))}

                    {filteredOptions.length === 0 && (
                        <p className="p-3 text-gray-400 text-sm">No results</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleSelectDropdown;
