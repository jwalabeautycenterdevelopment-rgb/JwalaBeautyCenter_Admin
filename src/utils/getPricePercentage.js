export function getPricePayload(price, offerPrice) {
  if (!price || price <= 0) {
    return { price, offerPrice, offerPercentage: 0 };
  }

  const offerPercentage = ((price - offerPrice) / price) * 100;

  return {
    price,
    offerPrice,
    offerPercentage: Number(offerPercentage.toFixed(2)),
  };
}
