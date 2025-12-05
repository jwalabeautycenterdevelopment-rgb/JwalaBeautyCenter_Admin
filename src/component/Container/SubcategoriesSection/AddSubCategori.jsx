import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, memo } from "react";
import CommonPopup from "../../../common/CommonPopup";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";
import { getParentCategory } from "../../../store/slice/parentCategorySlice";
import { clearCreateMsg, createSubCategory, getSubCategory, updateSubCategory } from "../../../store/slice/subCategorySlice";
import Image from "../../../common/Image";

const AddSubCategori = ({ isModalOpen, setIsModalOpen, upDateData, setUpdateData }) => {
    const dispatch = useDispatch();
    const { getAllCatogory } = useSelector((state) => state.parentCategory);
    const { loadingCreate, createSuccessMsg, createErrorMsg } = useSelector((state) => state.subcategory);


    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        subCategory: null,
        imagePreview: null,
        status: 1,
    });



    useEffect(() => {
        dispatch(getParentCategory());
    }, [dispatch]);

    useEffect(() => {
        if (upDateData) {
            setFormData({
                name: upDateData?.name || "",
                description: upDateData?.description || "",
                category: upDateData?.category?._id || "",
                subCategory: null,
                imagePreview: upDateData?.image || null,
                status: upDateData?.status ?? 1,
            });
        } else {
            setFormData({ name: "", description: "", category: "", subCategory: null, imagePreview: null, status: 1 });
        }
    }, [upDateData]);


    useEffect(() => {
        if (createSuccessMsg) {
            successAlert(createSuccessMsg);
            setIsModalOpen(false);
            dispatch(getSubCategory());
            dispatch(clearCreateMsg())
            setFormData({ name: "", description: "", category: "", subCategory: null, imagePreview: null, status: 1 });
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
        setFormData((prev) => ({ ...prev, status: prev.status === 1 ? 0 : 1 }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                subCategory: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData?.name) return warningAlert("Name is required");
        if (!formData?.category) return warningAlert("Parent category is required");

        const dataToSend = new FormData();
        dataToSend.append("name", formData.name);
        dataToSend.append("description", formData.description);
        dataToSend.append("category", formData.category);
        dataToSend.append("status", formData.status);

        if (formData.subCategory instanceof File) {
            dataToSend.append("subCategory", formData.subCategory);
        }
        if (upDateData) {
            dispatch(updateSubCategory({ id: upDateData.slug, formData: dataToSend }));
        } else {
            dispatch(createSubCategory(dataToSend));
        }
    };



    const handleClose = () => {
        setIsModalOpen(false);
        setFormData({ name: "", description: "", category: "", subCategory: null, imagePreview: null, status: 1 });
        setUpdateData(null);
    };

    return (
        <CommonPopup
            isOpen={isModalOpen}
            onClose={handleClose}
            title={upDateData ? "Update Subcategory" : "Add Subcategory"}
        >
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <InputField
                    type="text"
                    name="name"
                    placeholder="Subcategory Name"
                    value={formData?.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition"
                    required
                />
                <div className="flex flex-col mt-2">
                    <label className="text-gray-600 mb-1">Parent Category</label>
                    <select
                        name="category"
                        value={formData?.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition"
                        required
                    >
                        <option value="">Select parent category</option>
                        {getAllCatogory?.map((cat) => (
                            <option className="w-10" key={cat?._id} value={cat?._id}>{cat?.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col mt-2">
                    <label className="text-gray-600 mb-1">Description</label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData?.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition"
                    />
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <label className="text-gray-600 mb-1">Status</label>
                    <div
                        onClick={handleStatusToggle}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.status === 1 ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.status === 1 ? "translate-x-6" : "translate-x-0"
                                }`}
                        />
                    </div>
                    <span className="ml-2 text-sm">{formData.status === 1 ? "Active" : "Inactive"}</span>
                </div>

                <div className="flex flex-col mt-2">
                    <label className="text-gray-600 mb-1">Subcategory Image</label>
                    <input
                        type="file"
                        name="subCategory"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-2 cursor-pointer"
                    />
                    {formData?.imagePreview && (
                        <div className="mt-2 flex items-center gap-2">
                            <Image
                                src={formData?.imagePreview}
                                alt="Preview"
                                className="w-15 h-15 object-cover rounded-md border"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({ ...prev, subCategory: null, imagePreview: null }))
                                }
                                className="px-2 py-1 text-gray-500 text-sm rounded-md cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        type="submit"
                        loading={loadingCreate}
                        className="px-4 py-2 text-sm bg_pink font-medium text-white rounded-sm transition cursor-pointer"
                    >
                        {upDateData ? "Update" : "Create"}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-200 text-sm font-medium text-gray-700 rounded-sm hover:bg-gray-300 transition cursor-pointer"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </CommonPopup>
    );
};

export default memo(AddSubCategori);
