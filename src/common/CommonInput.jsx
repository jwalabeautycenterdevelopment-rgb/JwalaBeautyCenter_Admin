const InputField = ({
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    required = false,
    showLabel = true,
}) => {
    return (
        <div>
            {showLabel && name && (
                <label className="block my-2 text-gray-600 capitalize text-xs font-medium text-left">
                    {name.replace(/([A-Z])/g, " $1")}
                    {required && <span className="mr-1">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition"
            />
        </div>
    );
};

export default InputField;
