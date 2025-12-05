import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, memo } from "react";
import CommonPopup from "../../../common/CommonPopup";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import {
    createTypeName,
    getTypes,
    clearTypeMessage,
} from "../../../store/slice/typeSlice";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";

const CreateTypeName = ({ isModalOpen, setIsModalOpen }) => {
    const dispatch = useDispatch();
    const { types, loading, successMessage, errorMessage } = useSelector(
        (state) => state.type
    );

    const [form, setForm] = useState({
        typeId: "",
        name: "",
        typeNameImage: null,
        status: 1,
    });

    useEffect(() => {
        dispatch(getTypes());
    }, []);

    useEffect(() => {
        if (successMessage) {
            successAlert(successMessage);
            handleClose();
            dispatch(clearTypeMessage());
        }
        if (errorMessage) {
            errorAlert(errorMessage);
            dispatch(clearTypeMessage());
        }
    }, [successMessage, errorMessage]);

    const handleClose = () => {
        setForm({
            typeId: "",
            name: "",
            typeNameImage: null,
            status: 1,
        });
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "typeNameImage") {
            setForm((prev) => ({ ...prev, typeNameImage: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleStatusToggle = () =>
        setForm((prev) => ({ ...prev, status: prev.status === 1 ? 2 : 1 }));

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.typeId) return warningAlert("Please select Type");
        if (!form.name.trim()) return warningAlert("Type Name is required");
        if (!form.typeNameImage) return warningAlert("Image is required");

        const formData = new FormData();
        formData.append("typeId", form.typeId);
        formData.append("name", form.name);
        formData.append("status", form.status);
        formData.append("typeNameImage", form.typeNameImage);

        dispatch(createTypeName(formData));
    };

    return (
        <CommonPopup
            isOpen={isModalOpen}
            onClose={handleClose}
            title="Create Type Name"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-sm font-medium">Select Type</label>
                    <select
                        name="typeId"
                        value={form.typeId}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Type</option>
                        {types?.map((t) => (
                            <option value={t._id} key={t._id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>

                <InputField
                    name="name"
                    placeholder="Enter Type Name"
                    value={form.name}
                    onChange={handleChange}
                />
                <div>
                    <label className="text-sm font-medium">Upload Image</label>
                    <input
                        type="file"
                        name="typeNameImage"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span>Status:</span>
                    <div
                        onClick={handleStatusToggle}
                        className={`w-14 h-7 p-1 cursor-pointer rounded-full flex items-center ${form.status === 1 ? "bg-green-500" : "bg-gray-400"
                            }`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full transition-all ${form.status === 1 ? "translate-x-7" : "translate-x-0"
                                }`}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="submit" loading={loading}>
                        Create
                    </Button>
                    <Button className="bg-gray-200 text-black" onClick={handleClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </CommonPopup>
    );
};

export default memo(CreateTypeName);
