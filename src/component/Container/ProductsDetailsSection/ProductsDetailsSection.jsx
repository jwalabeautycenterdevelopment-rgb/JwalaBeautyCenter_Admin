"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaArrowLeft, FaStar } from "react-icons/fa"
import { getSingleProduct } from "../../../store/slice/productSlice"
import Image from "../../../common/Image"
import { formatPrice } from "../../../utils/formatPrice"
import { Link } from "react-router-dom"
const ProductDetails = ({ slug }) => {
    const dispatch = useDispatch()
    const { singleProduct = {} } = useSelector((state) => state.product)
    const [selectedVariant, setSelectedVariant] = useState(0)
    const [selectedImage, setSelectedImage] = useState(0)
    console.log(singleProduct);


    useEffect(() => {
        if (slug) dispatch(getSingleProduct(slug))
    }, [slug, dispatch])

    useEffect(() => {
        if (singleProduct?.variants?.length > 0) setSelectedVariant(0)
        setSelectedImage(0)
    }, [singleProduct])

    const currentVariant = singleProduct?.variants?.[selectedVariant]

    const productImages =
        currentVariant?.variantImages?.length > 0
            ? currentVariant.variantImages
            : singleProduct?.productImages || []

    const displayName = currentVariant?.name
        ? `${singleProduct?.name} | ${currentVariant.name}`
        : singleProduct?.name

    const displayPriceValue =
        currentVariant?.offerPrice ?? currentVariant?.price ?? singleProduct?.offerPrice ?? singleProduct?.price
    const originalPrice = currentVariant?.price ?? singleProduct?.price
    const hasDiscount = displayPriceValue < originalPrice
    const discountPercent = hasDiscount ? Math.round(((originalPrice - displayPriceValue) / originalPrice) * 100) : 0
    const currentStock = currentVariant?.stock ?? singleProduct?.stock

    const handleVariantSelect = (index) => {
        setSelectedVariant(index)
        setSelectedImage(0)
    }

    return (
        <section className="px-4 sm:px-6 lg:px-18 py-10">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <div className="flex justify-between">
                        <div className="flex  items-center gap-1">
                            <Link to={"/products"} className="text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform">
                                <FaArrowLeft />
                            </Link>
                            <div>
                                <span className="text-sm text-gray-500">Product ID</span>
                                <span className="font-mono text-sm font-semibold">{singleProduct?._id || "N/A"}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">SKU</span>
                            <span className="font-mono text-sm font-semibold">{currentVariant?.sku || singleProduct?.sku || "N/A"}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                            {productImages?.length > 0 ? (
                                <Image
                                    src={productImages[selectedImage]}
                                    alt={displayName}
                                    className="max-h-80 object-contain"
                                    width={320}
                                    height={320}
                                />
                            ) : (
                                <div className="text-gray-400 text-center">
                                    <p>No Image Available</p>
                                </div>
                            )}
                        </div>
                        {productImages?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {productImages?.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${selectedImage === index ? "border-blue-500" : "border-gray-200"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            width={80}
                                            height={80}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 line-clamp-4">{displayName}</h1>
                        <p className="text-gray-700 text-sm capitalize md:text-md font-normal whitespace-pre-line line-clamp-3">{singleProduct?.description}</p>
                        <div className="flex gap-2 flex-wrap">
                            {singleProduct?.isNewArrival && (
                                <span className="inline-block px-3 py-1 text-white text-xs font-semibold bg-linear-to-r from-orange-400 to-red-500 skew-x-[-7deg] shadow-md rounded-sm">
                                    <span className="inline-block skew-x-[7deg]">New Arrival</span>
                                </span>
                            )}
                            {singleProduct?.isBestSeller && (
                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-xs font-semibold">
                                    Best Seller
                                </span>
                            )}
                            {singleProduct?.isFeatured && (
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-xs font-semibold">
                                    Featured
                                </span>
                            )}
                            {singleProduct?.isTrending && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-semibold">
                                    Trending
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-green-700 rounded-full px-3 py-1 text-white">
                                <span className="text-sm font-semibold">{singleProduct?.rating || currentVariant?.rating || 5}</span>
                                <FaStar size={12} />
                            </div>
                            <span className="text-gray-600 text-sm">
                                ({singleProduct?.reviewCount || currentVariant?.reviewCount || 10} ratings)
                            </span>
                        </div>

                        <div className="space-y-2 flex items-center gap-2">
                            <div className="text-3xl font-bold text-gray-900">{formatPrice(displayPriceValue)}</div>
                            {hasDiscount && (
                                <div className="flex items-center gap-2">
                                    <span className="text-lg text-gray-500 line-through">{formatPrice(originalPrice)}</span>
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                                        Save  {discountPercent}% Off
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-gray-900 mb-2">Inventory Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-600">Current Stock: </span>
                                    <span className={`font-semibold ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {currentStock} units
                                    </span>
                                </div>
                            </div>
                        </div>
                        {singleProduct?.variants?.length > 0 && (
                            <div className="space-y-2  border-gray-300 pt-4">
                                <h3 className="font-semibold text-gray-900">Variants:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {singleProduct?.variants?.map((variant, index) => (
                                        <div
                                            key={variant._id}
                                            className={`flex flex-col items-center px-4 py-2 border-2 rounded-lg transition-all ${selectedVariant === index
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {variant?.variantImages?.[0] && (
                                                <Image
                                                    src={variant?.variantImages[0]}
                                                    alt={variant.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            )}
                                            {variant?.type && (
                                                <div
                                                    className="mt-2 h-4 w-4 rounded-full"
                                                    style={{ backgroundColor: variant?.type }}
                                                    title={variant?.type}
                                                />
                                            )}
                                            {variant.weight > 0 && (
                                                <div className="mt-1 text-gray-700 text-sm">
                                                    {variant.weight}
                                                </div>
                                            )}
                                            <div className="mt-1 text-xs text-gray-500">
                                                Stock: {variant.stock}
                                            </div>
                                            <button
                                                onClick={() => handleVariantSelect(index)}
                                                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Select
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Category: </span>
                                    <span className="font-medium">{singleProduct?.category?.name || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Brand: </span>
                                    <span className="font-medium">{singleProduct?.brand?.name || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Created At: </span>
                                    <span className="font-medium">
                                        {new Date(singleProduct?.createdAt).toLocaleDateString() || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Last Updated: </span>
                                    <span className="font-medium">
                                        {new Date(singleProduct?.updatedAt).toLocaleDateString() || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetails