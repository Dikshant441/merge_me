import {
  Check,
  X,
  User,
  Star,
  Crown,
  Sparkles,
  Zap,
  Shield,
  MessageSquare,
  Infinity,
} from "lucide-react";

const Premium = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Floating sparkles */}
        <Sparkles
          className="absolute top-32 left-1/4 w-6 h-6 text-amber-400/40 animate-bounce"
          style={{ animationDuration: "3s" }}
        />
        <Sparkles
          className="absolute top-64 right-1/3 w-4 h-4 text-purple-400/40 animate-bounce"
          style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
        />
        <Sparkles
          className="absolute bottom-40 left-1/5 w-5 h-5 text-blue-400/40 animate-bounce"
          style={{ animationDuration: "2.8s", animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 py-16 px-4 md:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white/80">
              Premium Membership
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-amber-200 mb-6 leading-tight tracking-tight">
            Unlock Your Full Potential
          </h1>

          <p className="text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan to supercharge your networking experience.
            Connect, message, and grow without limits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {/* Free Plan */}
          <div className="group relative h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative h-full flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:-translate-y-2">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mb-6 shadow-lg">
                <User className="w-7 h-7 text-slate-200" />
              </div>

              {/* Plan Info */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <p className="text-slate-400 text-sm">
                  Perfect for getting started
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Free</span>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  No credit card required
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm">
                    Message <strong className="text-white">friends only</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm">
                    <strong className="text-white">20</strong> connection
                    requests/day
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-slate-500 text-sm">
                    Blue verified badge
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-slate-500 text-sm">
                    Message non-connections
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-slate-500 text-sm">
                    Priority support
                  </span>
                </div>
              </div>

              {/* Button */}
              <button className="mt-auto w-full py-4 px-6 rounded-xl bg-white/5 border border-white/20 text-white font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/30">
                Current Plan
              </button>
            </div>
          </div>

          {/* Silver Plan */}
          <div className="group relative h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-400/30 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-100/10 to-slate-200/5 backdrop-blur-xl rounded-3xl border border-slate-300/30 p-8 transition-all duration-500 hover:border-slate-300/50 hover:-translate-y-2">
              {/* Silver shimmer effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-current" />
                  POPULAR
                </div>
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center mb-6 shadow-lg shadow-slate-500/20 mt-2">
                <Star className="w-7 h-7 text-white fill-current" />
              </div>

              {/* Plan Info */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Silver</h3>
                <p className="text-slate-400 text-sm">Expand your reach</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$9</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  Billed quarterly • 3 months
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow relative">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm">
                    Message{" "}
                    <strong className="text-white">20 non-connections</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm">
                    <strong className="text-white">100</strong> connection
                    requests/day
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm">
                    Profile <strong className="text-white">boost</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-slate-500 text-sm">
                    Blue verified badge
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-slate-500 text-sm">
                    Priority support
                  </span>
                </div>
              </div>

              {/* Button */}
              <button className="mt-auto w-full py-4 px-6 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold transition-all duration-300 hover:from-slate-500 hover:to-slate-600 shadow-lg shadow-slate-800/30 hover:shadow-xl hover:shadow-slate-800/40">
                Upgrade to Silver
              </button>
            </div>
          </div>

          {/* Gold Plan - Featured */}
          <div className="group relative h-full">
            {/* Glowing border effect */}
            <div
              className="absolute -inset-[2px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-3xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
              style={{ animationDuration: "3s" }}
            />

            <div className="relative h-full flex flex-col bg-gradient-to-br from-amber-950/90 via-orange-950/90 to-amber-950/90 backdrop-blur-xl rounded-3xl border border-amber-500/50 p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              {/* Animated shimmer overlay */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent"
                  style={{
                    animation: "shimmer 3s ease-in-out infinite",
                    transform: "translateX(-100%)",
                  }}
                />
              </div>

              {/* Decorative corner glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />

              {/* Best Value Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 text-xs font-black shadow-lg shadow-amber-500/30 flex items-center gap-1.5">
                  <Crown className="w-3 h-3 fill-current" />
                  BEST VALUE
                </div>
              </div>

              {/* Icon */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 mt-2">
                <Crown className="w-7 h-7 text-amber-950 fill-current" />
                {/* Sparkle accent */}
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300" />
              </div>

              {/* Plan Info */}
              <div className="mb-8 relative">
                <h3 className="text-2xl font-bold text-amber-100 mb-2">Gold</h3>
                <p className="text-amber-300/70 text-sm">
                  Unlimited everything
                </p>
              </div>

              {/* Price */}
              <div className="mb-8 relative">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                    $19
                  </span>
                  <span className="text-amber-400/70">/month</span>
                </div>
                <p className="text-amber-500/50 text-sm mt-1">
                  Billed bi-annually • 6 months
                </p>
                <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <Zap className="w-3 h-3" />
                  Save 40%
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow relative">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <Infinity className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-amber-100 text-sm">
                    <strong className="text-amber-300">Unlimited</strong>{" "}
                    messaging
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <Infinity className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-amber-100 text-sm">
                    <strong className="text-amber-300">Unlimited</strong>{" "}
                    requests
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-amber-100 text-sm">
                    <strong className="text-amber-300">Blue verified</strong>{" "}
                    badge
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-amber-100 text-sm">
                    <strong className="text-amber-300">Priority</strong> support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-amber-100 text-sm">
                    <strong className="text-amber-300">Early access</strong> to
                    features
                  </span>
                </div>
              </div>

              {/* Button */}
              <button className="mt-auto relative w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 font-bold transition-all duration-300 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 overflow-hidden group/btn">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4" />
                  Get Gold Now
                </span>
                {/* Button shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Instant Activation</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            Have questions?{" "}
            <a
              href="#"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              View our FAQ
            </a>{" "}
            or{" "}
            <a
              href="#"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              contact support
            </a>
          </p>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Premium;
