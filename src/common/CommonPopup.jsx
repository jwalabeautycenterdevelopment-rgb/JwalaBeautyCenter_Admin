import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

/**
 * @param {boolean} isOpen
 * @param {function} onClose - function to close modal
 * @param {ReactNode} children - any content inside modal
 * @param {string} title - optional title
 */
const PopupModal = ({ isOpen, onClose, children, title }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white/80 backdrop-blur-md rounded-xl w-full max-w-md p-6 space-y-2 relative border border-white/20 shadow-lg max-h-[90vh] overflow-y-auto scrollbar-hide"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title && (
                            <div className="flex justify-between items-start">
                                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <div>{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopupModal;
