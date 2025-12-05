export const statusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("processing")) return { label: "Processing", classes: "bg-purple-100 text-purple-700" };
    if (s.includes("ship") || s.includes("shipping")) return { label: "Shipping", classes: "bg-amber-100 text-amber-700" };
    if (s.includes("deliv")) return { label: "Delivered", classes: "bg-emerald-100 text-emerald-700" };
    if (s.includes("cancel")) return { label: "Cancelled", classes: "bg-red-100 text-red-700" };
    if (s.includes("confirmed")) return { label: "Confirmed", classes: "bg-blue-100 text-blue-700" };
    return { label: status || "Unknown", classes: "bg-gray-100 text-gray-700" };
};

export const paymentStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("paid")) return { label: "Paid", classes: "bg-emerald-100 text-emerald-700" };
    if (s.includes("unpaid")) return { label: "Unpaid", classes: "bg-red-100 text-red-700" };
    return { label: status || "Unknown", classes: "bg-gray-100 text-gray-700" };
};