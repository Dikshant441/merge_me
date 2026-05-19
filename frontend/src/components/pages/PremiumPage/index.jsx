import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router";
import { BASEURL } from "../../../constants";
import PageHeader from "../../shared/PageHeader";
import PlanCard from "../../features/premium/PlanCard";
import FaqAccordion from "../../features/premium/FaqAccordion";
import BillingTable from "../../features/premium/BillingTable";
import { PLANS } from "../../features/premium/data";

const Premium = () => {
  const { copy } = useOutletContext();
  const [annual, setAnnual] = useState(true);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASEURL + "/premium/verify", {
        withCredentials: true,
      });
      if (res.data.isPremium) setIsPremiumUser(true);
    } catch (err) {
      console.log("Verify Response Error => ", err.response?.data?.msg);
    }
  };

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const handleBuyClick = async (sku) => {
    if (!sku) return;
    try {
      const order = await axios.post(
        BASEURL + "/payment/create",
        { membershipType: sku },
        { withCredentials: true }
      );
      const { key_id, amount, currency, orderId, notes } = order.data;

      const options = {
        key: key_id,
        amount,
        currency,
        name: "Merge me",
        description: "Premium subscription",
        order_id: orderId,
        prefill: {
          name:
            (notes?.first_name || "Dishant") +
            " " +
            (notes?.last_name || "singh"),
          email: notes?.emailId || "dishantsingh441@gmail.com",
          contact: "9876543212",
          membershipType: notes?.membershipType || "",
        },
        theme: { color: "#F37254" },
        handler: verifyPremiumUser,
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={copy.app.premium.eyebrow}
        titleA={copy.app.premium.titleA}
        titleEm={copy.app.premium.titleEm}
        titleB={copy.app.premium.titleB}
        sub={copy.app.premium.sub}
      />

      {isPremiumUser && (
        <div className="mb-6 p-4 rounded-[12px] bg-mm-paper border border-mm-border text-mm-ink-2 text-[13.5px]">
          {copy.app.premium.alreadyPremium}
        </div>
      )}

      {/* billing cycle toggle */}
      <div className="inline-flex p-1 gap-0.5 bg-mm-paper border border-mm-border rounded-full mb-7">
        <CycleBtn active={!annual} onClick={() => setAnnual(false)}>
          {copy.app.premium.billingMonthly}
        </CycleBtn>
        <CycleBtn active={annual} onClick={() => setAnnual(true)}>
          {copy.app.premium.billingAnnual}
          <span className="font-mono font-medium text-[10.5px] px-[7px] py-[3px] rounded-full mm-pill-success">
            {copy.app.premium.annualNote}
          </span>
        </CycleBtn>
      </div>

      {/* plan grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px] mb-9">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            annual={annual}
            copy={copy}
            onBuy={handleBuyClick}
          />
        ))}
      </div>

      {/* FAQ + billing history */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5 mb-7">
        <Section>
          <SectionHead
            title={
              <span>
                {copy.app.premium.faqTitleA}
                <em className="not-italic">
                  <span className="font-serif italic font-normal mm-grad-text text-[1.08em]">
                    {copy.app.premium.faqTitleEm}
                  </span>
                </em>
                {copy.app.premium.faqTitleB}
              </span>
            }
            eyebrow={copy.app.premium.faqEyebrow}
          />
          <FaqAccordion />
        </Section>

        <Section>
          <SectionHead
            title={copy.app.premium.receiptsTitle}
            eyebrow={copy.app.premium.receiptsEyebrow}
          />
          <BillingTable copy={copy} />
        </Section>
      </div>

      <p className="text-center text-mm-ink-3 font-mono font-medium text-[12px] mt-2">
        {copy.app.premium.legalA}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-mm-ink-2 border-b border-dashed border-mm-ink-4 hover:text-mm-ink">
          {copy.app.premium.legalTerms}
        </a>
        {copy.app.premium.legalAnd}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-mm-ink-2 border-b border-dashed border-mm-ink-4 hover:text-mm-ink">
          {copy.app.premium.legalRefund}
        </a>
      </p>
    </>
  );
};

const CycleBtn = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "px-4 py-2 font-medium text-[13px] rounded-full inline-flex items-center gap-2 transition",
      active
        ? "bg-mm-ink text-mm-bg shadow-[0_1px_0_rgba(255,255,255,.14)_inset]"
        : "bg-transparent text-mm-ink-2 hover:text-mm-ink",
    ].join(" ")}
  >
    {children}
  </button>
);

const Section = ({ children }) => (
  <div className="bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]">
    {children}
  </div>
);

const SectionHead = ({ title, eyebrow }) => (
  <div className="flex items-baseline justify-between mb-3.5">
    <h2 className="m-0 font-semibold text-[18px] tracking-[-0.02em]">{title}</h2>
    <span className="font-mono font-medium text-[11px] text-mm-ink-3 uppercase tracking-[.08em]">
      {eyebrow}
    </span>
  </div>
);

export default Premium;
