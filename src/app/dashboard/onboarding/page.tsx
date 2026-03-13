"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Store, ShoppingBag, Globe, Check, ChevronLeft } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const platforms = [
  { id: "amazon", name: "Amazon", icon: Store, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { id: "shopify", name: "Shopify", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
  { id: "ebay", name: "eBay", icon: Globe, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
];

const presets = [5, 10, 15, 20];

// Confetti particle component
function Particle({ delay, x }: { delay: number; x: number }) {
  const colors = ["bg-emerald-400", "bg-emerald-500", "bg-amber-400", "bg-blue-400", "bg-purple-400", "bg-pink-400"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${color}`}
      initial={{ opacity: 1, y: 0, x: x, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, -120 - Math.random() * 80],
        x: [x, x + (Math.random() - 0.5) * 200],
        scale: [1, 0.5],
        rotate: [0, Math.random() * 360],
      }}
      transition={{
        duration: 1.5 + Math.random() * 0.5,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [threshold, setThreshold] = useState(15);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  function next() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function back() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function togglePlatform(id: string) {
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function finish() {
    localStorage.setItem("profitpulse-onboarded", "true");
    router.push("/dashboard");
  }

  const atLeastOneConnected = Object.values(connected).some(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card className="w-full max-w-lg overflow-hidden relative">
        {/* Back Button */}
        {step > 0 && (
          <button
            onClick={back}
            className="absolute top-4 left-4 z-10 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <div className="p-8 min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Welcome */}
            {step === 0 && (
              <motion.div
                key="welcome"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center flex-1 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  <Logo size="lg" className="justify-center mb-6" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Stop Guessing Your Margins
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                  73% of Amazon sellers overestimate their profit by 20% or more
                </p>
                <Button
                  onClick={next}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-base rounded-lg"
                >
                  Get Started
                </Button>
              </motion.div>
            )}

            {/* Step 2: Connect Platforms */}
            {step === 1 && (
              <motion.div
                key="platforms"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col flex-1 pt-8"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Connect Your Platforms
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                  At least 1 platform required
                </p>

                <div className="space-y-3 flex-1">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isConnected = connected[platform.id];
                    return (
                      <motion.button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          isConnected
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${platform.bg} flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${platform.color}`} />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {platform.name}
                          </span>
                        </div>
                        <div className="relative">
                          <AnimatePresence mode="wait">
                            {isConnected ? (
                              <motion.div
                                key="connected"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
                              >
                                <Check className="h-4 w-4 text-white" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="connect"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-gray-400 dark:text-gray-500 font-medium"
                              >
                                Connect
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <Button
                  onClick={next}
                  disabled={!atLeastOneConnected}
                  className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed w-full py-3 rounded-lg"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 3: Set Alerts */}
            {step === 2 && (
              <motion.div
                key="alerts"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col flex-1 pt-8"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Set Your Alerts
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                  Get alerted when profit drops below...
                </p>

                <div className="flex-1 space-y-6">
                  {/* Threshold Display */}
                  <div className="text-center">
                    <motion.span
                      key={threshold}
                      initial={{ scale: 1.3, color: "#10B981" }}
                      animate={{ scale: 1, color: "#10B981" }}
                      className="text-5xl font-bold"
                    >
                      {threshold}%
                    </motion.span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">margin threshold</p>
                  </div>

                  {/* Slider */}
                  <div className="px-2">
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex gap-2 justify-center">
                    {presets.map((p) => (
                      <button
                        key={p}
                        onClick={() => setThreshold(p)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          threshold === p
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>

                  {/* Notification Toggles */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email notifications
                      </span>
                      <Switch
                        checked={emailNotif}
                        onCheckedChange={setEmailNotif}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Push notifications
                      </span>
                      <Switch
                        checked={pushNotif}
                        onCheckedChange={setPushNotif}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={next}
                  className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white w-full py-3 rounded-lg"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 4: Ready */}
            {step === 3 && (
              <motion.div
                key="ready"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center flex-1 text-center relative overflow-hidden"
              >
                {/* Confetti Particles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <Particle
                      key={i}
                      delay={0.1 + i * 0.05}
                      x={(i - 12) * 8}
                    />
                  ))}
                </div>

                {/* Animated Checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                  className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"
                >
                  <motion.div
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <Check className="h-10 w-10 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  You&apos;re All Set!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 dark:text-gray-400 mb-8"
                >
                  Your dashboard is ready with 127 SKUs loaded
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={finish}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
