import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, memo } from "react";
import { Upload, X } from "lucide-react";
import CommonPopup from "../../../common/CommonPopup";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import Image from "../../../common/Image";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";

import {
    createOffer,
    updateOffer,
    getOffers,
    clearOfferMessage,
    clearOfferError
} from "../../../store/slice/offersSlice";

const CreateOffer = ({ isModalOpen, setIsModalOpen, upDateData, setUpdateData }) => {
    const dispatch = useDispatch();
    const { loadingCreate, createOfferSuccessmsg, createOfferErrorsmsg } =
        useSelector((state) => state.offers);

    const [form, setForm] = useState({
        title: "",
        description: "",
        percentage: "",
        startDate: "",
        endDate: "",
        status: 1,
        offerImages: [],
        previewImages: [],
    });

    useEffect(() => {
        if (upDateData) {
            console.log(upDateData);

            setForm({
                title: upDateData?.title || "",
                description: upDateData?.description || "",
                percentage: upDateData?.percentage || "",
                startDate: upDateData?.startDate?.slice(0, 10) || "",
                endDate: upDateData?.endDate?.slice(0, 10) || "",
                status: upDateData?.status || 1,
                offerImages: [],
                previewImages: upDateData?.offerPhoto || [],
            });
        } else resetForm();
    }, [upDateData]);

    useEffect(() => {
        if (createOfferSuccessmsg) {
            successAlert(createOfferSuccessmsg);
            dispatch(getOffers());
            handleClose();
            dispatch(clearOfferMessage());
        }

        if (createOfferErrorsmsg) {
            errorAlert(createOfferErrorsmsg);
            dispatch(clearOfferError());
        }
    }, [createOfferSuccessmsg, createOfferErrorsmsg, dispatch]);

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            percentage: "",
            startDate: "",
            endDate: "",
            status: 1,
            offerImages: [],
            previewImages: [],
        });
        setUpdateData?.(null);
    };

    const handleClose = () => {
        resetForm();
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusToggle = () => {
        setForm((prev) => ({
            ...prev,
            status: prev.status === 1 ? 2 : 1,
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const previews = files.map((file) => URL.createObjectURL(file));

        setForm((prev) => ({
            ...prev,
            offerImages: [...prev.offerImages, ...files],
            previewImages: [...prev.previewImages, ...previews],
        }));
    };

    const removeImage = (index) => {
        setForm((prev) => {
            const newImages = [...prev.offerImages];
            const newPreview = [...prev.previewImages];

            newImages.splice(index, 1);
            newPreview.splice(index, 1);

            return { ...prev, offerImages: newImages, previewImages: newPreview };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.title.trim()) return warningAlert("Title is required");
        if (!form.percentage) return warningAlert("Discount percentage is required");
        if (!form.startDate) return warningAlert("Start date is required");
        if (!form.endDate) return warningAlert("End date is required");

        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("percentage", form.percentage);
        fd.append("startDate", form.startDate);
        fd.append("endDate", form.endDate);
        fd.append("status", form.status);

        form.offerImages.forEach((img) => fd.append("offerPhoto", img));

        if (upDateData) {
            dispatch(updateOffer({ slug: upDateData._id, formData: fd }));
        } else {
            dispatch(createOffer(fd));
        }
    };

    return (
        <CommonPopup
            isOpen={isModalOpen}
            onClose={handleClose}
            title={upDateData ? "Update Offer" : "Create Offer"}
        >
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                encType="multipart/form-data"
            >
                <InputField
                    type="text"
                    name="title"
                    placeholder="Offer Title"
                    value={form.title}
                    onChange={handleChange}
                />

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <InputField
                    type="number"
                    name="percentage"
                    placeholder="Discount Percentage"
                    value={form.percentage}
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

                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Upload className="w-4 h-4" />
                        Offer Images (Max 5)
                    </label>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                        <input
                            id="offer-img-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />

                        <label
                            htmlFor="offer-img-upload"
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
                                        alt="offer-img"
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

                <div className="flex items-center gap-4">
                    <span>Status:</span>
                    <div
                        onClick={handleStatusToggle}
                        className={`w-14 h-7 rounded-full p-1 cursor-pointer flex items-center ${form.status === 1 ? "bg-green-500" : "bg-gray-400"
                            }`}
                    >
                        <div
                            className={`bg-white rounded-full w-5 h-5 transform transition-all ${form.status === 0 ? "translate-x-7" : "translate-x-0"
                                }`}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="submit" loading={loadingCreate}>
                        {upDateData ? "Update" : "Create"}
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

export default memo(CreateOffer);
