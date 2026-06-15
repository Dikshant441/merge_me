const PRODUCT_LINKS = [
  { label: "About" },
  { label: "How it works" },
  { label: "Premium" },
  { label: "Changelog" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy" },
  { label: "Terms of Service" },
  { label: "Cookie Policy" },
  { label: "Help & FAQ" },
];

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ColHeading = ({ children }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="w-[3px] h-3.5 rounded-full bg-gradient-to-b from-mm-coral-2 to-mm-coral" />
    <span className="font-mono font-semibold text-[11px] tracking-[0.12em] uppercase text-mm-ink">
      {children}
    </span>
  </div>
);

const SocialBtn = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 rounded-full border border-mm-border-2 bg-mm-surface hover:bg-mm-paper hover:border-mm-border text-mm-ink-2 hover:text-mm-ink transition inline-flex items-center justify-center"
  >
    {children}
  </a>
);

const Footer = ({ mobileSectionLinks = [] }) => (
  <footer className="border-t border-mm-border bg-mm-bg font-sans">
    {mobileSectionLinks.length > 0 && (
      <div className="border-b border-mm-border md:hidden">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {mobileSectionLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[13px] text-mm-ink-2 hover:text-mm-ink transition no-underline"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    )}

    <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1.4fr] gap-8 sm:gap-10">
        {/* Column 1 — Product */}
        <div>
          <ColHeading>Product</ColHeading>
          <ul className="flex flex-col gap-2.5">
            {PRODUCT_LINKS.map(({ label }) => (
              <li key={label}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[13px] text-mm-ink-2 hover:text-mm-ink transition no-underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 — Legal */}
        <div>
          <ColHeading>Legal</ColHeading>
          <ul className="flex flex-col gap-2.5">
            {LEGAL_LINKS.map(({ label }) => (
              <li key={label}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[13px] text-mm-ink-2 hover:text-mm-ink transition no-underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Connect */}
        <div className="col-span-2 sm:col-span-1">
          <ColHeading>Connect</ColHeading>
          <p className="text-[13px] text-mm-ink-2 mb-4 leading-relaxed">
            Built by devs, for devs.
          </p>
          <div className="flex items-center gap-2.5">
            <SocialBtn href="https://github.com/Dikshant441" label="GitHub">
              <GitHubIcon />
            </SocialBtn>
            <SocialBtn href="https://x.com/Dikshant441" label="Twitter / X">
              <TwitterIcon />
            </SocialBtn>
            <SocialBtn href="https://www.linkedin.com/in/dikshant-singh/" label="LinkedIn">
              <LinkedInIcon />
            </SocialBtn>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-mm-border">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-mm-ink-3 font-mono">
        <span>© {new Date().getFullYear()} Merge Me. All rights reserved.</span>
        <span>Made with ♥ for the open-source community</span>
      </div>
    </div>
  </footer>
);

export default Footer;
