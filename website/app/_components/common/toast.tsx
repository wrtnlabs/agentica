import { motion } from "framer-motion";

interface ToastProps {
  message: string
}

export const Toast = ({ message }: ToastProps) => {
  return (
      <motion.div 
        className="max-w-md mx-auto w-full text-base text-gray-800 font-bold text-center bg-gray-200 rounded-xl py-3"
      >
        {message}
      </motion.div>
    )
}