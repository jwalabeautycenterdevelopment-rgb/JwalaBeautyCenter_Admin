import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 120, damping: 15 },
    },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } },
};

const ConfirmDeleteModal = ({ isOpen, title, onConfirm, onCancel, loading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="bg-white rounded-xl w-full max-w-sm p-6 space-y-4 text-center"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <p className="text-lg font-semibold">{title || "Are you sure?"}</p>
                        <div className="flex justify-center space-x-4">
                            <Button
                                onClick={onConfirm}
                                className="bg-red-600 text-white cursor-pointer hover:bg-red-700"
                            >
                                {loading ? "Deleting.." : "Delete"}
                            </Button>
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-600 border border-gray-300 cursor-pointer rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDeleteModal;
