// Static lists for the Help page. Categories + popular articles are
// authored content; status comes from a real status-page later but for now
// the rows are hard-coded.

export const HELP_CATEGORIES = [
  { id: "getting-started", title: "Getting started",        sub: "Set up your profile, link GitHub, find your first match.", articles: 8,  color: "coral",  icon: "rocket" },
  { id: "profile",         title: "Profile & verification", sub: "Edit details, verify accounts, manage your stack.",         articles: 12, color: "amber",  icon: "user"   },
  { id: "matching",        title: "Matching & swipes",      sub: "How ranking works. Boosts, rewind, daily limits.",         articles: 9,  color: "coral",  icon: "merge"  },
  { id: "chat",            title: "Chat & code blocks",     sub: "Triple-backtick syntax, attachments, code review.",         articles: 6,  color: "violet", icon: "code"   },
  { id: "privacy",         title: "Privacy & safety",       sub: "Block, report, pause matching, delete your data.",         articles: 11, color: "violet", icon: "shield" },
  { id: "billing",         title: "Billing & Premium",      sub: "Plans, payment, refunds, team-of-2 setup.",                articles: 7,  color: "amber",  icon: "card"   },
];

export const HELP_STATUS = [
  { service: "API",             state: "ok",       note: "operational" },
  { service: "Matching",        state: "ok",       note: "operational" },
  { service: "Chat & socket",   state: "degraded", note: "slow delivery in EU-west" },
  { service: "Payments",        state: "ok",       note: "operational" },
];

export const HELP_POPULAR = [
  { id: 1, cat: "matching", title: "Why is my queue empty?",                     ago: "2d ago" },
  { id: 2, cat: "profile",  title: "Verifying your GitHub handle",               ago: "3d ago" },
  { id: 3, cat: "chat",     title: "Triple-backtick code blocks with diff",      ago: "5d ago" },
  { id: 4, cat: "billing",  title: "How rewinds count against the Pro quota",    ago: "1w ago" },
  { id: 5, cat: "privacy",  title: "Pause matching without losing your queue",   ago: "1w ago" },
  { id: 6, cat: "billing",  title: "Switching from monthly to annual",           ago: "2w ago" },
];
