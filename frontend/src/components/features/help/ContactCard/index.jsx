import { Send } from "lucide-react";

const ContactCard = ({ copy }) => {
  return (
    <div className="mm-contact-tint bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]">
      <h3 className="m-0 mb-1.5 font-semibold text-[17px] tracking-[-0.02em]">
        {copy.app.help.contactH}
      </h3>
      <p className="m-0 mb-3.5 text-mm-ink-2 text-[13.5px] leading-[1.5]">
        {copy.app.help.contactSub}
      </p>
      <div className="flex gap-2 items-center flex-wrap">
        <a
          href="mailto:hello@mergeme.dev"
          className="h-10 px-3.5 rounded-[10px] bg-mm-ink text-mm-bg font-medium text-[13px] inline-flex items-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.14)_inset] hover:-translate-y-px transition"
        >
          <Send size={14} strokeWidth={1.7} /> {copy.app.help.contactCta}
        </a>
        <span className="font-mono font-medium text-[12px] text-mm-ink-3">
          {copy.app.help.contactNote}
        </span>
      </div>
    </div>
  );
};

export default ContactCard;
