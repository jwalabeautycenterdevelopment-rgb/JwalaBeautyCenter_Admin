import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, memo } from "react";
import { Upload, X } from "lucide-react";
import CommonPopup from "../../../common/CommonPopup";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import Image from "../../../common/Image";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";
import { getProducts } from "../../../store/slice/productSlice";
import {
    createDeal,
    updateDeal,
    getDeals,
    clearCreateMsg,
    clearUpdateMsg
} from "../../../store/slice/dealsSlice";

const CreateDeals = ({ isModalOpen, setIsModalOpen, updateData, setUpdateData }) => {
    const dispatch = useDispatch();
    const {
        allProducts,
    } = useSelector((state) => state.product);
    const { loadingCreate, createDealSuccessMsg, createDealErrorMsg, loadingUpdate, updateDealSuccessMsg, updateDealErrorMsg } =
        useSelector((state) => state.deals);


    useEffect(() => {
        dispatch(getProducts())
    }, [])

    const [form, setForm] = useState({
        title: "",
        description: "",
        product: "",
        originalPrice: "",
        dealPrice: "",
        discountPercentage: "",
        startDate: "",
        endDate: "",
        maxQuantity: "",
        priority: 1,
        isFeatured: false,
        dealBanner: [],
        previewImages: [],
    });

    console.log(form);


    useEffect(() => {
        if (updateData && allProducts?.length > 0) {
            const productExists = allProducts.find(
                (p) => p._id === updateData.product?._id
            );
            setForm((prev) => ({
                ...prev,
                title: updateData?.title || "",
                description: updateData?.description || "",
                product: productExists ? updateData.product._id : "",
                originalPrice: updateData?.originalPrice || "",
                dealPrice: updateData?.dealPrice || "",
                discountPercentage: updateData?.discountPercentage || "",
                startDate: updateData?.startDate?.slice(0, 10) || "",
                endDate: updateData?.endDate?.slice(0, 10) || "",
                maxQuantity: updateData?.maxQuantity || "",
                priority: updateData?.priority || 1,
                isFeatured: updateData?.isFeatured || false,
                dealBanner: [],
                previewImages: updateData?.dealBanner || [],
            }));
        }
    }, [updateData, allProducts]);


    useEffect(() => {
        if (createDealSuccessMsg) {
            successAlert(createDealSuccessMsg);
            dispatch(getDeals());
            handleClose();
            dispatch(clearCreateMsg());
        }

        if (createDealErrorMsg) {
            errorAlert(createDealErrorMsg);
            dispatch(clearCreateMsg());
        }

        if (updateDealSuccessMsg) {
            successAlert(updateDealSuccessMsg);
            dispatch(getDeals());
            handleClose();
            dispatch(clearUpdateMsg());
        }

        if (updateDealErrorMsg) {
            errorAlert(updateDealErrorMsg);
            dispatch(clearUpdateMsg());
        }
    }, [createDealSuccessMsg, createDealErrorMsg, updateDealSuccessMsg, updateDealErrorMsg, dispatch]);

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            product: "",
            originalPrice: "",
            dealPrice: "",
            discountPercentage: "",
            startDate: "",
            endDate: "",
            maxQuantity: "",
            priority: 1,
            isFeatured: false,
            dealBanner: [],
            previewImages: [],
        });
        setUpdateData?.(null);
    };

    const handleClose = () => {
        resetForm();
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const previews = files.map((file) => URL.createObjectURL(file));

        setForm((prev) => ({
            ...prev,
            dealBanner: [...prev.dealBanner, ...files],
            previewImages: [...prev.previewImages, ...previews],
        }));
    };

    const removeImage = (index) => {
        setForm((prev) => {
            const newImages = [...prev.dealBanner];
            const newPreview = [...prev.previewImages];

            newImages.splice(index, 1);
            newPreview.splice(index, 1);

            return { ...prev, dealBanner: newImages, previewImages: newPreview };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.title.trim()) return warningAlert("Title is required");
        if (!form.product.trim()) return warningAlert("Product ID is required");
        if (!form.originalPrice) return warningAlert("Original price is required");
        if (!form.dealPrice) return warningAlert("Deal price is required");
        if (!form.discountPercentage) return warningAlert("Discount percentage is required");
        if (!form.startDate) return warningAlert("Start date is required");
        if (!form.endDate) return warningAlert("End date is required");

        const fd = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "dealBanner") {
                value.forEach((img) => fd.append("dealBanner", img));
            } else {
                fd.append(key, value);
            }
        });

        if (updateData) {
            dispatch(updateDeal({ id: updateData._id, formData: fd }));
        } else {
            dispatch(createDeal(fd));
        }
    };

    return (
        <CommonPopup
            isOpen={isModalOpen}
            onClose={handleClose}
            title={updateData ? "Update Deal" : "Create Deal"}
        >
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                encType="multipart/form-data"
            >
                <InputField
                    type="text"
                    name="title"
                    placeholder="Deal Title"
                    value={form.title}
                    onChange={handleChange}
                />
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1 ">
                        Select Product
                    </label>
                    <select
                        name="product"
                        className="border border-gray-300 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition p-2"
                        value={form.product}
                        onChange={handleChange}
                        disabled={!allProducts || allProducts.length === 0}
                    >
                        <option value="">
                            {allProducts?.length === 0 ? "Loading products..." : "Select Product"}
                        </option>
                        {allProducts?.map((prod) => (
                            <option key={prod._id} value={prod._id}>
                                {prod.name.substring(0, 40)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        type="number"
                        name="originalPrice"
                        placeholder="Original Price"
                        value={form.originalPrice}
                        onChange={handleChange}
                    />
                    <InputField
                        type="number"
                        name="dealPrice"
                        placeholder="Deal Price"
                        value={form.dealPrice}
                        onChange={handleChange}
                    />
                </div>

                <InputField
                    type="number"
                    name="discountPercentage"
                    placeholder="Discount Percentage"
                    value={form.discountPercentage}
                    onChange={handleChange}
                />

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                    />
                    <InputField
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                    />
                </div>

                <InputField
                    type="number"
                    name="maxQuantity"
                    placeholder="Max Quantity"
                    value={form.maxQuantity}
                    onChange={handleChange}
                />

                <InputField
                    type="number"
                    name="priority"
                    placeholder="Priority"
                    value={form.priority}
                    onChange={handleChange}
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                    />
                    Featured Deal
                </label>

                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Upload className="w-4 h-4" />
                        Deal Banner Images
                    </label>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                        <input
                            id="deal-banner-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />

                        <label
                            htmlFor="deal-banner-upload"
                            className="cursor-pointer flex flex-col items-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm">Click to upload images</p>
                        </label>
                    </div>

                    {form?.previewImages?.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                            {form?.previewImages?.map((img, index) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={img}
                                        alt="deal-img"
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="submit" loading={loadingCreate || loadingUpdate}>
                        {updateData ? "Update" : "Create"}
                    </Button>
                    <Button
                        type="button"
                        className="bg-gray-200 text-black"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </CommonPopup>
    );
};

export default memo(CreateDeals);
