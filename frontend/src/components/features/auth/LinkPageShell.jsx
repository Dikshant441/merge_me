import { useState } from "react";
import AuthNav from "./AuthNav";
import Showcase from "./Showcase";

const LinkPageShell = ({ copy, children, contentClassName = "" }) => {
  const [showIdx, setShowIdx] = useState(0);

  return (
    <div className="relative min-h-full bg-mm-bg text-mm-ink font-sans antialiased overflow-x-hidden">
      <div className="landing-bg" />
      <div className="relative z-[1] flex flex-col min-h-screen">
        <AuthNav copy={copy} />
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 px-8 pt-6 sm:pt-8 pb-12 max-w-[1280px] w-full mx-auto items-stretch max-[520px]:px-5">
          <div className="hidden lg:block">
            <Showcase copy={copy} idx={showIdx} setIdx={setShowIdx} />
          </div>

          <section className="bg-transparent border-0 shadow-none rounded-none p-0 lg:bg-mm-surface lg:border lg:border-mm-border lg:rounded-3xl lg:shadow-[var(--mm-shadow-card)] lg:p-10 min-h-[560px] flex flex-col justify-center">
            <div className={`w-full max-w-[420px] mx-auto ${contentClassName}`.trim()}>{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LinkPageShell;
