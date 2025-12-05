const IMG_URL = import.meta.env.VITE_API_URL_BASE_IMAGE_URL || "";
const Image = ({ src = "", alt = "image", className = "", style = {} }) => {
    let imageSrc = src;
    if (typeof src === "string" && !src.startsWith("http") && !src.startsWith("blob:")) {
        imageSrc = `${IMG_URL}${src}`;
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={style}
            onError={(e) => {
                e.target.src = "/fallback.png";
            }}
        />
    );
};

export default Image