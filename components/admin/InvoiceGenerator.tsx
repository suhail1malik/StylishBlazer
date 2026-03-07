"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Download, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Calendar,
  Hash,
  IndianRupee,
  CheckCircle2,
  Printer,
  Save,
  ChevronLeft,
  Settings2
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  brandName: string;
  brandContact: string;
  brandEmail: string;
  brandAddress: string;
  brandGST: string;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  clientAddress: string;
  clientGST: string;
  items: InvoiceItem[];
  notes: string;
  taxType: "none" | "gst";
  cgstRate: number;
  sgstRate: number;
}

const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: `SB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toISOString().split('T')[0],
  brandName: "StylishBlazer",
  brandContact: "+91 7906200663",
  brandEmail: "contact@stylishblazer.com",
  brandAddress: "Bareilly, Uttar Pradesh, India",
  brandGST: "09AAACC4119D1Z5", // Example/Placeholder
  clientName: "",
  clientContact: "",
  clientEmail: "",
  clientAddress: "",
  clientGST: "",
  items: [
    { id: "1", description: "Bespoke Italian Wool Blazer", quantity: 1, price: 12500 }
  ],
  notes: "1. All disputes are subject to Bareilly jurisdiction.\n2. Goods once sold will not be taken back.\n3. This is a computer generated invoice.",
  taxType: "none",
  cgstRate: 9,
  sgstRate: 9
};

export default function InvoiceGenerator({ onSaveSuccess, initialData }: { onSaveSuccess?: () => void, initialData?: any }) {
  const [data, setData] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load initial data if provided (e.g., when clicking from dashboard)
  useEffect(() => {
    if (initialData) {
      // Create a fresh object to avoid mutation issues
      setData({
        ...DEFAULT_INVOICE,
        ...initialData,
        // Ensure date is in YYYY-MM-DD for the input[type=date]
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : DEFAULT_INVOICE.date
      });
    } else {
      setData(DEFAULT_INVOICE);
    }
  }, [initialData]);

  // Draft persistence for new invoices only
  useEffect(() => {
    if (!initialData) {
      const saved = localStorage.getItem("invoice_draft");
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load draft");
        }
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) {
      localStorage.setItem("invoice_draft", JSON.stringify(data));
    }
  }, [data, initialData]);

  // Calculations
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const cgst = data.taxType === "gst" ? subtotal * (data.cgstRate / 100) : 0;
  const sgst = data.taxType === "gst" ? subtotal * (data.sgstRate / 100) : 0;
  const total = subtotal + cgst + sgst;

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Math.random().toString(), description: "", quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    if (data.items.length === 1) return;
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleSave = async (silent: boolean = false) => {
    if (!data.clientName && !silent) return alert("Please enter client name");
    if (!data.clientName) return; // Silent skip

    setIsSaving(true);
    try {
      // Remove ID to ensure we create a new record (Template behavior)
      const { id, ...payload } = data as any;
      
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          subtotal,
          cgst,
          sgst,
          total
        })
      });
      if (res.ok) {
        if (!silent) alert("Invoice saved successfully!");
        onSaveSuccess?.();
        // Clear draft after successful save/export
        localStorage.removeItem("invoice_draft");
      } else if (!silent) {
        const error = await res.json();
        alert(error.error || "Failed to save invoice");
      }
    } catch (err) {
      if (!silent) alert("Something went wrong while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    
    // Auto-save on export (creating a new record/template)
    await handleSave(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const black: [number, number, number] = [0, 0, 0];
        const darkGray: [number, number, number] = [64, 64, 64];

        const ROWS_PER_PAGE = 8;
        const totalItems = data.items.length;
        const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE) || 1;

        const drawHeader = (pdf: typeof doc, pageNum: number) => {
          // --- Header Section with Border (B&W) ---
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.8);
          // Fixed position for header on every page
          pdf.roundedRect(15, 15, 180, 45, 2, 2, "D"); // Reduced height from 50 to 45

          // Aligned Brand Info (Left)
          pdf.setTextColor(black[0], black[1], black[2]);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(28);
          pdf.text(data.brandName.toUpperCase(), 25, 33);
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.text(data.brandAddress, 25, 41);
          pdf.text(`Contact: ${data.brandContact}`, 25, 46);
          
          if (data.taxType === "gst" && data.brandGST) {
            pdf.setFont("helvetica", "bold");
            pdf.text(`GST NO: ${data.brandGST}`, 25, 51);
            pdf.setFont("helvetica", "normal");
            pdf.text(`| Email: ${data.brandEmail}`, 65, 51);
          } else {
            pdf.text(`Email: ${data.brandEmail}`, 25, 51);
          }

          // Aligned Invoice Meta (Right)
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(20);
          pdf.setTextColor(180, 180, 180); 
          pdf.text("INVOICE", 145, 33);
          
          pdf.setFontSize(10);
          pdf.setTextColor(black[0], black[1], black[2]);
          pdf.text(`# ${data.invoiceNumber}`, 145, 41);
          pdf.text(`Date: ${data.date}`, 145, 46);
          pdf.text(`Page: ${pageNum} of ${totalPages}`, 145, 51);

          // --- Client Section with Border ---
          // Reduced margin: Moving BILL TO up
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text("BILL TO:", 20, 72); // Moved from 85 to 72
          
          // Border for Client Section
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.3);
          pdf.rect(20, 75, 100, 25, "D"); // Reduced height from 30 to 25

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.text(data.clientName || "CLIENT NAME", 25, 81);
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.text(data.clientAddress || "Client Address", 25, 87);
          const contactGst = data.taxType === "gst" && data.clientGST 
            ? `GST: ${data.clientGST} | Ph: ${data.clientContact}`
            : `Ph: ${data.clientContact} | Email: ${data.clientEmail}`;
          pdf.text(contactGst, 25, 93);
        };

        for (let i = 0; i < totalPages; i++) {
          if (i > 0) doc.addPage();
          drawHeader(doc, i + 1);

          const startIdx = i * ROWS_PER_PAGE;
          const pageItems = data.items.slice(startIdx, startIdx + ROWS_PER_PAGE);
          
          // Fill with empty rows if less than ROWS_PER_PAGE
          const tableData = pageItems.map((item, index) => [
            (startIdx + index + 1).toString(),
            item.description,
            item.quantity.toString(),
            `Rs. ${item.price.toLocaleString()}`,
            `Rs. ${(item.quantity * item.price).toLocaleString()}`
          ]);

          while (tableData.length < ROWS_PER_PAGE) {
            tableData.push(["", "", "", "", ""]);
          }

          autoTable(doc, {
            startY: 105, // Moved from 125 to 105 due to reduced header space
            head: [['NO.', 'DESCRIPTION', 'QTY', 'UNIT PRICE', 'AMOUNT']],
            body: tableData,
            theme: 'striped', // Striped instead of grid to avoid force-drawing all lines
            columnStyles: {
              0: { cellWidth: 12, halign: 'center' },
              1: { cellWidth: 'auto' },
              2: { cellWidth: 15, halign: 'center' },
              3: { cellWidth: 35, halign: 'right' },
              4: { cellWidth: 35, halign: 'right' }
            },
            styles: { 
              fontSize: 9, 
              cellPadding: 4, 
              textColor: [0, 0, 0], 
              lineColor: [0, 0, 0], 
              lineWidth: 0.1,
              valign: 'middle'
            },
            headStyles: { 
              fillColor: [0, 0, 0], 
              textColor: [255, 255, 255], 
              fontStyle: 'bold',
              lineWidth: 0
            },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            didDrawCell: (data) => {
                // If it's a real item, draw the bottom border manually if needed
                // Or just use 'striped' which looks cleaner without empty borders
            },
            margin: { left: 20, right: 20 },
          });

          // Draw a border around the entire table ONLY for real items
          const tableFinalY = (doc as any).lastAutoTable.finalY;
          const realItemsHeight = (pageItems.length * 9) + 12; // Approximation
          // If we want a box only for real items, we'd draw it here.
          // But 'striped' + no empty borders is what was requested.

          // Draw totals only on the final page
          if (i === totalPages - 1) {
            const pageHeight = doc.internal.pageSize.height;
            const totalSectionY = pageHeight - 65;

            // Box for Totals (Grand Total on Right)
            const boxWidth = 85;
            const boxX = 105;
            const boxHeight = data.taxType === "gst" ? 40 : 20;

            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.roundedRect(boxX, totalSectionY - 5, boxWidth, boxHeight, 1, 1, "D");

            doc.setFontSize(10);
            
            let currentY = totalSectionY + 2;
            doc.setFont("helvetica", "normal");
            doc.text("Subtotal:", boxX + 5, currentY);
            doc.text(`Rs. ${subtotal.toLocaleString()}`, boxX + boxWidth - 5, currentY, { align: 'right' });

            if (data.taxType === "gst") {
              currentY += 7;
              doc.text(`CGST (${data.cgstRate}%):`, boxX + 5, currentY);
              doc.text(`Rs. ${cgst.toLocaleString()}`, boxX + boxWidth - 5, currentY, { align: 'right' });
              currentY += 7;
              doc.text(`SGST (${data.sgstRate}%):`, boxX + 5, currentY);
              doc.text(`Rs. ${sgst.toLocaleString()}`, boxX + boxWidth - 5, currentY, { align: 'right' });
            }

            // Grand Total
            currentY += 10;
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("GRAND TOTAL:", boxX + 5, currentY);
            doc.text(`Rs. ${total.toLocaleString()}`, boxX + boxWidth - 5, currentY, { align: 'right' });

            // Notes (On Left)
            const notesX = 20;
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.text("TERMS & CONDITIONS", notesX, totalSectionY);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            const splitNotes = doc.splitTextToSize(data.notes, 75);
            doc.text(splitNotes, notesX, totalSectionY + 6);

            // Footer
            doc.setFontSize(8);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(150, 150, 150);
            doc.text("Authorized Signatory for StylishBlazer", 140, pageHeight - 15);
          }
        }

        doc.save(`${data.invoiceNumber}.pdf`);
      } catch (error) {
        console.error("PDF Export failed:", error);
        alert("Wait kijiye, PDF generate nahi ho payi.");
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* ── Editor Section ────────────────────────────────────────────── */}
      <div className="xl:col-span-5 space-y-6 order-2 xl:order-1">
        <section className="bg-white rounded-[32px] p-6 md:p-8 shadow-premium border border-slate-200/60 transition-all">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Settings2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Invoice Controls</h3>
            </div>
            <div className="flex gap-2">
                <button 
                   onClick={() => handleSave()}
                   disabled={isSaving}
                   className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                 <Save className="w-3.5 h-3.5" />
                 {isSaving ? "Saving..." : "Save Record"}
               </button>
            </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Business Details (Owner)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                      <input 
                         placeholder="e.g. StylishBlazer"
                         className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                         value={data.brandName}
                         onChange={e => setData({...data, brandName: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">My GST Number</label>
                      <input 
                         placeholder="Owner GSTIN (if active)"
                         className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                         value={data.brandGST}
                         onChange={e => setData({...data, brandGST: e.target.value})}
                      />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Invoice Number</label>
                   <input 
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={data.invoiceNumber}
                      onChange={e => setData({...data, invoiceNumber: e.target.value})}
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
                   <input 
                      type="date"
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={data.date}
                      onChange={e => setData({...data, date: e.target.value})}
                   />
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Customer Details</p>
                <div className="space-y-4">
                  <input 
                    placeholder="Full Client Name"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={data.clientName}
                    onChange={e => setData({...data, clientName: e.target.value})}
                  />
                   <textarea 
                     placeholder="Customer Address"
                     rows={2}
                     className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                     value={data.clientAddress}
                     onChange={e => setData({...data, clientAddress: e.target.value})}
                   />
                   {data.taxType === "gst" && (
                    <input 
                      placeholder="Customer GST Number"
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all animate-in fade-in slide-in-from-top-2 duration-300"
                      value={data.clientGST}
                      onChange={e => setData({...data, clientGST: e.target.value})}
                    />
                   )}
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-slate-50">
               <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Articles</p>
                  <button onClick={addItem} className="text-[10px] font-bold text-emerald-600 uppercase hover:underline">Add Item +</button>
               </div>
               <div className="space-y-3">
                 {data.items.map((item) => (
                   <div key={item.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 relative group">
                      <input 
                        placeholder="Item Description"
                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0"
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                      />
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input 
                            type="number"
                            placeholder="Qty"
                            className="w-full bg-white border border-slate-100 rounded-lg px-2 py-1 text-xs"
                            value={item.quantity}
                            onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex-1">
                          <input 
                            type="number"
                            placeholder="Price"
                            className="w-full bg-white border border-slate-100 rounded-lg px-2 py-1 text-xs"
                            value={item.price}
                            onChange={e => updateItem(item.id, 'price', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Tax Configuration</p>
                <div className="flex gap-4">
                   <button 
                     onClick={() => setData({...data, taxType: "none"})}
                     className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${data.taxType === "none" ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                   >
                     No GST
                   </button>
                   <button 
                     onClick={() => setData({...data, taxType: "gst"})}
                     className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${data.taxType === "gst" ? "bg-emerald-950 text-emerald-400 shadow-lg" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                   >
                     GST Active
                   </button>
                </div>
                {data.taxType === "gst" && (
                   <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">CGST Rate (%)</label>
                         <input 
                            type="number"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={data.cgstRate}
                            onChange={e => setData({...data, cgstRate: parseFloat(e.target.value) || 0})}
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">SGST Rate (%)</label>
                         <input 
                            type="number"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={data.sgstRate}
                            onChange={e => setData({...data, sgstRate: parseFloat(e.target.value) || 0})}
                         />
                      </div>
                   </div>
                )}
             </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
             <button 
               onClick={downloadPDF}
               disabled={isGenerating}
               className="w-full bg-emerald-950 text-emerald-50 rounded-2xl py-4 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/20 active:scale-95 transition-all"
             >
               {isGenerating ? "Preparing Artifact..." : <><Download className="w-4 h-4" /> Export Professional PDF</>}
             </button>
          </div>
        </section>
      </div>

      {/* ── Reality Preview Section ───────────────────────────────────── */}
      <div className="xl:col-span-7 order-1 xl:order-2">
        <div className="sticky top-28">
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">
              <Printer className="w-3.5 h-3.5" />
              Reality Preview (Actual Layout)
           </div>
           
           <div className="bg-white shadow-2xl rounded-2xl md:rounded-[32px] overflow-hidden border border-slate-200/60 relative flex flex-col p-4 md:p-10 font-sans text-slate-900 w-full min-h-[600px] md:aspect-[1/1.4]">
              {/* Header Preview */}
              <div className="border border-slate-900 rounded-xl p-4 md:p-6 mb-6 md:mb-12 flex flex-col md:flex-row justify-between items-start gap-4">
                 <div>
                    <h2 className="text-xl md:text-3xl font-serif font-bold mb-2 break-all">{data.brandName.toUpperCase()}</h2>
                    <div className="space-y-1 text-[10px] text-slate-500 font-medium leading-tight">
                       <p>{data.brandAddress}</p>
                       <p>Contact: {data.brandContact}</p>
                       {data.brandGST && (
                         <p className="text-slate-900 font-bold mt-1">GST: {data.brandGST}</p>
                       )}
                       <p>Email: {data.brandEmail}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-4xl font-serif font-bold text-slate-200 mb-2">INVOICE</div>
                    <p className="text-xs font-bold"># {data.invoiceNumber}</p>
                    <p className="text-[10px] font-medium text-slate-500">{data.date}</p>
                 </div>
              </div>

              {/* Client Preview */}
              <div className="mb-10 px-2 border border-slate-900 rounded-xl p-4 max-w-[300px]">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">BILL TO:</p>
                 <h4 className="text-base font-bold mb-1">{data.clientName || "NAME OF CLIENT"}</h4>
                 <div className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    <p>{data.clientAddress || "FULL ADDRESS COORDINATES"}</p>
                    <p>{data.clientContact}</p>
                    {data.clientGST && (
                      <p className="text-slate-900 font-bold mt-1">GST: {data.clientGST}</p>
                    )}
                 </div>
              </div>

              {/* Items Preview */}
              <div className="flex-1 overflow-x-auto pb-4">
                 <table className="w-full text-left text-[11px] min-w-[500px] md:min-w-0">
                    <thead>
                       <tr className="bg-slate-900 text-white font-bold tracking-wider">
                          <th className="py-2.5 px-4 rounded-l-lg font-bold w-12 text-center">NO.</th>
                          <th className="py-2.5 px-4 font-bold">DESCRIPTION</th>
                          <th className="py-2.5 px-4 text-center font-bold w-16">QTY</th>
                          <th className="py-2.5 px-4 text-right font-bold w-24">UNIT PRICE</th>
                          <th className="py-2.5 px-4 text-right rounded-r-lg font-bold w-32">AMOUNT</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {data.items.map((item, idx) => (
                          <tr key={idx} className="text-slate-600 font-medium">
                             <td className="py-2 md:py-4 px-2 md:px-4 text-center">{idx + 1}</td>
                             <td className="py-2 md:py-4 px-2 md:px-4 break-words min-w-[150px] max-w-[200px] md:max-w-none">
                               <p className="whitespace-pre-wrap leading-relaxed">{item.description || "Article Description"}</p>
                             </td>
                             <td className="py-2 md:py-4 px-2 md:px-4 text-center">{item.quantity}</td>
                             <td className="py-2 md:py-4 px-2 md:px-4 text-right">₹{item.price.toLocaleString()}</td>
                             <td className="py-2 md:py-4 px-2 md:px-4 text-right font-bold text-slate-900">₹{(item.quantity * item.price).toLocaleString()}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Bottom Totals Section */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start gap-8 px-2">
                 <div className="max-w-[250px] text-left">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</p>
                    <p className="text-[8px] text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                       {data.notes}
                    </p>
                 </div>

                 <div className="w-64 p-6 rounded-xl border border-slate-900 bg-slate-50 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-400">
                       <span>Subtotal</span>
                       <span className="font-bold text-slate-700">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {data.taxType === "gst" && (
                       <>
                          <div className="flex justify-between items-center text-[10px] font-medium text-slate-400">
                             <span>CGST ({data.cgstRate}%)</span>
                             <span className="font-bold text-slate-700">₹{cgst.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-medium text-slate-400">
                             <span>SGST ({data.sgstRate}%)</span>
                             <span className="font-bold text-slate-700">₹{sgst.toLocaleString()}</span>
                          </div>
                       </>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Grand Total</span>
                       <span className="text-xl font-bold">₹{total.toLocaleString()}</span>
                    </div>
                 </div>
              </div>

              {/* Authentic Signatory Area */}
              <div className="mt-10 pt-4 text-right">
                 <p className="text-[8px] font-medium italic text-slate-400">Authorized Signatory</p>
                 <p className="text-[10px] font-bold text-slate-900 mt-0.5">StylishBlazer Boutique</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
