import { motion, AnimatePresence } from "framer-motion";
const CommonViewPopup = ({ isOpen, onClose, children, title }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        className="fixed inset-0 flex justify-center items-center z-50 px-4"
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 40 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg  relative">
                            <div className="max-h-[75vh] overflow-y-auto">
                                {children}
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute cursor-pointer top-3 right-3 bg-gray-100 hover:bg-gray-200 h-8 w-8 flex items-center justify-center rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommonViewPopup;
