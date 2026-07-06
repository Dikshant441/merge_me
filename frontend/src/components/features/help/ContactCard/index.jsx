import { Mail, Phone, Send } from "lucide-react";

// Full-width "Still stuck?" contact card: email + phone on the left, CTA right.
const CONTACT_EMAIL = "hello@mergeme.dev";
const CONTACT_PHONE_DISPLAY = "+91 98765 43210";
const CONTACT_PHONE_TEL = "+919876543210";

const ContactCard = ({ copy }) => {
  const c = copy.app.help;
  return (
    <div className="mm-contact-tint bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="min-w-0">
          <h3 className="m-0 mb-1.5 font-semibold text-[17px] tracking-[-0.02em]">
            {c.contactH}
          </h3>
          <p className="m-0 mb-3.5 text-mm-ink-2 text-[13.5px] leading-[1.5]">
            {c.contactSub}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2.5 text-[14px] text-mm-ink hover:text-mm-coral transition"
            >
              <span className="w-8 h-8 rounded-[9px] bg-mm-paper border border-mm-border inline-flex items-center justify-center text-mm-ink-3">
                <Mail size={15} strokeWidth={1.7} />
              </span>
              <span className="font-medium">{CONTACT_EMAIL}</span>
            </a>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="inline-flex items-center gap-2.5 text-[14px] text-mm-ink hover:text-mm-coral transition"
            >
              <span className="w-8 h-8 rounded-[9px] bg-mm-paper border border-mm-border inline-flex items-center justify-center text-mm-ink-3">
                <Phone size={15} strokeWidth={1.7} />
              </span>
              <span className="font-medium font-mono">{CONTACT_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="h-10 px-4 rounded-[10px] bg-mm-ink text-mm-bg font-medium text-[13px] inline-flex items-center justify-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.14)_inset] hover:-translate-y-px transition flex-shrink-0 self-start md:self-auto"
        >
          <Send size={14} strokeWidth={1.7} /> {c.contactCta}
        </a>
      </div>
    </div>
  );
};

export default ContactCard;
