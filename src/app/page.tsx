"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

const MIN_LOAN = 100000;
const MAX_LOAN = 50000000;
const MIN_RATE = 6;
const MAX_RATE = 20;
const MIN_TENURE = 1;
const MAX_TENURE = 30;

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(value)
  );
}

function calculateEMI(principal: number, annualRatePercent: number, years: number) {
  const monthlyRate = annualRatePercent / 12 / 100;
  const months = years * 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

const SAMPLE_LOAN = 4000000;
const SAMPLE_RATE = 8.5;
const SAMPLE_TENURE = 20;
const SAMPLE_EMI = calculateEMI(SAMPLE_LOAN, SAMPLE_RATE, SAMPLE_TENURE);

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="37" height="37" rx="10" fill="var(--color-indigo)" />
      <path
        d="M11 21.5 L20 13 L29 21.5 V28.5 A1.5 1.5 0 0 1 27.5 30 H12.5 A1.5 1.5 0 0 1 11 28.5 Z"
        fill="none"
        stroke="var(--color-cream)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="var(--color-gold)"
        fontFamily="var(--font-heading)"
      >
        ₹
      </text>
    </svg>
  );
}

function AnimatedCounter({ value, prefix = "₹" }: { value: number; prefix?: string }) {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(formatINR(value));
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(formatINR(latest)),
    });
    return () => controls.stop();
  }, [value, reduceMotion, motionValue]);

  return (
    <span>
      {prefix}
      {display}
    </span>
  );
}

function DonutChart({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const principalShare = total > 0 ? principal / total : 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const principalLength = circumference * principalShare;

  return (
    <svg viewBox="0 0 180 180" className="w-full max-w-[200px]" role="img" aria-label="Principal versus interest breakdown">
      <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--color-gold)" strokeWidth="22" />
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke="var(--color-emerald)"
        strokeWidth="22"
        strokeDasharray={`${principalLength} ${circumference}`}
        strokeDashoffset="0"
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
      />
      <text x="90" y="84" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-ink)" fontFamily="var(--font-heading)">
        {Math.round(principalShare * 100)}%
      </text>
      <text x="90" y="102" textAnchor="middle" fontSize="9" fill="var(--color-ink)" opacity="0.6">
        Principal
      </text>
    </svg>
  );
}

type SliderFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
};

function SliderField({ label, value, onChange, min, max, step, prefix, suffix }: SliderFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-ink/70">{label}</label>
        <div className="flex items-center gap-1 rounded-lg border border-ink/10 bg-white px-3 py-1.5 shadow-sm">
          {prefix && <span className="text-sm text-ink/60">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
            className="w-20 rounded-md bg-transparent text-right text-sm font-semibold text-ink outline-none [appearance:textfield] focus-visible:ring-2 focus-visible:ring-indigo"
          />
          {suffix && <span className="text-sm text-ink/60">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#why-nivaas", label: "Why Nivaas" },
];

function Navbar({ onCalculate }: { onCalculate: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass fixed top-0 z-50 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="font-[var(--font-heading)] text-lg font-bold tracking-tight text-ink">
            Nivaas
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            onClick={onCalculate}
            className="cursor-pointer rounded-full bg-indigo px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Calculate Now
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ink/10 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M4 4 L16 16 M16 4 L4 16" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 5 H17 M3 10 H17 M3 15 H17" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-ink/10 px-5 pb-5 pt-2 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-mist hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onCalculate();
                }}
                className="mt-2 cursor-pointer rounded-full bg-indigo px-5 py-2.5 text-sm font-semibold text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                Calculate Now
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({
  calculatorRef,
}: {
  calculatorRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/hero.mp4"
      title="Your Dream Home"
      date="Home Loan EMI Calculator"
      scrollToExpand="Scroll to explore ↓"
    >
      <div className="relative mx-auto max-w-4xl bg-ink px-5 pb-20 pt-4 text-center text-cream sm:px-8 sm:pb-28">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl sm:leading-tight">
          Buying a flat in Mumbai?
          <br />
          Know your EMI before the builder asks for the booking amount.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-cream/70 sm:text-lg">
          Nivaas turns your loan amount, interest rate and tenure into one clear monthly
          number — so you walk into SBI, HDFC, ICICI or your local cooperative bank
          already knowing what you can afford.
        </p>

        <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-cream/70">
            Estimated monthly EMI for a ₹40,00,000 loan at 8.5% for 20 years
          </p>
          <p className="mt-2 font-[var(--font-heading)] text-4xl font-extrabold text-cream sm:text-5xl">
            <AnimatedCounter value={SAMPLE_EMI} />
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() =>
              calculatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="cursor-pointer rounded-full bg-gold px-8 py-4 text-base font-bold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Calculate My EMI
          </button>
        </div>
      </div>

      <Calculator calculatorRef={calculatorRef} />
      <HowItWorks />
      <WhyChooseUs />
    </ScrollExpandMedia>
  );
}

function Calculator({ calculatorRef }: { calculatorRef: React.RefObject<HTMLDivElement | null> }) {
  const [loanAmount, setLoanAmount] = useState(SAMPLE_LOAN);
  const [interestRate, setInterestRate] = useState(SAMPLE_RATE);
  const [tenure, setTenure] = useState(SAMPLE_TENURE);

  const { emi, totalAmount, totalInterest } = useMemo(() => {
    const monthlyEMI = calculateEMI(loanAmount, interestRate, tenure);
    const total = monthlyEMI * tenure * 12;
    return {
      emi: monthlyEMI,
      totalAmount: total,
      totalInterest: total - loanAmount,
    };
  }, [loanAmount, interestRate, tenure]);

  return (
    <section id="calculator" ref={calculatorRef} className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Run the numbers on your home loan
          </h2>
          <p className="mt-3 text-ink/60">
            Move the sliders or type exact figures — your results update instantly.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-8">
              <SliderField
                label="Loan Amount"
                value={loanAmount}
                onChange={setLoanAmount}
                min={MIN_LOAN}
                max={MAX_LOAN}
                step={10000}
                prefix="₹"
              />
              <SliderField
                label="Interest Rate"
                value={interestRate}
                onChange={setInterestRate}
                min={MIN_RATE}
                max={MAX_RATE}
                step={0.05}
                suffix="%"
              />
              <SliderField
                label="Loan Tenure"
                value={tenure}
                onChange={setTenure}
                min={MIN_TENURE}
                max={MAX_TENURE}
                step={1}
                suffix="yrs"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-indigo p-6 text-cream shadow-lg shadow-indigo/20 sm:p-8">
            <p className="text-sm font-medium text-cream/70">Your Monthly EMI</p>
            <p className="mt-1 font-[var(--font-heading)] text-5xl font-extrabold sm:text-6xl">
              ₹{formatINR(emi)}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-cream/15 pt-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-cream/60">Total Interest</p>
                <p className="mt-1 text-xl font-bold">₹{formatINR(totalInterest)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-cream/60">Total Amount Payable</p>
                <p className="mt-1 text-xl font-bold">₹{formatINR(totalAmount)}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-cream/10 p-6 sm:flex-row sm:justify-around">
              <DonutChart principal={loanAmount} interest={totalInterest} />
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: "var(--color-emerald)" }} />
                  <span>Principal: ₹{formatINR(loanAmount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: "var(--color-gold)" }} />
                  <span>Interest: ₹{formatINR(totalInterest)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const steps = [
  {
    title: "Set Your Loan Details",
    description:
      "Drag the sliders for loan amount, interest rate and tenure — built to cover everything from a small-town starter home to a metro penthouse.",
  },
  {
    title: "Watch the Numbers Update Live",
    description:
      "Your EMI, total interest and total payable amount recalculate instantly, with a live principal-versus-interest breakdown.",
  },
  {
    title: "Walk Into Any Bank Prepared",
    description:
      "Use your numbers to compare offers from different lenders and negotiate your rate with confidence.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-mist px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            How Nivaas works
          </h2>
          <p className="mt-3 text-ink/60">Three steps between you and a clear monthly number.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={fadeUp.initial}
              whileInView={fadeUp.whileInView}
              viewport={fadeUp.viewport}
              transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
              className="rounded-2xl border border-ink/10 bg-white p-6"
            >
              <h3 className="text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IconRange() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7h18M3 17h18" stroke="var(--color-indigo)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="2.5" fill="var(--color-cream)" stroke="var(--color-indigo)" strokeWidth="2" />
      <circle cx="15" cy="17" r="2.5" fill="var(--color-cream)" stroke="var(--color-indigo)" strokeWidth="2" />
    </svg>
  );
}

function IconDonut() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="var(--color-gold)" strokeWidth="3" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="var(--color-emerald)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z"
        stroke="var(--color-indigo)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="var(--color-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="var(--color-indigo)" strokeWidth="2" />
      <path d="M10.5 18.5h3" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const trustPoints = [
  {
    icon: IconRange,
    title: "Built for Indian loan slabs",
    description:
      "Sliders run from ₹1 lakh to ₹5 crore at 6%–20%, matching real home loan slabs from SBI, HDFC, ICICI and PNB.",
  },
  {
    icon: IconDonut,
    title: "See where your money goes",
    description:
      "The live donut chart shows exactly how much of your EMI is principal versus interest paid to the bank.",
  },
  {
    icon: IconShield,
    title: "100% on your device",
    description:
      "Every calculation happens in your browser. Nothing you type is sent to a server, stored, or shared.",
  },
  {
    icon: IconPhone,
    title: "Built for one-handed use",
    description:
      "Designed mobile-first, so you can run the numbers while standing in a builder's office or bank branch.",
  },
];

function WhyChooseUs() {
  return (
    <section id="why-nivaas" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Why choose Nivaas
          </h2>
          <p className="mt-3 text-ink/60">
            A calculator built around how home loans actually work in India.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={fadeUp.initial}
                whileInView={fadeUp.whileInView}
                viewport={fadeUp.viewport}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className="rounded-2xl border border-ink/10 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-mist">
                  <Icon />
                </div>
                <h3 className="text-base font-bold text-ink">{point.title}</h3>
                <p className="mt-2 text-sm text-ink/60">{point.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-mist px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="font-[var(--font-heading)] text-lg font-bold text-ink">Nivaas</span>
        </div>
        <p className="text-sm text-ink/60">Your home. Your numbers. No surprises.</p>
        <p className="max-w-xl text-xs text-ink/60">
          This calculator is for indicative purposes only. Actual EMI may vary based on
          lender terms.
        </p>
        <p className="text-xs text-ink/60">© 2025 Nivaas. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-cream">
      <Navbar onCalculate={scrollToCalculator} />
      <main className="flex-1">
        <Hero calculatorRef={calculatorRef} />
      </main>
      <Footer />
    </div>
  );
}
