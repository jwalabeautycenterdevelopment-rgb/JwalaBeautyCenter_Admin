import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../../common/MainLayout";
import { getTypes } from "../../../store/slice/typeSlice";
import CreateType from "./CreateType";

const TypeSection = () => {
    const dispatch = useDispatch();
    const { types } = useSelector((state) => state.type);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getTypes());
    }, []);

    return (
        <MainLayout
            onButtonClick={() => setIsModalOpen(true)}
            subtitle="Manage Types"
            buttonName="Add Type"
            itemsCount={types?.length}
        >
            <section className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {types?.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white shadow rounded-xl p-6 border"
                    >
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-sm capitalize text-gray-600 mt-1">
                            Display: {item.displayType}
                        </p>

                        <span
                            className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${item.status === 1
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                        >
                            {item.status === 1 ? "Active" : "Inactive"}
                        </span>
                    </div>
                ))}
            </section>
            <CreateType isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </MainLayout>
    );
};

export default TypeSection;
