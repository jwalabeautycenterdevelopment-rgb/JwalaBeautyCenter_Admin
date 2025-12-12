import { useDispatch, useSelector } from "react-redux";
import CommonPopup from "../../../common/CommonPopup";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";
import { memo, useEffect, useState } from "react";
import { createParentCategory, getParentCategory, updateParentCategory } from "../../../store/slice/parentCategorySlice";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import { Upload, X } from "lucide-react";
import Image from "../../../common/Image";

const AddParentCategori = ({ isModalOpen, setIsModalOpen, upDateData, setUpdateData }) => {
    const dispatch = useDispatch();
    const { loadingCreate, createCategorySuccessmsg, createCategoryErrorsmsg } = useSelector(
        (state) => state.parentCategory
    );

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        imagePreview: null,
        categoryImage: null
    });


    useEffect(() => {
        if (upDateData) {
            setFormData({
                name: upDateData?.name || "",
                slug: upDateData?.slug || "",
                categoryImage: null,
                imagePreview: upDateData?.image || null,
                description: upDateData?.description || ""
            });
        } else {
            setFormData({ name: "", slug: "", description: "" });
        }
    }, [upDateData]);

    useEffect(() => {
        if (createCategorySuccessmsg) {
            successAlert(createCategorySuccessmsg);
            setIsModalOpen(false);
            dispatch(getParentCategory());
            setFormData({ name: "", slug: "", description: "" });
            setUpdateData(null)
        }
        if (createCategoryErrorsmsg) {
            errorAlert(createCategoryErrorsmsg);
        }
    }, [createCategorySuccessmsg, createCategoryErrorsmsg]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            categoryImage: files,
            imagePreview: files.map(f => URL.createObjectURL(f)),
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            const formattedName = value
            setFormData((prev) => ({
                ...prev,
                name: formattedName,
                slug: formattedName.toLowerCase().replace(/\s+/g, "-")
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData?.name) return warningAlert("Name is required");
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("slug", formData.slug);
        payload.append("description", formData.description || "");

        if (formData.categoryImage?.length > 0) {
            formData.categoryImage.forEach(file => {
                payload.append("categoryImage", file);
            });
        }

        if (upDateData) {
            dispatch(updateParentCategory({
                id: upDateData._id,
                formData: payload
            }));
        } else {
            dispatch(createParentCategory(payload));
        }
    };


    return (
        <CommonPopup
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={upDateData ? "Update Parent Category" : "Add Parent Category"}
        >
            <form onSubmit={handleSubmit}>
                <InputField
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition"
                    value={formData?.name}
                    onChange={handleChange}
                    required
                />

                <div className="flex flex-col justify-start mt-2">
                    <label htmlFor="" className="text-left text-gray-600">Description</label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        className="w-full border border-gray-300 p-2 rounded-md mt-2 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition"
                        rows={3}
                        value={formData?.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-3 py-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Upload className="w-4 h-4" />
                        Ad Images *
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {formData?.imagePreview && (
                                    <div key={1} className="relative group">
                                        <Image
                                            src={formData?.imagePreview}
                                            alt={`preview-${1}`}
                                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        loading={loadingCreate}
                        type="submit"
                        className="px-4 py-2 text-sm bg_pink font-medium text-white rounded-sm transition cursor-pointer"
                    >
                        {upDateData ? "Update" : "Create"}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            setUpdateData(null)
                            setIsModalOpen(false)
                        }}
                        className="px-4 py-2 bg-gray-200 text-sm font-medium text-gray-700 rounded-sm hover:bg-gray-300 transition cursor-pointer"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </CommonPopup>
    );
};

export default memo(AddParentCategori);
