import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../../common/MainLayout";
import { getTypeNames } from "../../../store/slice/typeSlice";
import CreateTypeName from "./CreateTypeName";

const TypeNameSection = () => {
    const dispatch = useDispatch();
    const { typeNames } = useSelector((state) => state.type);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getTypeNames());
    }, []);

    return (
        <MainLayout
            onButtonClick={() => setIsModalOpen(true)}
            subtitle="Manage Type Names"
            buttonName="Add Type Name"
            itemsCount={typeNames?.length}
        >
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-5">
                {typeNames?.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white shadow rounded-xl p-6 border"
                    >
                        <img
                            src={item.typeNameImage}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-lg"
                        />
                        <h2 className="text-lg font-semibold mt-3">{item.name}</h2>

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

            <CreateTypeName
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </MainLayout>
    );
};

export default TypeNameSection;
