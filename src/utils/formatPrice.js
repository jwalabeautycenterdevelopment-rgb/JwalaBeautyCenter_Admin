export const formatPrice = (amount) => `₹${Number(amount || 0).toFixed(0)}`;

export const getProductCardPrice = (product) => {
  const hasValidVariant =
    Boolean(product?.isVariant) &&
    Array.isArray(product?.variants) &&
    product.variants.length > 0 &&
    product.variants[0]?.price;

  if (hasValidVariant) {
    const v = product.variants[0];
    return {
      price: Number(v.price),
      offerPrice: v.offerPrice ? Number(v.offerPrice) : null,
    };
  }
  return {
    price: Number(product.price),
    offerPrice: product.offerPrice ? Number(product.offerPrice) : null,
  };
};

export const calculateDiscount = (original, offer) => {
  const o = Number(original);
  const of = Number(offer);
  if (!o || !of || of >= o) return 0;

  return Math.round(((o - of) / o) * 100);
};
