import { FaUpload, FaTimes } from "react-icons/fa";
export default function ImageUploadBox({
    label = "Upload Image",
    images = [],
    onChange,
    multiple = true,
    maxImages = 5,
}) {
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images];

        files.forEach((file) => {
            if (newImages.length < maxImages) {
                newImages.push({
                    file,
                    preview: URL.createObjectURL(file),
                });
            }
        });
        onChange(newImages);
    };

    const removeImage = (index) => {
        const updated = images.filter((_, i) => i !== index);
        onChange(updated);
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">{label}</label>

            <div className="flex gap-4 flex-wrap">
                {images.length < maxImages && (
                    <label className="w-32 h-32 border border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer">
                        <FaUpload size={28} />
                        <span className="text-xs mt-1">Upload</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple={multiple}
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>
                )}
                {images.map((img, index) => (
                    <div key={index} className="relative w-32 h-32">
                        <img
                            src={img.preview || img}
                            alt="preview"
                            className="w-full h-full object-cover rounded-lg border"
                        />

                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500">
                {images.length}/{maxImages} images uploaded
            </p>
        </div>
    );
}
