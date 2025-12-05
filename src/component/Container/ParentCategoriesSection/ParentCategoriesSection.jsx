import { useEffect, useState } from "react";
import MainLayout from "../../../common/MainLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getParentCategory, deleteParentCategory, clearDeleteError, clearDeleteMessage } from "../../../store/slice/parentCategorySlice";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { errorAlert, successAlert } from "../../../utils/alertService";
import AddParentCategori from "./AddParentCategori";
import Image from "../../../common/Image";

const ParentCategoriesSection = () => {
    const dispatch = useDispatch();
    const { getAllCatogory, deleteCategorySuccessmsg, deleteCategoryErrormsg } = useSelector((state) => state.parentCategory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [updateData, setUpdateData] = useState(null)

    useEffect(() => {
        dispatch(getParentCategory());
    }, [dispatch]);

    useEffect(() => {
        if (deleteCategorySuccessmsg) {
            successAlert(deleteCategorySuccessmsg);
            dispatch(clearDeleteMessage());
            dispatch(getParentCategory());
        }
        if (deleteCategoryErrormsg) {
            errorAlert(deleteCategoryErrormsg);
            dispatch(clearDeleteError());
        }
    }, [dispatch, deleteCategoryErrormsg, deleteCategorySuccessmsg]);


    const handleDeleteClick = (id) => {
        setSelectedCategoryId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteParentCategory(selectedCategoryId));
        setIsModalOpen(false);
        setSelectedCategoryId(null);
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setSelectedCategoryId(null);
    };
    const handleUpdate = (item) => {
        setUpdateData(item)
        setIsModalAddOpen(true)
    }

    const handleStatusToggle = (id) => {
        console.log("Toggle status for id:", id);
    };

    return (
        <MainLayout
            onButtonClick={() => setIsModalAddOpen(true)}
            subtitle="Manage your main product categories"
            buttonName="Add Parent Category"
            itemsCount={getAllCatogory?.length}

        >
            <section className="my-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getAllCatogory?.map((category) => (
                        <div
                            key={category?._id}
                            className="bg-white/40 rounded-xl shadow-md border border-gray-200 p-6 w-full"
                        >
                            <Image
                                src={category?.image}
                                alt={category?.name}
                                className="my-3"

                            />
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-sm font-semibold capitalize text-gray-800 tracking-wide">
                                    {category?.name}
                                </h1>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdate(category)}
                                        className=" hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer">
                                        <FiEdit size={18} />
                                    </button>
                                    <button
                                        className=" text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
                                        onClick={() => handleDeleteClick(category?._id)}
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed font-normal text-left">
                                {category?.description.length > 90 ? category?.description.substring(0, 90) + "…" : category?.description}
                            </p>
                            <div className="flex items-center justify-between border-t border-gray-100 mt-3">
                                <span className="text-gray-500 font-medium text-xs">Status:</span>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-4 py-1 rounded-full font-semibold text-xs cursor-pointer transition-all duration-300 select-none min-w-16 text-center ${category?.status === 1
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                            : 'bg-red-500 text-white shadow-lg shadow-red-200'
                                            } hover:-translate-y-0.5 hover:shadow-xl`}
                                        onClick={() => handleStatusToggle(category?._id)}
                                    >
                                        {category?.status === 1 ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {getAllCatogory?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No categories found. Add your first category!</p>
                    </div>
                )}
            </section>
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                title="Are you sure you want to delete this category?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <AddParentCategori
                isModalOpen={isModalAddOpen}
                setIsModalOpen={setIsModalAddOpen}
                upDateData={updateData}
                setUpdateData={setUpdateData}
            />
        </MainLayout>
    );
};

export default ParentCategoriesSection;
