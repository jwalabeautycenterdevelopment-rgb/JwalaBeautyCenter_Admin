import { FileX, X } from "lucide-react";
import * as XLSX from "xlsx";

const BulkProductUploadModal = ({
    open,
    onClose,
    excelFile,
    setExcelFile,
    previewData,
    setPreviewData,
    onUpload,
}) => {
    if (!open) return null;

    const handleExcelChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setExcelFile(file);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const workbook = XLSX.read(evt.target.result, {
                type: "binary",
            });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const data = XLSX.utils.sheet_to_json(sheet);
            setPreviewData(data);
        };
        reader.readAsBinaryString(file);
    };

    const handleClose = () => {
        setExcelFile(null);
        setPreviewData([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-7xl rounded-xl shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-5 ">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Bulk Product Upload
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Upload Excel file and preview before importing
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                </div>
                <div className="p-4 ">
                    <label className="border-2 border-dashed  rounded-2xl p-10 flex flex-col items-center cursor-pointer hover:bg-green-50 transition">
                        <h3 className="font-semibold text-lg">
                            Upload Excel File
                        </h3>

                        <p className="text-gray-500">
                            Drag & Drop or Click to Browse
                        </p>

                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={handleExcelChange}
                        />
                    </label>
                </div>
                {previewData.length > 0 && (
                    <div className="px-6 pb-6">
                        <div className="flex justify-between mb-3">
                            <h3 className="font-semibold">
                                Preview Data
                            </h3>

                            <span className=" px-3 py-1 rounded-full">
                                {previewData.length} Products
                            </span>
                        </div>
                        <div className="max-h-[200px] overflow-auto border scrollbar-hide rounded-xl">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr>
                                        {Object.keys(previewData[0]).map((key) => (
                                            <th
                                                key={key}
                                                className="border p-3 text-left font-semibold"
                                            >
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {previewData.slice(0, 20).map((row, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            {Object.values(row).map((value, i) => (
                                                <td
                                                    key={i}
                                                    className="border p-3"
                                                >
                                                    {String(value ?? "")}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <div className="flex justify-end gap-3 p-6 ">
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 border text-sm rounded-xl cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onUpload}
                        className="px-6 py-2 text-sm bg-green-600 text-white rounded-xl cursor-pointer"
                    >
                        Upload Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkProductUploadModal;