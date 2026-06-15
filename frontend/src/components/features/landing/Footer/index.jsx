const LandingFooter = ({ copy }) => {
  return (
    <footer className="pt-8 pb-14 border-t border-mm-border mt-16 relative">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 relative z-[1] flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 font-mono font-medium text-xs text-mm-ink-3">
          <span className="w-[22px] h-[22px] rounded-[6px] bg-mm-ink text-mm-bg inline-flex items-center justify-center font-mono font-semibold text-[12px]">
            M
          </span>
          <span>{copy.footerCopy}</span>
          <span className="text-mm-success">● {copy.footerStatus}</span>
        </div>
        <div className="flex gap-5 text-[13px] text-mm-ink-3">
          {copy.footerLinks.map((l) => (
            <a key={l} href="#" className="hover:text-mm-ink">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
