import type { Metadata } from "next";
import ContactClient from "./ContactClient"; // move client code here

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with StylishBlazer for bulk orders, pricing, and catalogue. We respond within 24 hours.",
  alternates: {
    canonical: "https://stylishblazer.in/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
