'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  if (!phone) return null;

  return (
    <motion.a
      href={`https://wa.me/${phone}?text=${encodeURIComponent('Hi! I have a question about your products.')}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full bg-green-500 text-white shadow-2xl flex items-center justify-center hover:bg-green-600 transition-colors"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" fill="white" />
      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
    </motion.a>
  );
}
