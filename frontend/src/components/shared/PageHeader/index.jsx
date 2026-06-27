// Eyebrow + gradient-em h1 + right-aligned sub. Shared by every logged-in page.

const PageHeader = ({ eyebrow, titleA, titleEm, titleB, sub }) => {
  return (
    <div className="flex items-end justify-between gap-6 mb-6 max-[720px]:flex-col max-[720px]:items-start">
      <div>
        {eyebrow && (
          <div className="font-mono font-medium text-[11px] uppercase tracking-[.08em] text-mm-coral-2 dark:text-mm-coral">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1.5 text-[28px] leading-[1.1] tracking-[-0.025em] font-semibold">
          {titleA}
          <em className="not-italic">
            <span className="font-serif italic font-normal mm-grad-text text-[1.08em]">
              {titleEm}
            </span>
          </em>
          {titleB}
        </h1>
      </div>
      {sub && (
        <p className="text-mm-ink-3 text-[13.5px] text-right max-w-[360px] m-0 max-[720px]:text-left">
          {sub}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
