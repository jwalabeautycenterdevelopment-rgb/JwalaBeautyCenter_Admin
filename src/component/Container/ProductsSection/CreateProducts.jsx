import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUpload, FaTimes } from "react-icons/fa";
import { getSubCategory } from "../../../store/slice/subCategorySlice";
import { getBrands } from "../../../store/slice/brandsSlice";
import Image from "../../../common/Image";
import { warningAlert } from "../../../utils/alertService";

const ProductForm = ({ onSubmit, backNavigation, formData, loading }) => {
    const dispatch = useDispatch();
    const { allSubCategories } = useSelector((state) => state.subcategory);
    const { allBrands } = useSelector((state) => state.brands);
    const [tagInput, setTagInput] = useState("");
    const [isShowVariant, setIsShowVariant] = useState(false)




    const [variantInput, setVariantInput] = useState({
        shade: "",
        finish: "",
        size: "",
        price: "",
        discountPrice: "",
        stock: "",
        description: ""
    });

    console.log(variantInput);


    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        category: "",
        brand: "",
        tags: [],
        images: [],
        isBestSeller: false,
        isNewArrival: false,
        expiryDate: "",
        variants: [],
        metaTitle: "",
        metaDescription: ""
    });

    useEffect(() => {
        if (form?.variants?.length > 0) {
            setIsShowVariant(true);
        }
    }, [form?.variants]);


    const handleShow = () => {
        if (form?.images?.length > 0) {
            warningAlert("You cannot add variants if you have already added normal product details. Please use one option.");
            return;
        }
        setIsShowVariant(!isShowVariant);
    };



    useEffect(() => {
        dispatch(getSubCategory());
        dispatch(getBrands());
    }, [dispatch]);

    useEffect(() => {
        if (formData) {
            setForm({
                name: formData?.name || "",
                description: formData?.description || "",
                price: formData?.price || "",
                discountPrice: formData?.discountPrice || "",
                stock: formData?.stock || "",
                category: formData?.category?._id || "",
                brand: formData?.brand?._id || "",
                tags: Array.isArray(formData?.tags) ? formData?.tags : [],
                images: Array.isArray(formData?.images) ? formData?.images : [],
                isBestSeller: !!formData?.isBestSeller,
                isNewArrival: !!formData?.isNewArrival,
                expiryDate: formData?.expiryDate?.slice(0, 10) || "",
                variants: Array.isArray(formData?.variants)
                    ? formData?.variants.map(v => ({
                        variantId: v?._id || "",
                        shade: v?.shade || "",
                        finish: v?.finish || "",
                        size: v?.size || "",
                        price: v?.price?.toString() || "",
                        discountPrice: v?.discountPrice?.toString() || "",
                        stock: v?.stock?.toString() || "",
                        description: v?.description
                    }))
                    : []
            });
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleAddVariant = () => {
        if (!variantInput.shade?.trim() || !variantInput.size?.trim() || !variantInput.price) {
            alert("Shade, Size and Price are required for a variant!");
            return;
        }

        setForm(prev => ({
            ...prev,
            variants: [...prev.variants, { ...variantInput }]
        }));

        setVariantInput({
            shade: "",
            finish: "",
            size: "",
            price: "",
            discountPrice: "",
            stock: "",
            description: ""
        });
    };

    const handleVariantChange = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            variants: prev.variants.map((v, i) =>
                i === index ? { ...v, [field]: value } : v
            )
        }));
    };

    const handleRemoveVariant = (index) => {
        setForm(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
            setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag) => {
        setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.slice(0, 5 - form.images.length);
        if (validFiles.length < files.length) {
            alert(`Only ${5 - form.images.length} more images can be added.`);
        }
        setForm(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
    };

    const handleRemoveImage = (index) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", form.name);
        formDataToSubmit.append("description", form.description);
        formDataToSubmit.append("price", form.price);
        formDataToSubmit.append("discountPrice", form.discountPrice || "");
        formDataToSubmit.append("stock", form.stock);
        formDataToSubmit.append("category", form.category);
        formDataToSubmit.append("brand", form.brand);
        formDataToSubmit.append("isBestSeller", form.isBestSeller);
        formDataToSubmit.append("isNewArrival", form.isNewArrival);
        formDataToSubmit.append("expiryDate", form.expiryDate);
        formDataToSubmit.append("metaTitle", form.metaTitle);
        formDataToSubmit.append("metaDescription", form.metaDescription);
        formDataToSubmit.append("variants", JSON.stringify(form.variants));
        form.tags.forEach(tag => formDataToSubmit.append("tags[]", tag));

        form.images.forEach(image => {
            if (image instanceof File) {
                formDataToSubmit.append("images", image);
            }
        });

        if (formData) {
            const existingImages = form.images.filter(img => typeof img === "string");
            existingImages.forEach(url => formDataToSubmit.append("existingImages", url));
        }

        onSubmit(formDataToSubmit);
    };

    return (
        <div className="bg-white p-6 text-gray-800 min-h-screen">
            <div className="flex gap-3 items-center mb-6">
                <IoMdArrowRoundBack
                    size={24}
                    className="cursor-pointer hover:text-pink-600"
                    onClick={backNavigation}
                />
                <h2 className="text-2xl font-bold">
                    {formData ? "Update Product" : "Add New Product"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={form?.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter product name"
                            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category *</label>
                        <select
                            name="category"
                            value={form?.category}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                        >
                            <option value="">Select Category</option>
                            {allSubCategories?.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Discount Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form?.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price *</label>
                        <input
                            type="number"
                            name="discountPrice"
                            value={form?.discountPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={form?.stock}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand *</label>
                        <select
                            name="brand"
                            value={form?.brand}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                        >
                            <option value="">Select Brand</option>
                            {allBrands?.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={form?.expiryDate}
                            onChange={handleChange}
                            className="w-full p-3 border  border-pink-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form?.description}
                        onChange={handleChange}
                        placeholder="Enter your description..."
                        className="w-full p-2 border border-pink-300  focus:outline-none  rounded-lg focus:ring-pink-500 focus:outline-0"
                        rows={6}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Product Images (Max 5)</label>
                    <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center">
                        <input
                            type="file"
                            id="images"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={form?.images.length >= 5}
                        />
                        <label
                            htmlFor="images"
                            className={`block cursor-pointer ${form?.images.length >= 5 ? "opacity-50" : "hover:bg-gray-50"}`}
                        >
                            <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                            <p className="text-gray-600">Click to upload or drag & drop</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {form?.images.length}/5 images • PNG, JPG, WEBP
                            </p>
                        </label>
                    </div>


                    {form?.images?.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                            {form?.images?.map((img, i) => (
                                <div key={i} className="relative group">
                                    <Image
                                        src={img instanceof File ? URL.createObjectURL(img) : img}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded-lg focus:ring-pink-500 focus:outline-0 border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(i)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-end items-center gap-2">
                    <h3 className="text-lg font-semibold">Product Variants</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={isShowVariant}
                            onChange={handleShow}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.2px] after:left-[1.2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>
                {
                    isShowVariant &&
                    <div className="border-gray-300">
                        <div className="space-y-4 mb-8">
                            {form?.variants?.map((variant, index) => (
                                <div
                                    key={index}
                                    className="p-5 border border-gray-200 rounded-lg focus:ring-pink-500 focus:outline-0 bg-gray-50 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariant(index)}
                                        className="absolute top-3 right-3 text-red-600 hover:bg-red-100 rounded-full p-2"
                                    >
                                        <FaTimes size={18} />
                                    </button>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Shade *"
                                            value={variant?.shade}
                                            onChange={(e) => handleVariantChange(index, "shade", e.target.value)}
                                            className="p-3 border border-gary-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Finish"
                                            value={variant?.finish}
                                            onChange={(e) => handleVariantChange(index, "finish", e.target.value)}
                                            className="p-3 border border-gary-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Size *"
                                            value={variant?.size}
                                            onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                                            className="p-3 border border-gary-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price *"
                                            value={variant?.price}
                                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                            className="p-3 border border-gary-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Discount Price"
                                            value={variant?.discountPrice}
                                            onChange={(e) => handleVariantChange(index, "discountPrice", e.target.value)}
                                            className="p-3 border border-gary-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={variant?.stock}
                                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                                            className="p-3 border border-gary-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                        />

                                    </div>
                                    <div className="mt-2">
                                        <textarea
                                            name="description"
                                            value={variant?.description}
                                            onChange={(e) => handleVariantChange(index, "description", e.target.value)}
                                            placeholder="Enter your description..."
                                            className="w-full p-2 border border-pink-300  focus:outline-none  rounded-lg focus:ring-pink-500 focus:outline-0"
                                            rows={4}
                                        ></textarea>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-2 border-dashed border-pink-300 rounded-xl bg-pink-50">
                            <h4 className="font-medium text-pink-800 mb-4">Add New Variant</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    placeholder="Name *"
                                    value={variantInput?.shade}
                                    onChange={(e) => setVariantInput(prev => ({ ...prev, shade: e.target.value }))}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                />


                                <input
                                    type="text"
                                    placeholder="Finish"
                                    value={variantInput?.finish}
                                    onChange={(e) => setVariantInput(prev => ({ ...prev, finish: e.target.value }))}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                />
                                <input
                                    type="text"
                                    placeholder="Size *"
                                    value={variantInput?.size}
                                    onChange={(e) => setVariantInput(prev => ({ ...prev, size: e.target.value }))}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                />
                                <input
                                    type="number"
                                    placeholder="Price *"
                                    value={variantInput?.price}
                                    onChange={(e) => setVariantInput(prev => ({ ...prev, price: e.target.value }))}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                />
                                <input
                                    type="number"
                                    placeholder="Discount Price"
                                    value={variantInput?.discountPrice}
                                    onChange={(e) => setVariantInput(prev => ({ ...prev, discountPrice: e.target.value }))}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={variantInput?.stock}
                                    onChange={(e) => setVariantInput(prev => ({ ...prev, stock: e.target.value }))}
                                    className=" border border-gray-300 rounded-lg ps-2 focus:ring-pink-500 focus:outline-0"
                                />
                            </div>
                            <textarea
                                name="description"
                                value={variantInput?.description}
                                onChange={(e) => setVariantInput(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter description"
                                rows={4}
                                className="w-full p-2 my-3 border border-pink-300  focus:outline-none  rounded-lg focus:ring-pink-500 focus:outline-0"
                            ></textarea>
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="w-full py-3  bg-pink-600 cursor-pointer text-white  rounded-lg focus:ring-pink-500 focus:outline-0 hover:bg-pink-700 font-medium"
                            >
                                + Add This Variant
                            </button>
                        </div>
                        {form?.variants?.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No variants added yet.</p>
                        )}
                    </div>
                }
                <div className="flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isBestSeller"
                            checked={form?.isBestSeller}
                            onChange={handleChange}
                            className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <span className="font-medium">Mark as Best Seller</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isNewArrival"
                            checked={form?.isNewArrival}
                            onChange={handleChange}
                            className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <span className="font-medium">New Arrival</span>
                    </label>
                </div>
                <div className="border-t border-gray-300"></div>
                <div>
                    <label className="block text-sm font-medium  mb-2">Tags</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                            placeholder="Type tag and press Enter or Add"
                            className="flex-1 p-3 border border-pink-300 rounded-lg focus:ring-pink-500 focus:outline-0"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-6 py-3 bg-pink-600 cursor-pointer  text-white rounded-lg focus:ring-pink-500 focus:outline-0 hover:bg-pink-700"
                        >
                            Add Tag
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {form?.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-300 text-pink-800 rounded-full text-sm font-medium"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1 hover:text-pink-900 cursor-pointer"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <textarea
                        name="metaDescription"
                        value={form?.metaDescription}
                        onChange={handleChange}
                        placeholder="Enter your description..."
                        className="w-full p-2 border border-pink-300  focus:outline-none  rounded-lg focus:ring-pink-500 focus:outline-0"
                        rows={4}
                    ></textarea>
                </div>

                <div className="flex justify-end gap-4 pt-8  border-gray-300">
                    <button
                        type="button"
                        onClick={backNavigation}
                        className="px-8 py-3 border border-gray-300 rounded-lg cursor-pointer focus:ring-pink-500 focus:outline-0 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-pink-600 text-white rounded-lg cursor-pointer focus:ring-pink-500 focus:outline-0 hover:bg-pink-700 disabled:opacity-50 font-medium transition"
                    >
                        {loading ? "Saving..." : formData ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default memo(ProductForm);