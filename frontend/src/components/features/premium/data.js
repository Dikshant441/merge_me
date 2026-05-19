// Plan definitions + FAQ for the Premium page. Static for now — billing
// history will come from a real /billing/invoices endpoint later (the
// receipts table currently renders sample rows from copy.js).
//
// `sku` maps each plan to the backend membership tier so handleBuyClick
// keeps working without changes to /payment/create. Free has no SKU.

export const PLANS = [
  {
    id: "free",
    sku: null,
    name: "Free",
    blurb: "Open source.",
    priceMo: 0,
    priceYr: 0,
    popular: false,
    features: [
      ["limited", "20 swipes / day"],
      ["yes",     "Match by stack overlap"],
      ["yes",     "Chat in code blocks"],
      ["yes",     "GitHub verification"],
      ["no",      "See who's interested in you"],
      ["no",      "Rewind your last swipe"],
      ["no",      "Travel mode"],
      ["no",      "Profile boosts"],
    ],
  },
  {
    id: "pro",
    sku: "gold",
    name: "Pro",
    blurb: "For devs who actually want to merge.",
    priceMo: 12,
    priceYr: 9,
    popular: true,
    features: [
      ["yes",     "Unlimited swipes"],
      ["yes",     "Match by stack overlap"],
      ["yes",     "Chat in code blocks"],
      ["yes",     "GitHub + LinkedIn + SO verification"],
      ["yes",     "See who's interested in you"],
      ["yes",     "Rewind your last swipe"],
      ["yes",     "Travel mode (any radius)"],
      ["limited", "1 profile boost / week"],
    ],
  },
  {
    id: "team",
    sku: "silver",
    name: "Team-of-2",
    blurb: "For couples who already merged.",
    priceMo: 18,
    priceYr: 14,
    popular: false,
    features: [
      ["yes",     "Everything in Pro"],
      ["yes",     "Shared profile"],
      ["yes",     "Joint calendar"],
      ["yes",     "Anniversary git log"],
      ["yes",     "Priority support"],
      ["yes",     "Discord access"],
      ["yes",     "4 profile boosts / week"],
    ],
  },
];

export const PREMIUM_FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings → Billing and your plan stays active until the end of the current cycle. No prorated refunds.",
  },
  {
    q: "What is a profile boost?",
    a: "A boost pushes your profile to the top of nearby queues for 30 minutes. Pro gets one a week; Team-of-2 gets four.",
  },
  {
    q: "Does Team-of-2 require both accounts to subscribe?",
    a: "No. One partner pays and links the other account. Both get full Pro perks plus the shared profile, joint calendar, and Discord access.",
  },
  {
    q: "How does rewind work?",
    a: "Tap rewind (⌘Z) within 60 seconds of any swipe to put that profile back at the top of your queue. Available on Pro and Team-of-2.",
  },
  {
    q: "Is my payment info secure?",
    a: "We never see your card. All payments go through Razorpay, which is PCI DSS Level 1 certified. You can revoke at any time from Settings.",
  },
];

// Placeholder billing history rows — replace with /billing/invoices later.
// Format per row: [item, when, amount, status]. status: "paid" or "trial".
export const SAMPLE_RECEIPTS = [
  ["Pro · monthly", "sample · jul 2026", "$12.00", "paid"],
  ["Pro · monthly", "sample · jun 2026", "$12.00", "paid"],
  ["Pro · setup",   "sample · may 2026", "$0.00",  "trial"],
];
