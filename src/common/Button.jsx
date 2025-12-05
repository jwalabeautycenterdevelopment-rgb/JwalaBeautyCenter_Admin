const Button = ({
    children,
    type,
    onClick,
    className = "",
    loading = false,
    disabled = false
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                px-4 py-2 rounded-md  text-sm 
                 font-medium  transition
                flex items-center justify-center
                ${loading ? "cursor-not-allowed opacity-70" : ""}
                ${className}
            `}
        >
            {loading ? "Loading..." : children}
        </button>
    );
};

export default Button;
