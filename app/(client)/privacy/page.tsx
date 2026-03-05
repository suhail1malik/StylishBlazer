import { SectionHeading, FadeIn } from "@/components/AnimatedSections";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | StylishBlazer",
  description: "Privacy Policy and data protection terms for StylishBlazer.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
              <Shield className="w-8 h-8" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Privacy Policy
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-12">
              Last Updated: March 2026
            </p>

            <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                <p>
                  At StylishBlazer, we collect information that you directly provide to us, such as your name, 
                  email address, phone number, and any business details provided during your inquiry process. 
                  We also collect technical data automatically when you interact with our website to improve your 
                  browsing experience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                <p>
                  We rely on your information to provide our bespoke manufacturing services, communicate updates 
                  about your bulk orders, and improve our platform. We deeply respect your privacy and will never 
                  sell your personal data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">3. Data Protection Strategies</h2>
                <p>
                  We implement robust technical and organizational measures to safeguard your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. Our APIs are protected by 
                  rate limiting and our databases rely on modern encryption standards.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">4. Contact Us</h2>
                <p>
                  If you have any questions or concerns regarding this policy, or wish to exercise your rights 
                  regarding your data, please contact us at:
                </p>
                <ul className="mt-4 list-disc pl-5">
                  <li><strong>Email:</strong> privacy@stylishblazer.com</li>
                  <li><strong>Phone:</strong> +91 7906200663</li>
                </ul>
              </section>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
