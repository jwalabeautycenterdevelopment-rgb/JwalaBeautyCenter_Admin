import { useState, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";

const MultiSelectDropdown = ({
    label = "",
    options = [],
    selected = [],     
    onChange,
    multiple = false,
    searchable = false
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);

    useEffect(() => {
        const filtered = options.filter((opt) =>
            opt._id.toString().includes(search) || opt.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [search, options]);

    const toggleValue = (id) => {
        let updated = [];

        if (multiple) {
            if (selected.includes(id)) {
                updated = selected.filter((v) => v !== id);
            } else {
                updated = [...selected, id];
            }
        } else {
            updated = [id];
            setOpen(false);
        }
        onChange(updated); 
    };

    return (
        <div className="relative w-full">
            {label && <label className="text-sm text-gray-700">{label}</label>}
            <div
                className="border p-2 rounded-md flex items-center justify-between cursor-pointer min-h-[45px] flex-wrap gap-1"
                onClick={() => setOpen(!open)}
            >
                {selected.length === 0 && (
                    <span className="text-gray-400 text-sm">
                        {multiple ? "Select multiple" : "Select one"}
                    </span>
                )}

                {selected.map((id) => {
                    const item = options.find((o) => o._id === id);
                    return (
                        <span
                            key={id}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                        >
                            {item?.name?.slice(0, 20)}
                            <X
                                size={14}
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleValue(id);
                                }}
                            />
                        </span>
                    );
                })}
                <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
            {open && (
                <div className="absolute z-20 bg-white border rounded-md shadow-lg w-full max-h-64 overflow-y-auto mt-1">
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

                    {filteredOptions.length === 0 ? (
                        <p className="text-gray-400 text-sm p-3">No results</p>
                    ) : (
                        filteredOptions.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => toggleValue(item._id)}
                                className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${selected.includes(item._id) ? "bg-blue-50" : ""
                                    }`}
                            >
                                {item.name}
                                {selected.includes(item._id) && (
                                    <span className="text-blue-600 font-bold">✔</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
