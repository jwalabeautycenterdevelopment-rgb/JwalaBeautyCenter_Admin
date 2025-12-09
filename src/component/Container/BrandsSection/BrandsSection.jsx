import { useEffect, useState } from "react";
import MainLayout from "../../../common/MainLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { errorAlert, successAlert } from "../../../utils/alertService";
import CreateBrnads from "./CreateBrands";
import Image from "../../../common/Image";
import { HiDotsVertical } from "react-icons/hi";
import CommonViewPopup from "../../../common/CommonViewPopup";
import {
    clearDeleteBrandError,
    clearDeleteBrandMessage,
    deleteBrand,
    getBrands,
} from "../../../store/slice/brandsSlice";

const BrandSection = () => {
    const dispatch = useDispatch();
    const { allBrands, deleteBrandSuccessmsg, deleteBrandErrormsg } = useSelector(
        (state) => state.brands
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [selectedBrandId, setSelectedBrandId] = useState(null);
    const [updateData, setUpdateData] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getBrands());
    }, [dispatch]);

    useEffect(() => {
        if (deleteBrandSuccessmsg) {
            successAlert(deleteBrandSuccessmsg);
            dispatch(clearDeleteBrandMessage());
            dispatch(getBrands());
        }
        if (deleteBrandErrormsg) {
            errorAlert(deleteBrandErrormsg);
            dispatch(clearDeleteBrandError());
        }
    }, [dispatch, deleteBrandSuccessmsg, deleteBrandErrormsg]);

    const handleView = (item) => {
        setViewData(item);
        setIsViewOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedBrandId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteBrand(selectedBrandId));
        setIsModalOpen(false);
        setSelectedBrandId(null);
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setSelectedBrandId(null);
    };

    const handleUpdate = (item) => {
        setUpdateData(item);
        setIsModalAddOpen(true);
    };

    const filteredBrands = allBrands
        ?.filter((brand) =>
            brand?.name?.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={e => setSearch(e)}
            onButtonClick={() => setIsModalAddOpen(true)}
            subtitle="Manage all brands for your store"
            buttonName="Add Brand"
            itemsCount={allBrands?.length}

        >
            <section className="my-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBrands?.map((brand) => (
                        <div
                            key={brand?._id}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full relative group"
                        >
                            <div className="flex justify-between items-start">
                                <h1 className="text-lg font-semibold capitalize text-gray-800">
                                    {brand?.name}
                                </h1>
                                <div className="relative">
                                    <button className="rounded-full transition-colors opacity-0 group-hover:opacity-100 hover:bg-gray-100 p-1">
                                        <HiDotsVertical size={20} />
                                    </button>

                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-md rounded-md py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                        <button
                                            onClick={() => handleView(brand)}
                                            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 flex items-center gap-2 text-sm cursor-pointer"
                                        >
                                            👁 View
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(brand)}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                        >
                                            <FiEdit /> Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(brand._id)}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center gap-2 text-sm"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed font-normal my-2">
                                {brand?.description}
                            </p>
                            {brand?.logo && (
                                <div className="my-3">
                                    <Image
                                        src={brand?.logo}
                                        alt={brand?.name}
                                        className="w-24 h-24 object-contain rounded-lg mx-auto"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between border-t border-gray-100 mt-3 pt-2">
                                <span className="text-gray-500 font-medium text-sm">Status:</span>
                                <span
                                    className={`px-4 py-1 rounded-full font-semibold text-xs text-center ${brand?.status === 1
                                        ? "bg-green-500 text-white"
                                        : "bg-red-500 text-white"
                                        }`}
                                >
                                    {brand?.status === 1 ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {allBrands?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No brands found. Add your first brand!
                        </p>
                    </div>
                )}
            </section>
            <CommonViewPopup
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title="Brand Details"
            >
                <div className="p-4">
                    {viewData?.logo && (
                        <Image
                            src={viewData?.logo}
                            className="w-28 h-28 object-contain mx-auto"
                            alt="Brand Logo"
                        />
                    )}

                    {viewData?.coverImage && (
                        <Image
                            src={viewData?.coverImage}
                            className="w-full rounded-lg object-cover"
                            alt="Cover"
                        />
                    )}
                </div>
            </CommonViewPopup>
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                title="Are you sure you want to delete this brand?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <CreateBrnads
                isModalOpen={isModalAddOpen}
                setIsModalOpen={setIsModalAddOpen}
                upDateData={updateData}
                setUpdateData={setUpdateData}
            />
        </MainLayout>
    );
};

export default BrandSection;
