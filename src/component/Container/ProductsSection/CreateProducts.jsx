import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUpload, FaTimes } from "react-icons/fa";
import { getSubCategory } from "../../../store/slice/subCategorySlice";
import { getBrands } from "../../../store/slice/brandsSlice";
import Image from "../../../common/Image";
import { warningAlert, successAlert } from "../../../utils/alertService";
import { getTypeNamesByTypeId, getTypes, createTypeName } from "../../../store/slice/typeSlice";
import { HexColorPicker } from "react-colorful";
import { getColorName } from "../../../utils/getColorName";
import { slugify } from "../../../utils/slugify";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";
import { getPricePayload } from "../../../utils/getPricePercentage";

const ProductForm = ({ onSubmit, backNavigation, formData, loading }) => {
    const dispatch = useDispatch();
    const { allSubCategories } = useSelector((state) => state.subcategory);
    const { allBrands } = useSelector((state) => state.brands);
    const { types, typeNamesById } = useSelector((state) => state.type);
    const [isShowVariant, setIsShowVariant] = useState(false);

    const [variantInput, setVariantInput] = useState({
        variantName: "",
        name: "",
        price: "",
        offerPrice: "",
        stock: "",
        variantImage: [],
        type: "",
        weight: "",
    });

    const [showCreateTypeName, setShowCreateTypeName] = useState(false);
    const [newTypeNameValue, setNewTypeNameValue] = useState("");
    const [newColorCode, setNewColorCode] = useState("#ff69b4");
    const [newUnit, setNewUnit] = useState("");
    const [keywordInput, setKeywordInput] = useState("");

    const [form, setForm] = useState({
        name: "", description: "", price: "", offerPrice: "", weight: "", stock: "", category: "", brand: "",
        tags: [], images: [], isBestSeller: false, isNewArrival: false,
        variants: [], metaTitle: "", metaDescription: "",
        keywords: [],
        canonicalTag: "",
        slug: "",
    });

    useEffect(() => {
        dispatch(getSubCategory());
        dispatch(getBrands());
        dispatch(getTypes());
    }, [dispatch]);

    useEffect(() => {
        if (variantInput.type) {
            dispatch(getTypeNamesByTypeId(variantInput.type));
        }
    }, [variantInput.type, dispatch]);


    useEffect(() => {
        if (formData) {
            setForm({
                name: formData?.name || "",
                description: formData?.description || "",
                price: formData?.price || "",
                offerPrice: formData?.offerPrice || "",
                stock: formData?.stock || "",
                category: formData?.category?._id || "",
                brand: formData?.brand?._id || "",
                slug: formData?.slug || "",
                weight: formData?.weight || "",
                tags: Array.isArray(formData?.tags) ? formData.tags : [],
                images: Array.isArray(formData?.productImages) ? formData.productImages : [],
                isBestSeller: !!formData?.isBestSeller,
                isNewArrival: !!formData?.isNewArrival,
                variants: Array.isArray(formData?.variants)
                    ? formData.variants.map((v) => ({
                        variantId: v?._id || "",
                        name: v?.type || "",
                        price: v?.price?.toString() || "",
                        offerPrice: v?.offerPrice?.toString() || "",
                        stock: v?.stock?.toString() || "",
                        variantImage: Array.isArray(v?.variantImages) ? v.variantImages : [],
                        variantName: v?.name || "",
                        type: v?.type,
                        weight: v?.weight
                    }))
                    : [],
                metaTitle: formData?.metaTitle || "",
                metaDescription: formData?.metaDescription || "",
                canonicalTag: formData?.canonicalTag,
                keywords: Array.isArray(formData?.keywords)
                    ? formData.keywords
                    : (typeof formData?.keywords === "string"
                        ? formData.keywords.split(",").map(k => k.trim()).filter(Boolean)
                        : []),
            });

            if (formData?.variants?.length > 0) setIsShowVariant(true);
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleNameChange = (e) => {
        const value = e.target.value;

        setForm((prev) => ({
            ...prev,
            name: value,
            slug: slugify(value),
        }));
    };

    const handleSlugChange = (e) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            slug: slugify(value),
        }));
    };
    const handleToggleVariant = () => setIsShowVariant(prev => !prev);

    const handleAddKeyword = () => {
        if (keywordInput.trim() && !form.keywords.includes(keywordInput.trim())) {
            setForm(prev => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }));
            setKeywordInput("");
        }
    };

    const handleRemoveKeyword = (keyword) => {
        setForm(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== keyword) }));
    };
    const handleMainImageChange = (e) => {
        const files = Array.from(e.target.files || e.dataTransfer?.files || []);
        const currentNew = form.images.filter(img => img instanceof File).length;
        const validFiles = files.slice(0, 5 - currentNew);
        if (validFiles.length < files.length) warningAlert(`Only ${5 - currentNew} more images allowed.`);
        setForm(prev => ({
            ...prev,
            images: [...prev.images.filter(img => typeof img === "string"), ...validFiles],
        }));
    };

    const handleRemoveMainImage = (index) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleVariantInputImageChange = (e) => {
        const files = Array.from(e.target.files || e.dataTransfer?.files || []);
        const validFiles = files.slice(0, 5 - variantInput.variantImage.length);
        if (validFiles.length < files.length) warningAlert(`Only ${5 - variantInput.variantImage.length} more images allowed.`);
        setVariantInput(prev => ({ ...prev, variantImage: [...prev.variantImage, ...validFiles] }));
    };

    const handleRemoveVariantInputImage = (index) => {
        setVariantInput(prev => ({ ...prev, variantImage: prev.variantImage.filter((_, i) => i !== index) }));
    };

    const handleExistingVariantImageChange = (e, variantIndex) => {
        const files = Array.from(e.target.files || e.dataTransfer?.files || []);
        const currentNew = form.variants[variantIndex].variantImage.filter(img => img instanceof File).length;
        const validFiles = files.slice(0, 5 - currentNew);
        if (validFiles.length < files.length) warningAlert(`Only ${5 - currentNew} more images allowed.`);
        setForm(prev => ({
            ...prev,
            variants: prev.variants.map((v, i) =>
                i === variantIndex
                    ? { ...v, variantImage: [...v.variantImage.filter(img => typeof img === "string"), ...validFiles] }
                    : v
            ),
        }));
    };

    const handleRemoveExistingVariantImage = (variantIndex, imgIndex) => {
        setForm(prev => ({
            ...prev,
            variants: prev.variants.map((v, i) =>
                i === variantIndex ? { ...v, variantImage: v.variantImage.filter((_, idx) => idx !== imgIndex) } : v
            ),
        }));
    };

    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        setVariantInput(prev => ({
            ...prev,
            type: typeId,
            typeNameId: "",
            name: "",
            variantImage: [],
        }));
    };

    const currentTypeData = typeNamesById
    const typeNamesList = currentTypeData?.names || [];
    const currentType = types?.find(t => t._id === variantInput.type);

    const handleTypeNameSelect = (e) => {
        const value = e.target.value;
        if (value === "add-new") {
            setShowCreateTypeName(true);
        } else {
            const selected = typeNamesList.find(tn => tn._id === value);
            if (selected) {
                setVariantInput(prev => ({
                    ...prev,
                    typeNameId: value,
                    name: selected.name || "",
                }));
            }
        }
    };

    const handleCreateTypeName = async () => {
        if (currentType?.displayType !== "color" && !newTypeNameValue.trim()) {
            return warningAlert("Name is required!");
        }
        let obj = { name: "", colorCode: "", unit: "" };
        if (currentType?.displayType === "color") {
            obj.name = newColorCode.trim();
            obj.colorCode = newColorCode.trim();
        } else if (currentType?.displayType === "unit") {
            if (!newUnit.trim()) return warningAlert("Unit is required!");
            obj.name = newTypeNameValue.trim();
            obj.unit = newUnit.trim();
        } else {
            obj.name = newTypeNameValue.trim();
        }

        const payload = {
            typeId: variantInput.type,
            names: [obj]
        };

        const result = await dispatch(createTypeName(payload));
        if (result?.meta?.requestStatus === "fulfilled" || result?.payload?.success) {
            setNewTypeNameValue("");
            setNewColorCode("#ff69b4");
            setNewUnit("");
            setShowCreateTypeName(false);
            dispatch(getTypeNamesByTypeId(variantInput.type));
        }
    };

    const handleAddVariant = () => {
        if (!variantInput.type) return warningAlert("Please select a variant type!");
        if (!variantInput.typeNameId) return warningAlert("Please select or create a variant value!");
        if (!variantInput.price?.trim()) return warningAlert("Price is required!");
        const newVariant = {
            variantName: variantInput.variantName?.trim() || variantInput.name,
            name: variantInput.name,
            type: variantInput.type,
            typeNameId: variantInput.typeNameId,
            price: variantInput.price,
            offerPrice: variantInput.offerPrice || "",
            stock: variantInput.stock || "",
            weight: variantInput.weight || "",
            variantImage: [...variantInput.variantImage],
        };
        setForm(prev => ({
            ...prev,
            variants: [...prev.variants, newVariant]
        }));

        setVariantInput(prev => ({
            ...prev,
            variantName: "",
            name: "",
            price: "",
            offerPrice: "",
            stock: "",
            weight: "",
            variantImage: [],
            typeNameId: ""
        }));

        successAlert("Variant added successfully!");
    };

    const handleVariantChange = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            variants: prev.variants?.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
        }));
    };

    const handleRemoveVariant = (index) => {
        setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    };

    const handleRemoveTag = (tag) => {
        setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const { offerPercentage } = getPricePayload(
            Number(form.price) || 0,
            Number(form.offerPrice) || 0
        );
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", form.name || "");
        formDataToSubmit.append("description", form.description || "");
        formDataToSubmit.append(
            "price",
            isShowVariant ? 0 : (form.price || "")
        );
        formDataToSubmit.append("slug", form.slug || "");
        formDataToSubmit.append(
            "offerPrice",
            isShowVariant ? 0 : (form.offerPrice || "")
        );
        formDataToSubmit.append("discount", offerPercentage);
        formDataToSubmit.append("stock", form.stock || "");
        formDataToSubmit.append("weight", form.weight || "");
        formDataToSubmit.append("category", form.category || "");
        formDataToSubmit.append("brand", form.brand || "");
        formDataToSubmit.append("isBestSeller", !!form.isBestSeller);
        formDataToSubmit.append("isNewArrival", !!form.isNewArrival);
        formDataToSubmit.append("metaTitle", form.metaTitle || "");
        formDataToSubmit.append("metaDescription", form.metaDescription || "");
        formDataToSubmit.append("canonicalTag", form.canonicalTag || "");
        (form.keywords || []).forEach(keyword => {
            formDataToSubmit.append("keywords[]", keyword);
        });

        (form.tags || []).forEach(tag => {
            formDataToSubmit.append("tags[]", tag);
        });

        (form.images || []).forEach(img => {
            if (img instanceof File) {
                formDataToSubmit.append("productImages", img);
            } else if (typeof img === "string") {
                formDataToSubmit.append("existingImages", img);
            } else if (img?.file instanceof File) {
                formDataToSubmit.append("productImages", img.file);
            }
        });

        (form.variants || []).forEach((variant, i) => {
            const { offerPercentage: variantDiscount } = getPricePayload(
                Number(variant.price) || 0,
                Number(variant.offerPrice) || 0
            );
            const existingUrls = [];
            (variant.variantImage || []).forEach(img => {
                if (img instanceof File) {
                    formDataToSubmit.append(`variants[${i}][variantImages]`, img);
                } else if (typeof img === "string") {
                    existingUrls.push(img);
                    formDataToSubmit.append(`variants[${i}][existingVariantImages]`, img);
                }
            });
            formDataToSubmit.append(`variants[${i}][name]`, variant.variantName || "");
            formDataToSubmit.append(`variants[${i}][type]`, variant.name || "");
            formDataToSubmit.append(`variants[${i}][price]`, variant.price || "");
            formDataToSubmit.append(`variants[${i}][offerPrice]`, variant.offerPrice || "");
            formDataToSubmit.append(`variants[${i}][discount]`, variantDiscount);
            formDataToSubmit.append(`variants[${i}][stock]`, variant.stock || "");
            formDataToSubmit.append(`variants[${i}][weight]`, variant.weight || "");
        });
        onSubmit(formDataToSubmit);
    };

    const ImageUploadBox = ({ images = [], onChange, onRemove, label = "Images (Max 5)" }) => {
        const newCount = images.filter(i => i instanceof File).length;
        const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`;
        const handleDrop = (e) => {
            e.preventDefault(); e.stopPropagation();
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
            if (files.length > 0) onChange({ target: { files } });
        };
        const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
        return (
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
                <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center hover:border-pink-500 transition"
                    onDrop={handleDrop} onDragOver={handleDragOver}>
                    <input type="file" multiple accept="image/*" onChange={onChange} className="hidden" id={inputId} disabled={newCount >= 5} />
                    <label htmlFor={inputId} className={`block cursor-pointer ${newCount >= 5 ? "opacity-60" : "hover:bg-gray-50"} transition`}>
                        <FaUpload className="mx-auto text-5xl text-pink-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700">Click to upload or drag & drop</p>
                        <p className="text-sm text-gray-500 mt-2">{newCount}/5 new • {images.length - newCount} existing</p>
                    </label>
                </div>
                {images.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                        {images?.map((img, i) => (
                            <div key={i} className="relative group rounded-lg overflow-hidden shadow-md">
                                <Image src={img instanceof File ? URL.createObjectURL(img) : img} alt="Preview" className="w-full h-32 object-cover" />
                                <button type="button" onClick={() => onRemove(i)}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition">
                                    <FaTimes size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white p-6 min-h-screen">
            <div className="flex gap-3 items-center mb-6">
                <IoMdArrowRoundBack size={28} className="cursor-pointer hover:text-pink-600" onClick={backNavigation} />
                <h2 className="text-3xl font-bold">{formData ? "Update Product" : "Add New Product"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={form?.name}
                            onChange={handleNameChange}
                            required
                            className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div>
                        <SingleSelectDropdown
                            label="Category *"
                            options={allSubCategories}
                            value={form.category}
                            onChange={(val) => setForm({ ...form, category: val })}
                            searchable={true}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Product Slug *</label>
                    <input
                        type="text"
                        name="slug"
                        value={form?.slug}
                        onChange={handleSlugChange}
                        required
                        className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        placeholder="Slug"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" value={form?.description} onChange={handleChange} rows={5} className="w-full p-3 border border-pink-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300"></textarea>
                </div>
                <div className="flex justify-between items-center py-4  border-gray-300">
                    <h3 className="text-xl font-semibold">
                        Product Variants {form.images.length > 0 ? "(Image selected, variants locked)" : "(Optional)"}
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isShowVariant}
                            onChange={handleToggleVariant}
                            className="sr-only peer"
                            disabled={form.images.length > 0}
                        />
                        <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-pink-600 
    after:content-[''] after:absolute after:top-0.5 after:left-0.5 
    after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
    peer-checked:after:translate-x-6">
                        </div>
                    </label>
                </div>
                {
                    !isShowVariant && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Price </label>
                                <input type="number" name="price" value={form?.price} onChange={handleChange} className="w-full p-3 border border-pink-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Discount Price</label>
                                <input type="number" name="offerPrice" value={form?.offerPrice} onChange={handleChange} className="w-full p-3 border border-pink-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Weight</label>
                                <input type="text" name="weight" value={form?.weight} onChange={handleChange} className="w-full p-3 border border-pink-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300" />
                            </div>
                        </div>
                    )
                }
                {
                    !isShowVariant && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <SingleSelectDropdown
                                    label="Brand *"
                                    options={allBrands}
                                    value={form.brand}
                                    onChange={(val) => setForm({ ...form, brand: val })}
                                    searchable={true}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Stock</label>
                                <input type="number" name="stock" value={form?.stock} onChange={handleChange} className="w-full p-3 border border-pink-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300" />
                            </div>
                        </div>
                    )
                }
                {
                    !isShowVariant && (
                        <ImageUploadBox images={form?.images} onChange={handleMainImageChange} onRemove={handleRemoveMainImage} label="Main Product Images (Max 5)" />

                    )
                }
                {isShowVariant && (
                    <div className="space-y-8">
                        {form?.variants?.map((variant, index) => (
                            <div key={index} className="p-6 border-2 border-pink-200 rounded-xl bg-pink-50 relative">
                                <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute top-4 right-4 text-red-600 hover:bg-red-100 rounded-full p-2">
                                    <FaTimes size={20} />
                                </button>
                                <div>Varian Name {variant?.variantName}</div>
                                <div className="mb-4">
                                    Type-
                                    <span className="text-lg font-bold text-pink-700">{variant?.name || "Variant"}</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <input type="text" placeholder="Weight" value={variant?.weight} onChange={e => handleVariantChange(index, "weight", e.target.value)} className="p-3 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300" />
                                    <input type="number" placeholder="Price *" value={variant?.price} onChange={e => handleVariantChange(index, "price", e.target.value)} className="p-3 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300" />
                                    <input type="number" placeholder="Discount Price" value={variant?.offerPrice} onChange={e => handleVariantChange(index, "offerPrice", e.target.value)} className="p-3 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300" />
                                    <input type="number" placeholder="Stock" value={variant?.stock} onChange={e => handleVariantChange(index, "stock", e.target.value)} className="p-3 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-pink-300" />
                                </div>
                                <ImageUploadBox images={variant?.variantImage || []} onChange={e => handleExistingVariantImageChange(e, index)} onRemove={i => handleRemoveExistingVariantImage(index, i)} label={`Variant Images - ${variant.name || "Variant"} (Max 5)`} />
                            </div>
                        ))}
                        <div className="p-8 border-4 border-dashed border-pink-300 rounded-2xl bg-pink-50">
                            <h4 className="text-xl font-bold text-pink-800 mb-6">Add New Variant</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <input type="text" value={variantInput?.variantName} className="p-3 border rounded-lg  focus:outline-pink-500 focus:ring-2 focus:ring-pink-300" placeholder="Variant Name" onChange={e => setVariantInput(p => ({ ...p, variantName: e.target.value }))} />
                                <select value={variantInput?.type} onChange={handleTypeChange} className="p-3 border rounded-lg  focus:outline-pink-500 focus:ring-2 focus:ring-pink-300">
                                    <option value="">Select Type</option>
                                    {types?.map(t => (
                                        <option key={t._id} value={t._id}>{t.name}</option>
                                    ))}
                                </select>
                                {variantInput?.type && currentType && (
                                    <select value={variantInput?.typeNameId} onChange={handleTypeNameSelect} className="p-3 border rounded-lg  focus:outline-pink-500 focus:ring-2 focus:ring-pink-300">
                                        <option value="">Select {currentType.name}</option>
                                        <option value="add-new" className="font-bold text-pink-600">
                                            Add New {currentType.name}
                                        </option>
                                        {typeNamesList?.map(tn => {
                                            const isColor = !!tn.colorCode || (!tn.unit && /^#[0-9A-F]{6}$/i.test(tn.name.trim()));
                                            const color = tn.colorCode || (isColor ? tn.name.trim() : null);
                                            const label = `${tn.name} ${tn.unit ? `(${tn.unit})` : ''}`.trim();
                                            const displayLabel = isColor ? `● ${label}` : label;
                                            return (
                                                <option
                                                    key={tn._id}
                                                    value={tn._id}
                                                    style={{
                                                        color: color && color !== '#FFFFFF' ? color : '#1f2937',
                                                        fontWeight: isColor ? '600' : 'normal'
                                                    }}
                                                >
                                                    {displayLabel}
                                                </option>
                                            );
                                        })}
                                    </select>
                                )}
                                {variantInput.typeNameId && typeNamesList?.find(tn => tn._id === variantInput.typeNameId) && (
                                    <div className="flex items-center gap-4">
                                        {typeNamesList?.find(tn => tn._id === variantInput.typeNameId)?.colorCode && (
                                            <div className="w-16 h-16 rounded-lg  focus:outline-pink-500 focus:ring-2 focus:ring-pink-300 border-2 shadow" style={{ backgroundColor: typeNamesList.find(tn => tn._id === variantInput.typeNameId).colorCode }}></div>
                                        )}
                                        <span className="text-lg font-semibold text-pink-700">{variantInput.name}</span>
                                    </div>
                                )}
                            </div>
                            {showCreateTypeName && currentType && (
                                <div className="p-8 bg-white rounded-2xl border-4 border-pink-500 shadow-2xl mb-8 -mx-8">
                                    <h5 className="text-2xl font-bold text-pink-800 mb-8 text-center">
                                        Create New {currentType?.name}
                                    </h5>
                                    {currentType?.displayType === "color" ? (
                                        <div className="space-y-6 text-center">
                                            <p className="text-lg text-gray-600">
                                                Variant name will be saved as:
                                                <span className="block font-mono text-3xl font-bold text-pink-700 mt-2">
                                                    {newColorCode}
                                                </span>
                                                <span>
                                                    {
                                                        getColorName(newColorCode)
                                                    }
                                                </span>
                                            </p>
                                            <div className="flex justify-center">
                                                <HexColorPicker color={newColorCode} onChange={setNewColorCode} />
                                            </div>
                                            <input
                                                type="text"
                                                value={newColorCode}
                                                onChange={(e) => setNewColorCode(e.target.value)}
                                                placeholder="#ff0000"
                                                className="w-full max-w-md mx-auto p-5 text-center text-xl font-mono border-4 border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400"
                                            />
                                        </div>
                                    ) : currentType?.displayType === "unit" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={newTypeNameValue}
                                                    onChange={(e) => setNewTypeNameValue(e.target.value)}
                                                    placeholder="(e.g. 250)"
                                                    className="w-full p-5 border-4 border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 text-lg"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Only</label>
                                                <input
                                                    type="text"
                                                    value={newUnit}
                                                    onChange={(e) => setNewUnit(e.target.value)}
                                                    placeholder="(e.g kg, g, ml)"
                                                    className="w-full p-5 border-4 border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 text-lg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="max-w-xl mx-auto">
                                            <input
                                                type="text"
                                                value={newTypeNameValue}
                                                onChange={(e) => setNewTypeNameValue(e.target.value)}
                                                placeholder="Enter value (e.g. Apple,Orange)"
                                                className="w-full p-6 text-xl border-4 border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 text-center font-medium"
                                                required
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-center gap-6 mt-10">
                                        <button
                                            type="button"
                                            onClick={handleCreateTypeName}
                                            className="px-12 py-5 bg-linear-to-r from-pink-600 to-pink-700 text-white text-xl font-bold rounded-2xl hover:from-pink-700 hover:to-pink-800 transform hover:scale-105 transition shadow-xl"
                                        >
                                            Create Variant Value
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateTypeName(false);
                                                setNewTypeNameValue("");
                                                setNewColorCode("#ff69b4");
                                                setNewUnit("");
                                            }}
                                            className="px-12 py-5 border-4 border-pink-600 text-pink-600 text-xl font-bold rounded-2xl hover:bg-pink-50 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <input type="text" placeholder="Weight" value={variantInput?.weight} onChange={e => setVariantInput(p => ({ ...p, weight: e.target.value }))} className="p-3 border rounded-lg  focus:outline-pink-500 focus:ring-2 focus:ring-pink-300" />
                                <input type="number" placeholder="Price *" value={variantInput?.price} onChange={e => setVariantInput(p => ({ ...p, price: e.target.value }))} className="p-3 border rounded-lg  focus:outline-pink-500 focus:ring-2 focus:ring-pink-300" />
                                <input type="number" placeholder="Discount Price" value={variantInput?.offerPrice} onChange={e => setVariantInput(p => ({ ...p, offerPrice: e.target.value }))} className="p-3 border rounded-lg  focus:outline-pink-500 focus:ring-2 focus:ring-pink-300" />
                                <input type="number" placeholder="Stock" value={variantInput?.stock} onChange={e => setVariantInput(p => ({ ...p, stock: e.target.value }))} className="p-3 border rounded-lg  focus:outline-pink-500 focus:ring-2 focus:ring-pink-300" />
                            </div>
                            <ImageUploadBox images={variantInput?.variantImage} onChange={handleVariantInputImageChange} onRemove={handleRemoveVariantInputImage} label="Variant Images (Optional)" />
                            <button type="button" onClick={handleAddVariant} className="w-full mt-8 py-4 bg-pink-600 text-white text-lg font-bold rounded-xl hover:bg-pink-700 transition">
                                + Add Variant
                            </button>
                        </div>
                    </div>
                )}
                <div className="space-y-8 ">
                    <div className="flex gap-10 border-b pb-2 border-gray-300">
                        <label className="flex items-center gap-3 text-lg">
                            <input type="checkbox" name="isBestSeller" checked={form?.isBestSeller} onChange={handleChange} className="w-6 h-6 text-pink-600" />
                            <span>Best Seller</span>
                        </label>
                        <label className="flex items-center gap-3 text-lg">
                            <input type="checkbox" name="isNewArrival" checked={form?.isNewArrival} onChange={handleChange} className="w-6 h-6 text-pink-600" />
                            <span>New Arrival</span>
                        </label>
                    </div>
                    <div>
                        <div>
                            <h5 className="text-lg font-semibold mb-3">SEO</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={form?.metaTitle}
                                        onChange={handleChange}
                                        placeholder="SEO Meta Title"
                                        className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Canonical URL</label>
                                    <input
                                        type="url"
                                        name="canonicalTag"
                                        value={form?.canonicalTag}
                                        onChange={handleChange}
                                        placeholder="https://yoursite.com/old-page"
                                        className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Keywords (SEO)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={keywordInput}
                                            onChange={(e) => setKeywordInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                                            placeholder="Type + Enter"
                                            className="flex-1 p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddKeyword}
                                            className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {form?.keywords.map((kw, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                                            >
                                                {kw}
                                                <button type="button" onClick={() => handleRemoveKeyword(kw)}>
                                                    <FaTimes size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {form?.tags?.map((tag, i) => (
                                <span key={i} className="inline-flex items-center gap-2 px-5 py-3 bg-pink-200 text-pink-800 rounded-full text-sm font-medium">
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)}><FaTimes size={16} /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Description</label>
                        <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={4} className="w-full p-3 border border-pink-300 rounded-lg"></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-6 pt-10 border-t border-gray-300">
                    <button type="button" onClick={backNavigation} className="px-10 py-4 border-2 border-gray-300 rounded-xl text-lg font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-12 py-4 bg-pink-600 text-white text-lg font-bold rounded-xl hover:bg-pink-700 disabled:opacity-50">
                        {loading ? "Saving..." : formData ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default memo(ProductForm);