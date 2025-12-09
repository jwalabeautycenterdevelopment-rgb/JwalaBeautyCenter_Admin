import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../../common/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import {
    FaEye,
    FaEdit,
    FaTrash,
    FaTh,
    FaList,
    FaBox,
    FaPlus
} from "react-icons/fa";
import {
    clearCreateMsg,
    clearUpdateMsg,
    clearDeleteMsg,
    createProduct,
    updateProduct,
    getProducts,
    deleteProduct
} from "../../../store/slice/productSlice";
import { errorAlert, successAlert } from "../../../utils/alertService";
import ProductForm from "./CreateProducts";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import Image from "../../../common/Image";
import CommonViewPopup from "../../../common/CommonViewPopup";

const ProductsSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState("grid");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(null);
    const [mode, setMode] = useState("add");
    const [isDeletePopup, setIsDeletePopup] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [search, setSearch] = useState("");
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);

    const {
        allProducts,
        loadingGet: loading,
        loadingCreate,
        createSuccessMsg,
        createErrorMsg,
        updateSuccessMsg,
        updateErrorMsg,
        deleteSuccessMsg,
        deleteErrorMsg,
    } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getProducts());
    }, []);

    useEffect(() => {
        if (createSuccessMsg) {
            successAlert(createSuccessMsg);
            dispatch(clearCreateMsg());
            setIsFormOpen(false);
        }
        if (createErrorMsg) {
            errorAlert(createErrorMsg);
            dispatch(clearCreateMsg());
        }
        if (updateSuccessMsg) {
            successAlert(updateSuccessMsg);
            dispatch(clearUpdateMsg());
            setIsFormOpen(false);
        }
        if (updateErrorMsg) {
            errorAlert(updateErrorMsg);
            dispatch(clearUpdateMsg());
        }
        if (deleteSuccessMsg) {
            successAlert(deleteSuccessMsg);
            dispatch(clearDeleteMsg());
        }
        if (deleteErrorMsg) {
            errorAlert(deleteErrorMsg);
            dispatch(clearDeleteMsg());
        }
    }, [
        createSuccessMsg,
        createErrorMsg,
        updateSuccessMsg,
        updateErrorMsg,
        deleteSuccessMsg,
        deleteErrorMsg,
        dispatch
    ]);

    const handleAdd = () => {
        setIsFormOpen(true);
        setMode("add");
        setIsUpdate(null);
    };

    const handleUpdate = (product) => {
        setIsUpdate(product);
        setIsFormOpen(true);
        setMode("update");
    };

    const handleSubmit = async (formData) => {
        try {
            if (mode === "add") {
                await dispatch(createProduct(formData));
            } else if (mode === "update" && isUpdate?._id) {
                await dispatch(updateProduct({
                    slug: isUpdate?.slug,
                    formData
                }));
            }
            dispatch(getProducts());
        } catch (err) {
            console.error("Failed to submit:", err);
        }
    };

    const handleDeleteClick = (productId) => {
        setCurrentProductId(productId);
        setIsDeletePopup(true);
    };

    const confirmDeleteProduct = async () => {
        if (currentProductId) {
            await dispatch(deleteProduct(currentProductId));
            dispatch(getProducts());
        }
        setIsDeletePopup(false);
        setCurrentProductId(null);
    };

    const handleView = (product) => {
        navigate(`/products/${product?.slug}`);

    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(price);
    };

    const filteredProducts = allProducts?.filter((product) =>
        product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        product?.sku?.toLowerCase().includes(search.toLowerCase())
    );

    const getProductImage = (product) => {
        if (product?.productImages?.length > 0) {
            return product.productImages[0];
        }
        if (product?.variants?.length > 0 && product?.variants[0]?.variantImages?.length > 0) {
            return product.variants[0].variantImages[0];
        }
        return null;
    };

    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts?.map((product) => {
                const img = getProductImage(product);

                return (
                    <Link to={`/products/${product?.slug}`} key={product?._id}>
                        <div
                            key={product?._id}
                            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200"
                        >
                            <div className="relative h-48 bg-gray-100 overflow-hidden">

                                {img ? (
                                    <Image
                                        src={img}
                                        alt={product?.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <FaBox className="text-4xl text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {product?.isBestSeller && (
                                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            Best Seller
                                        </span>
                                    )}
                                    {product?.isNewArrival && (
                                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            New Arrival
                                        </span>
                                    )}
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                                    <button
                                        onClick={() => handleView(product)}
                                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                                    >
                                        <FaEye size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdate(product)}
                                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg"
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(product?._id)}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-6">
                                    {product?.name}
                                </h3>

                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(product?.price || product?.variants?.[0]?.price)}
                                        </span>

                                        {product?.discountPrice &&
                                            product?.discountPrice < product?.price && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    {formatPrice(product?.discountPrice || product?.variants?.[0]?.discountPrice)}
                                                </span>
                                            )}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Brand: {product?.brand?.name}</p>
                                    <p>SKU: {product?.sku || "N/A"}</p>
                                    <p
                                        className={`font-medium ${(product?.stock > 0) ||
                                            (product?.variants?.[0]?.stock > 0)
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        Stock: {product?.variants?.[0]?.stock || product?.stock}
                                    </p>

                                    {product?.category && (
                                        <p>Category: {product?.category?.name}</p>
                                    )}
                                </div>

                                {product?.tags && product?.tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {product?.tags.slice(0, 3).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}

                                        {product?.tags.length > 3 && (
                                            <span className="text-xs text-gray-500">
                                                +{product?.tags.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );

    const ListView = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts?.map((product) => {
                            const img = getProductImage(product);

                            return (
                                <Link to={`/products/${product?.slug}`} key={product?._id}>
                                    <tr key={product?._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 ">
                                                    {img ? (
                                                        <Image
                                                            className="h-10 w-10 rounded object-cover"
                                                            src={img}
                                                            alt={product?.name}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                                            <FaBox className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product?.name?.length > 90
                                                            ? product?.name.substring(0, 90) + "…"
                                                            : product?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{product?.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                {formatPrice(product?.price || product?.variants?.[0]?.price)}
                                            </div>
                                            {product?.discountPrice && (
                                                <div className="text-sm text-gray-500 line-through">
                                                    {formatPrice(product?.discountPrice || product?.variants?.[0]?.discountPrice)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product?.brand?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(product?.stock || product?.variants?.[0]?.stock) > 10
                                                    ? "bg-green-100 text-green-800"
                                                    : (product?.stock || product?.variants?.[0]?.stock) > 0
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {product?.stock || product?.variants?.[0]?.stock || 0} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-1">
                                                {product?.isBestSeller && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Best Seller
                                                    </span>
                                                )}
                                                {product?.isNewArrival && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        New Arrival
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleView(product)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                >
                                                    <FaEye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate(product)}
                                                    className="text-green-600 hover:text-green-900 transition-colors"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product?._id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </Link>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (isFormOpen) {
        return (
            <ProductForm
                onSubmit={handleSubmit}
                backNavigation={() => setIsFormOpen(false)}
                loading={loadingCreate}
                formData={isUpdate}
            />
        );
    }

    return (
        <MainLayout
            onButtonClick={handleAdd}
            subtitle="Manage all Products for your store"
            buttonName="Add Product"
            itemsCount={allProducts?.length}
            Inputvalue={search}
            InputOnChange={setSearch}
        >
            <div className="flex items-center justify-end gap-4 w-full sm:w-auto">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 cursor-pointer rounded-md transition-colors ${viewMode === "grid"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <FaTh size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 cursor-pointer rounded-md transition-colors ${viewMode === "list"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <FaList size={16} />
                    </button>
                </div>
            </div>
            <div className="mt-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading products...</p>
                    </div>
                ) : filteredProducts?.length > 0 ? (
                    viewMode === "grid" ? <GridView /> : <ListView />
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <FaBox className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-4">
                            {search ? "Try adjusting your search terms" : "Get started by adding your first product"}
                        </p>
                        {!search && (
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={handleAdd}
                                    className="flex items-center text-sm bg-linear-to-r from-pink-300 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium cursor-pointer py-3 px-6 transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <FaPlus size={14} />
                                    Add Product
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isDeletePopup && (
                <ConfirmDeleteModal
                    isOpen={isDeletePopup}
                    title="Are you sure you want to delete this product?"
                    onConfirm={confirmDeleteProduct}
                    onCancel={() => setIsDeletePopup(false)}
                />
            )}
        </MainLayout>
    );
};

export default ProductsSection;
