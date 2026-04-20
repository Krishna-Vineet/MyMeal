import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import useToastStore from '../store/toastStore'

export default function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex min-w-[300px] items-center gap-3 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500" />
            )}
            <p className="flex-1 text-sm font-semibold text-[#1f1308]">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-[#8f6f55] hover:text-[#1f1308]">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
