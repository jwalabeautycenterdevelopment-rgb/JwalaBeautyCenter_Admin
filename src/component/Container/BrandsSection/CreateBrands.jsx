import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, memo } from "react";
import { Upload, X } from "lucide-react";
import CommonPopup from "../../../common/CommonPopup";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import Image from "../../../common/Image";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";
import { createBrand, updateBrand, getBrands, clearBrandMessage, clearBrandError } from "../../../store/slice/brandsSlice";

const CreateBrands = ({ isModalOpen, setIsModalOpen, upDateData, setUpdateData }) => {

    const dispatch = useDispatch();
    const { loadingCreate, createBrandSuccessmsg, createBrandErrorsmsg } = useSelector(
        (state) => state.brands
    );

    const [form, setForm] = useState({
        name: "",
        description: "",
        status: 1,
        brandLogo: null,
        coverImage: null,
        previewBrandLogo: null,
    });

    useEffect(() => {
        if (upDateData) {
            setForm({
                name: upDateData?.name || "",
                description: upDateData?.description || "",
                status: typeof upDateData?.status !== "undefined" ? upDateData?.status : 1,
                brandLogo: null,
                coverImage: null,
                previewBrandLogo: upDateData?.logo || upDateData?.brandLogo || null,
            });
        } else {
            resetForm();
        }
    }, [upDateData]);

    useEffect(() => {
        if (createBrandSuccessmsg) {
            successAlert(createBrandSuccessmsg);
            dispatch(getBrands());
            handleClose();
            dispatch(clearBrandMessage());
        }
        if (createBrandErrorsmsg) {
            errorAlert(createBrandErrorsmsg);
            dispatch(clearBrandError());
        }
    }, [createBrandSuccessmsg, createBrandErrorsmsg, dispatch]);

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            status: 1,
            brandLogo: null,
            coverImage: null,
            previewBrandLogo: null,
        });
        setUpdateData?.(null);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusToggle = () => {
        setForm((prev) => ({ ...prev, status: prev.status === 1 ? 0 : 1 }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        if (field === "brandLogo") {
            setForm((prev) => ({ ...prev, brandLogo: file, previewBrandLogo: url }));
        }
    };

    const removePreview = (field) => {
        if (field === "brandLogo") {
            setForm((prev) => ({ ...prev, brandLogo: null, previewBrandLogo: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name?.trim()) return warningAlert("Name is required");
        if (!form.description?.trim()) return warningAlert("Description is required");

        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("status", String(form.status));

        if (form.brandLogo) fd.append("brandLogo", form.brandLogo);

        if (upDateData) {
            dispatch(updateBrand({ slug: upDateData.slug, formData: fd }));
        } else {
            dispatch(createBrand(fd));
        }
    };

    return (
        <CommonPopup
            isOpen={isModalOpen}
            onClose={handleClose}
            title={upDateData ? "Update Brand" : "Create Brand"}
        >
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-4">
                <InputField
                    type="text"
                    name="name"
                    placeholder="Brand name"
                    value={form.name}
                    onChange={handleChange}
                />

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-pink-400"
                        placeholder="Short description"
                    />
                </div>
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Upload className="w-4 h-4" />
                        Brand Logo
                    </label>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50">
                        <input
                            id="brand-logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "brandLogo")}
                            className="hidden"
                        />
                        <label htmlFor="brand-logo-upload" className="cursor-pointer flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Click to upload brand logo</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG — recommended square</p>
                        </label>
                    </div>
                    {form?.previewBrandLogo && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                            <div className="relative group">
                                <Image
                                    src={form.previewBrandLogo}
                                    alt="brand-logo"
                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removePreview("brandLogo")}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-medium text-sm text-gray-700">Status:</span>
                    <div
                        onClick={handleStatusToggle}
                        className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${form.status === 1 ? "bg-green-500" : "bg-gray-300"}`}
                    >
                        <div className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${form.status === 1 ? "translate-x-7" : "translate-x-0"}`} />
                    </div>
                    <span className="text-sm">{form.status === 1 ? "Active" : "Inactive"}</span>
                </div>
                <div className="flex justify-end gap-2 mt-2">
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

export default memo(CreateBrands);
