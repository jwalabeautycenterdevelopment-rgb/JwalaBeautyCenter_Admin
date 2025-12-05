import { useEffect, useState } from "react";
import MainLayout from "../../../common/MainLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
    getBanner,
    clearDeleteMsg,
    deleteBanner,
} from "../../../store/slice/bannerSlice";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { errorAlert, successAlert } from "../../../utils/alertService";
import AddBanner from "./CreateBanner";
import Image from "../../../common/Image";
import { HiDotsVertical } from "react-icons/hi";
import CommonViewPopup from "../../../common/CommonViewPopup";

const BannerSection = () => {
    const dispatch = useDispatch();
    const { allBanners, deleteSuccessMsg, deleteErrorMsg } = useSelector(
        (state) => state.banner
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [selectedBannerId, setSelectedBannerId] = useState(null);
    const [updateData, setUpdateData] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);


    useEffect(() => {
        dispatch(getBanner());
    }, [dispatch]);

    useEffect(() => {
        if (deleteSuccessMsg) {
            successAlert(deleteSuccessMsg);
            dispatch(clearDeleteMsg());
            dispatch(getBanner());
        }
        if (deleteErrorMsg) {
            errorAlert(deleteErrorMsg);
            dispatch(clearDeleteMsg());
        }
    }, [dispatch, deleteSuccessMsg, deleteErrorMsg]);

    const handleView = (item) => {
        setViewData(item);
        setIsViewOpen(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedBannerId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteBanner(selectedBannerId));
        setIsModalOpen(false);
        setSelectedBannerId(null);
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setSelectedBannerId(null);
    };

    const handleUpdate = (item) => {
        setUpdateData(item);
        setIsModalAddOpen(true);
    };

    return (
        <MainLayout
            onButtonClick={() => setIsModalAddOpen(true)}
            subtitle="Manage banners for your website"
            buttonName="Add Banner"
            itemsCount={allBanners?.length}

        >
            <section className="my-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allBanners?.map((banner) => (
                        <div
                            key={banner?._id}
                            className="bg-white/40 rounded-xl shadow-lg border border-gray-200 p-6 w-full relative group"
                        >
                            <span className="text-sm text-pink-300 font-medium">
                                {banner?.bannerType?.toUpperCase()}
                            </span>
                            <div className="flex justify-between items-start">
                                <h1 className="text-sm font-semibold capitalize text-gray-800 tracking-wide">
                                    {banner?.header}
                                </h1>
                                <div className="relative">
                                    <button className="rounded-full transition-colors opacity-0 group-hover:opacity-100 hover:bg-gray-100">
                                        <HiDotsVertical size={20} />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-md rounded-md py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                        <button
                                            onClick={() => handleView(banner)}
                                            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 flex items-center gap-2 text-sm cursor-pointer"
                                        >
                                            👁 View
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(banner)}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                        >
                                            <FiEdit /> Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(banner._id)}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center gap-2 text-sm"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed font-normal text-left my-2">
                                {banner?.description}
                            </p>
                            {banner?.bannerImage?.[0] && (
                                <div className="my-2">
                                    <Image
                                        src={banner?.bannerImage}
                                        alt={banner?.header}
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between border-t border-gray-100 mt-3 pt-2">
                                <span className="text-gray-500 font-medium text-sm">Status:</span>
                                <span
                                    className={`px-4 py-2 rounded-full font-semibold text-xs transition-all duration-300 select-none min-w-16 text-center ${banner?.status
                                        ? "bg-green-500 text-white shadow-lg shadow-green-200"
                                        : "bg-red-500 text-white shadow-lg shadow-red-200"
                                        } hover:-translate-y-0.5 hover:shadow-xl`}
                                >
                                    {banner?.status === 1 ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {allBanners?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No banners found. Add your first banner!
                        </p>
                    </div>
                )}
            </section>

            <CommonViewPopup
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title="Banner Details"
            >
                <div className="space-y-4">
                    {viewData?.bannerImage && (
                        <Image
                            src={viewData?.bannerImage}
                            className="w-full rounded-lg object-cover"
                            alt="Banner"
                        />
                    )}
                </div>
            </CommonViewPopup>

            <ConfirmDeleteModal
                isOpen={isModalOpen}
                title="Are you sure you want to delete this Banner?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <AddBanner
                isModalOpen={isModalAddOpen}
                setIsModalOpen={setIsModalAddOpen}
                upDateData={updateData}
                setUpdateData={setUpdateData}
            />
        </MainLayout>
    );
};

export default BannerSection;
