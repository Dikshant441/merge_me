// Membership prices in rupees (INR). paymentRoutes converts to paise (× 100)
// before calling Razorpay, which expects the amount in the smallest unit.
// SKUs map to the frontend plans (see frontend premium/data.js):
//   gold   → Pro        → ₹999
//   silver → Team-of-2  → ₹1999
// Note: this is the monthly price; annual billing isn't differentiated here.
const MermbershipPrice: Record<string, number> = {
  gold: 999, // Pro
  silver: 1999, // Team-of-2
};

export default MermbershipPrice;
