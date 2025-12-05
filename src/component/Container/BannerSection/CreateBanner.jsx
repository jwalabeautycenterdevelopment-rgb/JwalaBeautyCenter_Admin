import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, memo } from "react";
import CommonPopup from "../../../common/CommonPopup";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";
import { createBanner, getBanner, updateBanner } from "../../../store/slice/bannerSlice";
import Image from "../../../common/Image";
import { formatDate } from "../../../utils/formatDate";

const AddBanner = ({ isModalOpen, setIsModalOpen, upDateData, setUpdateData }) => {
    const dispatch = useDispatch();
    const { loadingCreate, createSuccessMsg, createErrorMsg } = useSelector((state) => state.banner);

    const [formData, setFormData] = useState({
        header: "",
        description: "",
        startDate: "",
        endDate: "",
        priority: 1,
        bannerImage: [],
        imagePreview: [],
        isActive: true,
    });
    useEffect(() => {
        if (upDateData) {
            setFormData({
                header: upDateData.header || "",
                description: upDateData.description || "",
                startDate: formatDate(upDateData.startDate),
                endDate: formatDate(upDateData.endDate),
                priority: upDateData.priority || 1,
                bannerImage: [],
                imagePreview: upDateData?.bannerImage
                    ? Array.isArray(upDateData.bannerImage)
                        ? upDateData.bannerImage
                        : [upDateData.bannerImage]
                    : [],
                isActive: upDateData.isActive ?? true,
            });
        } else {
            setFormData({
                header: "",
                description: "",
                startDate: "",
                endDate: "",
                priority: 1,
                bannerImage: [],
                imagePreview: [],
                isActive: true,
            });
        }
    }, [upDateData]);


    useEffect(() => {
        if (createSuccessMsg) {
            successAlert(createSuccessMsg);
            setIsModalOpen(false);
            dispatch(getBanner());
            setFormData({
                header: "",
                description: "",
                startDate: "",
                endDate: "",
                priority: 1,
                bannerImage: [],
                imagePreview: [],
                isActive: true,
            });
            setUpdateData(null);
        }
        if (createErrorMsg) {
            errorAlert(createErrorMsg);
        }
    }, [createSuccessMsg, createErrorMsg]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusToggle = () => {
        setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            bannerImage: [...prev.bannerImage, ...files],
            imagePreview: [...prev.imagePreview, ...files.map((file) => URL.createObjectURL(file))],
        }));
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            bannerImage: prev.bannerImage.filter((_, i) => i !== index),
            imagePreview: prev.imagePreview.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.startDate || !formData.endDate) return warningAlert("Start and End dates are required");

        const dataToSend = new FormData();
        dataToSend.append("header", formData.header);
        dataToSend.append("description", formData.description);
        dataToSend.append("startDate", formData.startDate);
        dataToSend.append("endDate", formData.endDate);
        dataToSend.append("priority", formData.priority);
        dataToSend.append("isActive", formData.isActive);
        formData.bannerImage.forEach((file) => dataToSend.append("bannerImage", file));
        if (upDateData) {
            dispatch(updateBanner({ id: upDateData._id, formData: dataToSend }));
        } else {
            dispatch(createBanner(dataToSend));
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setFormData({
            header: "",
            description: "",
            startDate: "",
            endDate: "",
            priority: 1,
            bannerImage: [],
            imagePreview: [],
            isActive: true,
        });
        setUpdateData(null);
    };

    return (
        <CommonPopup isOpen={isModalOpen} onClose={handleClose} title={upDateData ? "Update Banner" : "Add Banner"}>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-2">
                <InputField type="text" name="header" placeholder="Enter banner header" value={formData.header} onChange={handleChange} />

                <div className="flex flex-col">
                    <label className="font-medium text-xs text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter banner description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition"
                    />
                </div>

                <div className="flex justify-between gap-2">
                    <InputField type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="text-xs px-2 py-1" />
                    <InputField type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="text-xs px-2 py-1 placeholder:text-xs" />
                </div>

                <div className="flex justify-between items-center gap-4">
                    <InputField type="number" name="priority" value={formData.priority} onChange={handleChange} min={1} />
                    <div className="flex items-center gap-3 mt-6">
                        <span className="font-medium text-xs text-gray-700">Status:</span>
                        <div
                            onClick={handleStatusToggle}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.isActive ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-0"}`} />
                        </div>
                        <span className="text-sm">{formData.isActive ? "Active" : "Inactive"}</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="font-medium text-xs text-gray-700 mb-1">Banner Images</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-2 p-4 border-2 border-dotted border-gray-300" />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {formData.imagePreview.map((src, idx) => (
                            <div key={idx} className="relative">
                                <Image src={src} className="w-24 h-24 object-cover rounded-md border" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="submit" loading={loadingCreate}>
                        {upDateData ? "Update" : "Create"}
                    </Button>
                    <Button type="button" onClick={handleClose} className="bg-gray-200 text-gray-700">
                        Cancel
                    </Button>
                </div>
            </form>
        </CommonPopup>
    );
};

export default memo(AddBanner);
