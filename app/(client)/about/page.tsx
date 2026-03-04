"use client";

import type { Metadata } from "next";
import { Sparkles, Target, Users, Zap, Shield, Award, ChevronRight } from "lucide-react";
import { 
  FadeIn, 
  StaggerGrid, 
  StaggerItem, 
  SectionHeading 
} from "@/components/AnimatedSections";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Dark Header */}
      <div 
        className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-20 text-center"
        style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a2e1f 45%, #0f2218 100%)" }}
      >
        {/* Grid Lines Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            eyebrow={<><Sparkles className="w-3.5 h-3.5" /> Our Heritage</>}
            title="Crafting Excellence Since 2010"
            subtitle="StylishBlazer represents the pinnacle of premium Indian manufacturing and sartorial design."
            light={true}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 lg:px-6">
        {/* Stats Row */}
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20 md:mb-32">
            {[
              { value: "15+", label: "Years Experience", icon: <Award className="w-4 h-4" /> },
              { value: "500+", label: "Unique Designs", icon: <Target className="w-4 h-4" /> },
              { value: "50+", label: "Retail Partners", icon: <Users className="w-4 h-4" /> },
              { value: "10K+", label: "Products Delivered", icon: <Shield className="w-4 h-4" /> },
            ].map((stat, i) => (
              <div
                key={i}
                className="group p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-premium transition-all duration-500 text-center"
              >
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-emerald-600 transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Brand Story Layout - Centered for focus */}
        <div className="max-w-3xl mx-auto mb-32">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                A Chandigarh-Based Workshop <br />
                <span className="text-emerald-600 italic font-medium text-2xl md:text-4xl">With Global Vision</span>
              </h2>
            </div>
            <div className="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed text-center">
              <p>
                Founded in the heart of Chandigarh, StylishBlazer was born from a singular mission: to redefine the standards of outerwear manufacturing in India. We believe that premium quality shouldn't be an elusive luxury, but a tangible promise woven into every fiber of our garments.
              </p>
              <p>
                Our master tailors combine decades of traditional craftsmanship with cutting-edge manufacturing technology. This synergy allows us to produce long coats and blazers that aren't just articles of clothing, but shields of confidence for the modern individual.
              </p>
              <p>
                Today, as we scale our production for national retailers and global brands, our commitment remains anchored in the same small-workshop integrity that defined our first day in 2010.
              </p>
            </div>
            {/* Hand-Finished Tag */}
            <div className="mt-10 flex justify-center">
              <div className="bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Hand-Finished Quality · Indian Craftsmanship</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Values - High-End Layout */}
        <div className="text-center mb-16">
          <SectionHeading
            eyebrow="Our Compass"
            title="The Values That Guide Us"
            subtitle="Integrity and craftsmanship aren't just words; they are the foundation of our manufacturing process."
          />
        </div>

        <StaggerGrid className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "Quality Integrity",
              desc: "Every stitch is inspected. We select only the highest-grade woolens and premium blends for maximum longevity.",
              icon: <Shield className="w-5 h-5" />,
              delay: 0
            },
            {
              title: "Ethical Craft",
              desc: "We support our artisans by providing fair living wages and maintaining a workspace that respects human dignity.",
              icon: <Users className="w-5 h-5" />,
              delay: 0.1
            },
            {
              title: "Prompt Commitment",
              desc: "We respect the rhythm of retail. Our supply chain is optimized to ensure your orders arrive exactly when promised.",
              icon: <Zap className="w-5 h-5" />,
              delay: 0.2
            }
          ].map((value, i) => (
            <StaggerItem key={i}>
              <div className="p-8 md:p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-100 hover:shadow-xl transition-all duration-500 group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 mb-6 group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>

      {/* Bottom CTA Section - Small/Premium */}
      <FadeIn className="bg-slate-900 py-16 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 mb-4">Partner With Us</p>
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Let's Create Exceptional Together</h2>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-glow-green"
          >
            Start an Inquiry
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </FadeIn>
    </div>
  );
}
