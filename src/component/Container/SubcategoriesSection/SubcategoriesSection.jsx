import { useEffect, useState } from "react";
import MainLayout from "../../../common/MainLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategory, clearDeleteMsg, deleteSubCategory } from "../../../store/slice/subCategorySlice";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { errorAlert, successAlert } from "../../../utils/alertService";
import AddSubCategori from "./AddSubCategori";
import Image from "../../../common/Image";

const SubcategoriesSection = () => {
    const dispatch = useDispatch();
    const { allSubCategories, deleteSuccessMsg, deleteErrorMsg } = useSelector((state) => state.subcategory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [updateData, setUpdateData] = useState(null)
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getSubCategory());
    }, [dispatch]);

    useEffect(() => {
        if (deleteSuccessMsg) {
            successAlert(deleteSuccessMsg);
            dispatch(clearDeleteMsg());
            dispatch(getSubCategory());
        }
        if (deleteErrorMsg) {
            errorAlert(deleteErrorMsg);
            dispatch(clearDeleteMsg());
        }
    }, [dispatch, deleteErrorMsg, deleteSuccessMsg]);


    const handleDeleteClick = (id) => {
        setSelectedCategoryId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteSubCategory(selectedCategoryId));
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

    const filteredData = allSubCategories
        ?.filter((sub) =>
            sub?.name?.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={e => setSearch(e)}
            onButtonClick={() => setIsModalAddOpen(true)}
            subtitle="Manage subcategories within categories"
            buttonName="Add Sub Category"
            itemsCount={allSubCategories?.length}

        >
            <section className="my-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData?.map((sub) => (
                        <div
                            key={sub?._id}
                            className="bg-white/40 rounded-xl shadow-lg border border-gray-200 p-6 w-full"
                        >
                            <Image
                                src={sub?.image}
                                alt={sub?.name}
                                className="my-3 w-full h-[200px]"

                            />
                            <span className="text-xs text-pink-300 ">{sub?.category?.name}</span>
                            <div className="flex justify-between items-start">
                                <h1 className="text-md font-semibold capitalize text-gray-800 tracking-wide">
                                    {sub?.name.length > 90 ? sub?.name.substring(0, 90) + "…" : sub?.name}
                                </h1>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdate(sub)}
                                        className="  hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer">
                                        <FiEdit size={15} />
                                    </button>
                                    <button
                                        className=" text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
                                        onClick={() => handleDeleteClick(sub?._id)}
                                    >
                                        <FiTrash2 size={15} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed font-normal text-left">
                                {sub?.description?.length > 90 ? sub?.description.substring(0, 90) + "…" : sub?.description}
                            </p>
                            <div className="flex items-center justify-between border-t border-gray-100 mt-3">
                                <span className="text-gray-500 font-medium text-xs">Status:</span>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-4 py-1 rounded-full font-semibold text-xs cursor-pointer transition-all duration-300 select-none min-w-16 text-center ${sub?.status === 1
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                            : 'bg-red-500 text-white shadow-lg shadow-red-200'
                                            } hover:-translate-y-0.5 hover:shadow-xl`}
                                    >
                                        {sub?.status === 1 ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {allSubCategories?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No categories found. Add your first Subcategory!</p>
                    </div>
                )}
            </section>
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                title="Are you sure you want to delete this Subcategory?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <AddSubCategori
                isModalOpen={isModalAddOpen}
                setIsModalOpen={setIsModalAddOpen}
                upDateData={updateData}
                setUpdateData={setUpdateData}
            />
        </MainLayout>
    );
};

export default SubcategoriesSection;
