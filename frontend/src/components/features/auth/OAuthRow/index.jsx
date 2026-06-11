import { GitHubIcon, GoogleIcon } from "../icons";

// OAuth provider row — visual only. The actual auth handlers aren't wired
// yet; clicking just prevents the form submit so we don't navigate away.
// The "recommended" hint sits next to GitHub because that's the verification
// path we lean on hardest (see landing copy.features[2]).

const OAUTH_URLS = {
  github: "/api/auth/github",
  google: "/api/auth/google",
  gitlab: null,
};

const OAuthRow = ({ copy }) => {
  const buttons = [
    {
      key: "github",
      label: copy.auth.oauthGitHub,
      Icon: GitHubIcon,
      hint: copy.auth.oauthHint,
    },
    { key: "google", label: copy.auth.oauthGoogle, Icon: GoogleIcon },
  ];

  return (
    <div className="flex flex-col gap-2.5 mb-[22px]">
      {buttons.map(({ key, label, Icon, hint }) => (
        <button
          key={key}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const url = OAUTH_URLS[key];
            if (url) window.location.href = url;
          }}
          className="h-11 px-4 rounded-[10px] bg-mm-surface border border-mm-border-2 text-mm-ink text-sm font-medium inline-flex items-center justify-center gap-2.5 hover:-translate-y-px hover:bg-mm-paper transition"
        >
          <Icon />
          <span>{label}</span>
          {hint && (
            <span className="ml-auto font-mono font-medium text-xs text-mm-ink-3">
              {hint}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default OAuthRow;
