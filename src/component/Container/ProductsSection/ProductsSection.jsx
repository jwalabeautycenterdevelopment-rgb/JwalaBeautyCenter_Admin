import { useEffect, useState, useMemo, useCallback } from "react";
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
    FaPlus,
    FaFileExcel,
    FaDownload,
    FaFileUpload,
    FaTimes
} from "react-icons/fa";
import {
    clearCreateMsg,
    clearUpdateMsg,
    clearDeleteMsg,
    createProduct,
    updateProduct,
    getProducts,
    deleteProduct,
    bulkDeleteProducts
} from "../../../store/slice/productSlice";
import { getSubCategory } from "../../../store/slice/subCategorySlice";
import { getBrands } from "../../../store/slice/brandsSlice";
import { errorAlert, successAlert } from "../../../utils/alertService";
import ProductForm from "./CreateProducts";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import Image from "../../../common/Image";
import CommonViewPopup from "../../../common/CommonViewPopup";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const STATUS_OPTIONS = ["In Stock", "Out of Stock"];
const YES_NO_OPTIONS = ["Yes", "No"];

/**
 * Human-readable export for viewing/reporting only.
 * NOT compatible with the bulk-import parser — column headers are
 * display labels, not the field keys handleBulkUpload expects.
 */
const exportProductsToExcel = async (products, fileName, categories = [], brands = []) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Products");
    const lookupSheet = workbook.addWorksheet("Lookups");
    lookupSheet.state = "hidden";

    sheet.columns = [
        { header: "Product Name", key: "name", width: 35 },
        { header: "SKU", key: "sku", width: 18 },
        { header: "Category", key: "category", width: 22 },
        { header: "Brand", key: "brand", width: 22 },
        { header: "Price", key: "price", width: 14 },
        { header: "Offer Price", key: "offerPrice", width: 14 },
        { header: "Stock", key: "stock", width: 12 },
        { header: "Status", key: "status", width: 16 },
        { header: "Best Seller", key: "isBestSeller", width: 14 },
        { header: "New Arrival", key: "isNewArrival", width: 14 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE9D5FF" },
    };

    const categoryNames = categories.map((c) => c?.name).filter(Boolean);
    const brandNames = brands.map((b) => b?.name).filter(Boolean);

    lookupSheet.columns = [
        { header: "Category", key: "category", width: 25 },
        { header: "Brand", key: "brand", width: 25 },
        { header: "Status", key: "status", width: 18 },
        { header: "YesNo", key: "yesno", width: 10 },
    ];

    const maxLookupRows = Math.max(
        categoryNames.length,
        brandNames.length,
        STATUS_OPTIONS.length,
        YES_NO_OPTIONS.length,
        1
    );

    for (let i = 0; i < maxLookupRows; i++) {
        lookupSheet.addRow({
            category: categoryNames[i] || null,
            brand: brandNames[i] || null,
            status: STATUS_OPTIONS[i] || null,
            yesno: YES_NO_OPTIONS[i] || null,
        });
    }

    products.forEach((product) => {
        const price = product?.price ?? product?.variants?.[0]?.price ?? 0;
        const offerPrice =
            product?.discountPrice ?? product?.variants?.[0]?.discountPrice ?? "";
        const stock = product?.stock ?? product?.variants?.[0]?.stock ?? 0;

        sheet.addRow({
            name: product?.name || "",
            sku: product?.sku || "N/A",
            category: product?.category?.name || "",
            brand: product?.brand?.name || "",
            price,
            offerPrice,
            stock,
            status: stock > 0 ? "In Stock" : "Out of Stock",
            isBestSeller: product?.isBestSeller ? "Yes" : "No",
            isNewArrival: product?.isNewArrival ? "Yes" : "No",
        });
    });

    const lastRow = sheet.rowCount;

    for (let i = 2; i <= lastRow; i++) {
        if (categoryNames.length > 0) {
            sheet.getCell(`C${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`Lookups!$A$2:$A$${categoryNames.length + 1}`],
            };
        }
        if (brandNames.length > 0) {
            sheet.getCell(`D${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`Lookups!$B$2:$B$${brandNames.length + 1}`],
            };
        }
        sheet.getCell(`H${i}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`Lookups!$C$2:$C$${STATUS_OPTIONS.length + 1}`],
        };
        sheet.getCell(`I${i}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`Lookups!$D$2:$D$${YES_NO_OPTIONS.length + 1}`],
        };
        sheet.getCell(`J${i}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`Lookups!$D$2:$D$${YES_NO_OPTIONS.length + 1}`],
        };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
};

/**
 * Re-import-compatible export. Column KEYS match exactly what
 * handleBulkUpload (in CreateProducts.jsx) expects: name, slug, category,
 * brand, description, price, offerPrice, stock, weight, tags, keywords,
 * metaTitle, metaDescription, canonicalTag, isBestSeller, isNewArrival,
 * status, variants.
 *
 * This file can be edited and re-uploaded via the Bulk Upload modal.
 * Note: existing variants are NOT serialized into the "variants" column
 * (variant images cannot round-trip through Excel) — edit variant
 * products via the product form instead.
 */
const exportProductsForReimport = async (products, fileName, categories = [], brands = []) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Products");
    const categorySheet = workbook.addWorksheet("Categories");
    const brandSheet = workbook.addWorksheet("Brands");

    const categoryNames = categories.map((c) => c?.name).filter(Boolean);
    const brandNames = brands.map((b) => b?.name).filter(Boolean);

    categoryNames.forEach((name) => categorySheet.addRow([name]));
    brandNames.forEach((name) => brandSheet.addRow([name]));

    sheet.columns = [
        { header: "name", key: "name", width: 30 },
        { header: "slug", key: "slug", width: 30 },
        { header: "category", key: "category", width: 25 },
        { header: "brand", key: "brand", width: 25 },
        { header: "description", key: "description", width: 50 },
        { header: "price", key: "price", width: 15 },
        { header: "offerPrice", key: "offerPrice", width: 15 },
        { header: "stock", key: "stock", width: 15 },
        { header: "weight", key: "weight", width: 15 },
        { header: "tags", key: "tags", width: 30 },
        { header: "keywords", key: "keywords", width: 40 },
        { header: "metaTitle", key: "metaTitle", width: 40 },
        { header: "metaDescription", key: "metaDescription", width: 60 },
        { header: "canonicalTag", key: "canonicalTag", width: 50 },
        { header: "isBestSeller", key: "isBestSeller", width: 20 },
        { header: "isNewArrival", key: "isNewArrival", width: 20 },
        { header: "status", key: "status", width: 15 },
        { header: "variants", key: "variants", width: 80 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE9D5FF" },
    };

    products.forEach((product) => {
        const primaryVariant = product?.variants?.[0];

        sheet.addRow({
            name: product?.name ?? "",
            slug: product?.slug ?? "",
            category: product?.category?.name ?? "",
            brand: product?.brand?.name ?? "",
            description: product?.description ?? "",
            price: product?.price ?? primaryVariant?.price ?? 0,
            offerPrice: product?.discountPrice ?? primaryVariant?.discountPrice ?? 0,
            stock: product?.stock ?? primaryVariant?.stock ?? 0,
            weight: product?.weight ?? "",
            tags: Array.isArray(product?.tags) ? product.tags.join(", ") : "",
            keywords: Array.isArray(product?.keywords) ? product.keywords.join(", ") : "",
            metaTitle: product?.metaTitle ?? "",
            metaDescription: product?.metaDescription ?? "",
            canonicalTag: product?.canonicalTag ?? "",
            isBestSeller: product?.isBestSeller ? "true" : "false",
            isNewArrival: product?.isNewArrival ? "true" : "false",
            status: 1,
            variants: "", // intentionally blank — see note above
        });
    });

    const lastRow = sheet.rowCount;
    for (let i = 2; i <= lastRow; i++) {
        if (categoryNames.length > 0) {
            sheet.getCell(`C${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${categoryNames.join(",")}"`],
            };
        }
        if (brandNames.length > 0) {
            sheet.getCell(`D${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${brandNames.join(",")}"`],
            };
        }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
};

const ProductsSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState("list");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(null);
    const [mode, setMode] = useState("add");
    const [isDeletePopup, setIsDeletePopup] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [search, setSearch] = useState("");
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isBulkDeletePopup, setIsBulkDeletePopup] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingReimport, setIsExportingReimport] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 20;


    const {
        allProducts,
        pagination,
        loadingGet: loading,
        loadingCreate,
        createSuccessMsg,
        createErrorMsg,
        updateSuccessMsg,
        updateErrorMsg,
        deleteSuccessMsg,
        deleteErrorMsg,
    } = useSelector((state) => state.product);

    const { allSubCategories } = useSelector((state) => state.subcategory);
    const { allBrands } = useSelector((state) => state.brands);


    console.log(pagination);
    
    useEffect(() => {
        dispatch(getSubCategory());
        dispatch(getBrands());
    }, []);


    useEffect(() => {
        dispatch(getProducts({ page, limit }));
    }, [dispatch, page, limit]);

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
            dispatch(getProducts({ page, limit }));
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
            dispatch(getProducts({ page, limit }));

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
        }).format(price || 0);
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

    const isAllSelected =
        filteredProducts?.length > 0 &&
        filteredProducts.every((p) => selectedIds.has(p?._id));

    const isSomeSelected =
        filteredProducts?.some((p) => selectedIds.has(p?._id)) && !isAllSelected;

    const handleToggleSelectAll = useCallback(() => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            const allCurrentlySelected = filteredProducts?.every((p) =>
                next.has(p?._id)
            );

            if (allCurrentlySelected) {
                filteredProducts?.forEach((p) => next.delete(p?._id));
            } else {
                filteredProducts?.forEach((p) => next.add(p?._id));
            }
            return next;
        });
    }, [filteredProducts]);

    const handleToggleSelectOne = useCallback((productId) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    useEffect(() => {
        if (!allProducts?.length) return;
        setSelectedIds((prev) => {
            if (prev.size === 0) return prev;
            const validIds = new Set(allProducts.map((p) => p?._id));
            let changed = false;
            const next = new Set();
            prev.forEach((id) => {
                if (validIds.has(id)) {
                    next.add(id);
                } else {
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [allProducts]);

    const selectedProducts = useMemo(
        () => allProducts?.filter((p) => selectedIds.has(p?._id)) || [],
        [allProducts, selectedIds]
    );

    const handleExportSelected = async () => {
        if (selectedProducts.length === 0) return;
        setIsExporting(true);
        try {
            await exportProductsToExcel(
                selectedProducts,
                `Selected_Products_${Date.now()}.xlsx`,
                allSubCategories,
                allBrands
            );
        } catch (err) {
            console.error("Export failed:", err);
            errorAlert("Failed to export selected products.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportAll = async () => {
        if (!filteredProducts?.length) {
            return errorAlert("No products available to export.");
        }
        setIsExporting(true);
        try {
            await exportProductsToExcel(
                filteredProducts,
                `All_Products_${Date.now()}.xlsx`,
                allSubCategories,
                allBrands
            );
        } catch (err) {
            console.error("Export failed:", err);
            errorAlert("Failed to export products.");
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Exports the currently selected (or all, if none selected) products
     * in a schema that matches the bulk-import template exactly, so the
     * result can be edited and re-uploaded via Bulk Upload.
     */
    const handleExportForReimport = async () => {
        const source = selectedProducts.length > 0 ? selectedProducts : filteredProducts;
        if (!source?.length) {
            return errorAlert("No products available to export.");
        }
        setIsExportingReimport(true);
        try {
            await exportProductsForReimport(
                source,
                `Products_Bulk_Edit_${Date.now()}.xlsx`,
                allSubCategories,
                allBrands
            );
        } catch (err) {
            console.error("Export failed:", err);
            errorAlert("Failed to export products for bulk edit.");
        } finally {
            setIsExportingReimport(false);
        }
    };

    const handleBulkDeleteClick = () => {
        if (selectedIds.size === 0) return;
        setIsBulkDeletePopup(true);
    };

    const confirmBulkDelete = async () => {
        const ids = Array.from(selectedIds);
        if (!ids.length) {
            setIsBulkDeletePopup(false);
            return;
        }
        setIsBulkDeleting(true);
        try {
            await dispatch(bulkDeleteProducts(ids)).unwrap();

            successAlert(`${ids.length} product(s) deleted successfully.`);
            dispatch(getProducts({ page, limit }));
            setSelectedIds(new Set());
        } catch (err) {
            errorAlert(err || "Failed to delete selected products.");
        } finally {
            setIsBulkDeleting(false);
            setIsBulkDeletePopup(false);
        }
    };

    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts?.map((product) => {
                const img = getProductImage(product);

                return (
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
                                    className="bg-black text-white p-2 rounded-full transition-colors shadow-lg"
                                >
                                    <FaEye size={14} />
                                </button>
                                <button
                                    onClick={() => handleUpdate(product)}
                                    className="bg-black text-white p-2 rounded-full transition-colors shadow-lg"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(product?._id)}
                                    className="bg-black text-white p-2 rounded-full transition-colors shadow-lg"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <Link className="hover:underline" to={`/products/${product?.slug}`}>
                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-6">
                                    {product?.name}
                                </h3>
                            </Link>
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
                                        <span key={i} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
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
                            <th className="px-4 py-3 text-left w-12">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                    checked={isAllSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = isSomeSelected;
                                    }}
                                    onChange={handleToggleSelectAll}
                                    aria-label="Select all products"
                                />
                            </th>
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
                            const isSelected = selectedIds.has(product?._id);

                            return (
                                <tr
                                    key={product?._id}
                                    className={`transition-colors ${isSelected ? "bg-pink-50 hover:bg-pink-100" : "hover:bg-gray-50"}`}
                                >
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                            checked={isSelected}
                                            onChange={() => handleToggleSelectOne(product?._id)}
                                            aria-label={`Select ${product?.name}`}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10">
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
                                                <Link className="hover:underline" to={`/products/${product?.slug}`}>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product?.name?.length > 90
                                                            ? product?.name.substring(0, 90) + "…"
                                                            : product?.name}
                                                    </div>
                                                </Link>
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const BulkActionToolbar = () => {
        if (selectedIds.size === 0) return null;

        return (
            <div className="sticky top-0 z-20 mb-4 bg-gray-700 text-white rounded-lg shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm sm:text-base">
                        {selectedIds.size} product{selectedIds.size > 1 ? "s" : ""} selected
                    </span>
                    <button
                        onClick={handleClearSelection}
                        className="flex items-center gap-1 text-xs sm:text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                    >
                        <FaTimes size={12} />
                        Clear Selection
                    </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {/* <button
                        onClick={handleExportSelected}
                        disabled={isExporting}
                        className="flex items-center gap-2 text-sm bg-white text-slate-800 font-medium px-4 py-2 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FaFileExcel size={14} />
                        {isExporting ? "Exporting..." : "Export Selected"}
                    </button> */}
                    {/* <button
                        onClick={handleExportForReimport}
                        disabled={isExportingReimport}
                        className="flex items-center gap-2 text-sm bg-white text-slate-800 font-medium px-4 py-2 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FaFileUpload size={14} />
                        {isExportingReimport ? "Exporting..." : "Export for Bulk Edit"}
                    </button> */}
                    {/* <button
                        onClick={handleBulkDeleteClick}
                        disabled={isBulkDeleting}
                        className="flex items-center gap-2 text-sm bg-red-600 text-white hover:bg-red-700 font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FaTrash size={14} />
                        {isBulkDeleting ? "Deleting..." : "Delete Selected"}
                    </button> */}
                </div>
            </div>
        );
    };

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
            <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
                {/* <button
                    onClick={handleExportForReimport}
                    disabled={isExportingReimport || !filteredProducts?.length}
                    className="flex items-center gap-2 text-sm bg-black/90 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Export products in a format that can be edited and re-uploaded via Bulk Upload"
                >
                    <FaFileUpload size={14} />
                    {isExportingReimport ? "Exporting..." : "Export for Bulk Edit"}
                </button> */}
                {/* <button
                    onClick={handleExportAll}
                    disabled={isExporting || !filteredProducts?.length}
                    className="flex items-center gap-2 text-sm bg-black/90 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <FaDownload size={14} />
                    {isExporting ? "Exporting..." : "Export All Products"}
                </button> */}
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
                {viewMode === "list" && <BulkActionToolbar />}

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
            <div className="flex items-center justify-center gap-3 mt-8">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="h-12 px-6 rounded-xl border border-gray-400 bg-white text-gray-600 disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: pagination?.pages || 0 }, (_, i) => i + 1)
                    .filter(
                        (p) =>
                            p === 1 ||
                            p === pagination?.pages ||
                            Math.abs(p - page) <= 1
                    )
                    .map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`h-12 w-12 rounded-xl border ${page === p
                                ? "bg-black text-white border-black"
                                : "bg-white border-gray-400"
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                <button
                    disabled={page === pagination?.pages}
                    onClick={() => setPage(page + 1)}
                    className="h-12 px-6 rounded-xl border border-gray-400 bg-white disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            {isDeletePopup && (
                <ConfirmDeleteModal
                    isOpen={isDeletePopup}
                    title="Are you sure you want to delete this product?"
                    onConfirm={confirmDeleteProduct}
                    onCancel={() => setIsDeletePopup(false)}
                />
            )}

            {isBulkDeletePopup && (
                <ConfirmDeleteModal
                    isOpen={isBulkDeletePopup}
                    title={`Are you sure you want to delete ${selectedIds.size} selected product${selectedIds.size > 1 ? "s" : ""}? This action cannot be undone.`}
                    onConfirm={confirmBulkDelete}
                    onCancel={() => setIsBulkDeletePopup(false)}
                    loading={isBulkDeleting}
                />
            )}
        </MainLayout>
    );
};

export default ProductsSection;