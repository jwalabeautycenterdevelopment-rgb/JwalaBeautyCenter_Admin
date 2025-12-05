import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonPopup from "../../../common/CommonPopup";
import { errorAlert, successAlert } from "../../../utils/alertService";
import {
    clearCreateMsg,
    clearUpdateMsg,
    createAdBanner,
    getAdBanner,
    updateAdBanner,
} from "../../../store/slice/adBannerSlice";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import { X, Upload, Eye, EyeOff } from "lucide-react";
import Image from "../../../common/Image";
import { formatDate } from "../../../utils/formatDate";

const AddBannerAds = ({ isModalOpen, setIsModalOpen, upDateData, setUpdateData }) => {
    const dispatch = useDispatch();

    const {
        loadingCreate,
        loadingUpdate,
        createAdSuccessMsg,
        createAdErrorMsg,
        updateAdSuccessMsg,
        updateAdErrorMsg,
    } = useSelector((state) => state.adBanner);

    const [formData, setFormData] = useState({
        adImage: [],
        startDate: "",
        endDate: "",
        imagePreview: [],
        isActive: true,
    });

    const resetForm = () => {
        setFormData({
            adImage: [],
            startDate: "",
            endDate: "",
            imagePreview: [],
            isActive: true,
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            adImage: files,
            imagePreview: files.map(f => URL.createObjectURL(f)),
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            adImage: prev.adImage.filter((_, i) => i !== index),
            imagePreview: prev.imagePreview.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = () => {
        if (!formData.startDate || !formData.endDate) {
            errorAlert("Please fill all required fields");
            return;
        }

        if (!upDateData && formData.adImage.length === 0) {
            errorAlert("Please upload at least one image");
            return;
        }

        const payload = new FormData();
        payload.append("startDate", formData.startDate);
        payload.append("endDate", formData.endDate);
        payload.append("status", formData.isActive ? 1 : 0);

        if (!upDateData) {
            formData.adImage.forEach(file => {
                payload.append("adImage", file);
            });
            dispatch(createAdBanner(payload));
        }

        if (upDateData) {
            if (formData.adImage) {
                payload.append("adImage", formData?.adImage)
            }
            dispatch(updateAdBanner({
                id: upDateData._id,
                formData: payload,
            }));
        }
    };

    useEffect(() => {
        if (upDateData) {
            setFormData({
                adImage: upDateData?.adImage,
                startDate: formatDate(upDateData?.startDate),
                endDate: formatDate(upDateData?.endDate),
                imagePreview: upDateData?.adImage ? [upDateData?.adImage] : [],
                isActive: upDateData?.status === 1 ? true : false,
            });
        }
    }, [upDateData]);

    useEffect(() => {
        if (createAdSuccessMsg) {
            successAlert(createAdSuccessMsg);
            setIsModalOpen(false);
            dispatch(clearCreateMsg());
            dispatch(getAdBanner());
            resetForm();
            setUpdateData(null);
        }

        if (createAdErrorMsg) errorAlert(createAdErrorMsg);

        if (updateAdSuccessMsg) {
            successAlert(updateAdSuccessMsg);
            setIsModalOpen(false);
            dispatch(clearUpdateMsg());
            dispatch(getAdBanner());
            resetForm();
            setUpdateData(null);
        }

        if (updateAdErrorMsg) errorAlert(updateAdErrorMsg);

    }, [createAdSuccessMsg, createAdErrorMsg, updateAdSuccessMsg, updateAdErrorMsg]);

    return (
        <CommonPopup
            title={upDateData ? "Update Ad Banner" : "Create New Ad Banner"}
            isOpen={isModalOpen}
            onClose={() => {
                setIsModalOpen(false);
                resetForm();
                setUpdateData(null);
            }}
            className="max-w-2xl"
        >
            <div className="space-y-6 p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <InputField
                            type="date"
                            name="startDate"
                            value={formData?.startDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <InputField
                            type="date"
                            name="endDate"
                            value={formData?.endDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Upload className="w-4 h-4" />
                        Ad Images * (Max 5 images)
                    </label>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center justify-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                Click to upload images
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, JPEG up to 5MB each
                            </p>
                        </label>
                    </div>
                    {formData?.imagePreview?.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                                Selected Images ({formData?.imagePreview?.length})
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {formData?.imagePreview?.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <Image
                                            src={img}
                                            alt={`preview-${index}`}
                                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between px-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        {formData?.isActive ? (
                            <Eye className="w-5 h-5 text-green-600" />
                        ) : (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Active Status
                            </p>
                            <p className="text-xs text-gray-500">
                                {formData.isActive ? "Banner will be visible" : "Banner will be hidden"}
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData?.isActive}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.2px] after:left-[1.2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <Button
                    loading={loadingCreate || loadingUpdate}
                    disabled={loadingCreate || loadingUpdate}
                    onClick={handleSubmit}
                    className="w-full bg-linear-to-r from-pink-300 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-4  transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                >
                    {upDateData ? (
                        <span className="flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            Update Banner
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2 cursor-pointer">
                            <Upload className="w-4 h-4" />
                            Create Banner
                        </span>
                    )}
                </Button>
            </div>
        </CommonPopup>
    );
};

export default memo(AddBannerAds);