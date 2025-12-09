import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, memo } from "react";
import CommonPopup from "../../../common/CommonPopup";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";
import { clearCreateMsg, createBanner, getBanner, updateBanner } from "../../../store/slice/bannerSlice";
import Image from "../../../common/Image";

const AddBanner = ({ isModalOpen, setIsModalOpen, upDateData, setUpdateData }) => {
    const dispatch = useDispatch();
    const { loadingCreate, createSuccessMsg, createErrorMsg } = useSelector((state) => state.banner);

    const [formData, setFormData] = useState({
        header: "",
        colourCode: "#ffffff",
        bannerImage: [],
        imagePreview: [],
        isActive: true,
    });
    useEffect(() => {
        if (upDateData) {
            setFormData({
                header: upDateData.header || "",
                colourCode: upDateData.colourCode || "#ffffff",
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
                colourCode: "#ffffff",
                bannerImage: [],
                imagePreview: [],
                isActive: true,
            });
        }
    }, [upDateData]);



    useEffect(() => {
        if (createSuccessMsg) {
            successAlert(createSuccessMsg);
            dispatch(clearCreateMsg())
            setIsModalOpen(false);
            dispatch(getBanner());
            setFormData({
                header: "",
                colourCode: "",
                bannerImage: [],
                imagePreview: [],
                isActive: true,
            });
            setUpdateData(null);
        }
        if (createErrorMsg) {
            errorAlert(createErrorMsg);
            dispatch(clearCreateMsg())
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
        const dataToSend = new FormData();
        dataToSend.append("header", formData.header);
        dataToSend.append("isActive", formData.isActive);
        dataToSend.append("colourCode", formData.colourCode);
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
            colourCode: "",
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
                    <div className="mt-2">
                        <label className="font-medium text-xs text-gray-700 mb-1 block">Pick Banner Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                name="colorCode"
                                value={formData.colourCode || "#ffffff"}
                                onChange={handleChange}
                                className="w-10 h-10 cursor-pointer rounded border"
                            />
                            <input
                                type="text"
                                name="colourCode"
                                placeholder="#FFFFFF"
                                value={formData.colourCode}
                                onChange={handleChange}
                                className="border p-2 rounded w-32 text-sm"
                            />
                        </div>
                    </div>
                </div>
                {
                    upDateData &&
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
                }
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
