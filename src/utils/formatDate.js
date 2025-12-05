export const formatDate = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0]; 
};
