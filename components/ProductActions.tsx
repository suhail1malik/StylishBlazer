"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModal";
import { MessageSquare, Send } from "lucide-react";

interface ProductActionsProps {
  productName: string;
  productImage?: string;
  productUrl?: string;
  whatsappNumber?: string;
}

export default function ProductActions({
  productName,
  productImage,
  productUrl,
  whatsappNumber = "917906200663",
}: ProductActionsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const whatsappMessage = `Hi, I'm interested in ${productName}. Please share catalogue and pricing.`;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] text-white py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#20ba5a] transition-all shadow-lg shadow-green-500/20 group"
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp Boutique
        </a>
        <button
          onClick={() => setModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-3 bg-emerald-600 text-white py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-glow-green group"
        >
          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          Request Catalogue
        </button>
      </div>

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={productName}
        productImage={productImage}
        productUrl={productUrl}
      />
    </>
  );
}
