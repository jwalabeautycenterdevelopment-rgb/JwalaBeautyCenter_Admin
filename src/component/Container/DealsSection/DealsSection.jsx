import { useEffect, useState } from "react";
import MainLayout from "../../../common/MainLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { errorAlert, successAlert } from "../../../utils/alertService";
import CreateDeal from "./CreateDeals";
import Image from "../../../common/Image";
import { HiDotsVertical } from "react-icons/hi";
import CommonViewPopup from "../../../common/CommonViewPopup";

import {
    getDeals,
    deleteDeal,
    clearDeleteMsg,
} from "../../../store/slice/dealsSlice";

const DealsSection = () => {
    const dispatch = useDispatch();

    const {
        allDeals,
        deleteDealSuccessMsg,
        deleteDealErrorMsg
    } = useSelector((state) => state.deals);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [selectedDealId, setSelectedDealId] = useState(null);
    const [updateData, setUpdateData] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);

    useEffect(() => {
        dispatch(getDeals());
    }, [dispatch]);

    useEffect(() => {
        if (deleteDealSuccessMsg) {
            successAlert(deleteDealSuccessMsg);
            dispatch(clearDeleteMsg());
            dispatch(getDeals());
        }
        if (deleteDealErrorMsg) {
            errorAlert(deleteDealErrorMsg);
            dispatch(clearDeleteMsg());
        }
    }, [dispatch, deleteDealSuccessMsg, deleteDealErrorMsg]);

    const handleView = (item) => {
        setViewData(item);
        setIsViewOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedDealId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteDeal(selectedDealId));
        setIsModalOpen(false);
        setSelectedDealId(null);
    };

    const handleUpdate = (item) => {
        setUpdateData(item);
        setIsModalAddOpen(true);
    };

    return (
        <MainLayout
            onButtonClick={() => setIsModalAddOpen(true)}
            subtitle="Manage all Deals for your store"
            buttonName="Add Deal"
            itemsCount={allDeals?.length}
        >
            <section className="my-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allDeals?.map((deal) => (
                        <div
                            key={deal?._id}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full relative group"
                        >
                            <div className="flex justify-between items-start">
                                <h1 className="text-lg font-semibold capitalize text-gray-800">
                                    {deal?.title}
                                </h1>
                                <div className="relative">
                                    <button className="rounded-full transition-colors opacity-0 group-hover:opacity-100 hover:bg-gray-100 p-1">
                                        <HiDotsVertical size={20} />
                                    </button>

                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-md rounded-md py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                        <button
                                            onClick={() => handleView(deal)}
                                            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 flex items-center gap-2 text-sm cursor-pointer"
                                        >
                                            👁 View
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(deal)}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                        >
                                            <FiEdit /> Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(deal._id)}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center gap-2 text-sm"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm my-2">
                                {deal?.description}
                            </p>
                            {deal?.dealBanner?.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 my-3">
                                    {deal?.dealBanner?.map((img, i) => (
                                        <Image
                                            key={i}
                                            src={img}
                                            alt={deal?.title}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center justify-between border-t border-gray-100 mt-3 pt-2">
                                <span className="text-gray-500 font-medium text-sm">Status:</span>
                                <span
                                    className={`px-4 py-1 rounded-full font-semibold text-xs text-center ${deal?.status === 1
                                        ? "bg-green-500 text-white"
                                        : "bg-red-500 text-white"
                                        }`}
                                >
                                    {deal?.status ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {allDeals?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No deals found. Add your first deal!
                        </p>
                    </div>
                )}
            </section>

            <CommonViewPopup
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title="Deal Details"
            >
                <div className="space-y-4">
                    {viewData?.dealBanner?.map((img, i) => (
                        <Image key={i} src={img} className="rounded-lg" />
                    ))}
                </div>
            </CommonViewPopup>

            <ConfirmDeleteModal
                isOpen={isModalOpen}
                title="Are you sure you want to delete this deal?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />

            <CreateDeal
                isModalOpen={isModalAddOpen}
                setIsModalOpen={setIsModalAddOpen}
                updateData={updateData}
                setUpdateData={setUpdateData}
            />
        </MainLayout>
    );
};

export default DealsSection;
