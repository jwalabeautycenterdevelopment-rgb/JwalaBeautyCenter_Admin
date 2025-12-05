import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, memo } from "react";
import CommonPopup from "../../../common/CommonPopup";
import InputField from "../../../common/CommonInput";
import Button from "../../../common/Button";
import { createType, clearTypeMessage } from "../../../store/slice/typeSlice";
import { errorAlert, successAlert, warningAlert } from "../../../utils/alertService";

const CreateType = ({ isModalOpen, setIsModalOpen }) => {
    const dispatch = useDispatch();
    const { loading, successMsg, errorMsg } = useSelector((state) => state.type);

    const [form, setForm] = useState({
        name: "",
        displayType: "",
        status: 1,
    });

    useEffect(() => {
        if (successMsg) {
            successAlert(successMsg);
            handleClose();
            dispatch(clearTypeMessage());
        }
        if (errorMsg) {
            errorAlert(errorMsg);
            dispatch(clearTypeMessage());
        }
    }, [successMsg, errorMsg]);

    const handleClose = () => {
        setForm({ name: "", displayType: "", status: 1 });
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusToggle = () =>
        setForm((prev) => ({ ...prev, status: prev.status === 1 ? 2 : 1 }));

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim()) return warningAlert("Name is required");
        if (!form.displayType) return warningAlert("Display type is required");
        dispatch(createType(form));
    };

    return (
        <CommonPopup isOpen={isModalOpen} onClose={handleClose} title="Create Type">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <InputField
                    name="name"
                    placeholder="Type Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <div>
                    <label className="text-sm font-medium">Display Type</label>
                    <select
                        name="displayType"
                        value={form.displayType}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select</option>
                        <option value="color">Color</option>
                        <option value="size">Size</option>
                        <option value="text">Text</option>
                    </select>
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

export default memo(CreateType);
