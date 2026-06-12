const IMG_URL = import.meta.env.VITE_API_URL_BASE_IMAGE_URL || "";

const Image = ({ src = "", alt = "image", className = "", style = {} }) => {
  if (typeof src !== "string") {
    return null;
  }

  const isAbsolute =
    src.startsWith("http") ||
    src.startsWith("blob:") ||
    src.startsWith("data:");

  const imageSrc = isAbsolute ? src : `${IMG_URL}${src}`;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        e.currentTarget.src =
          "https://assets.webdads2u.com/images/1778042348274-image-not-found--1-.png";
      }}
    />
  );
};

export default Image;