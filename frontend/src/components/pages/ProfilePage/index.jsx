import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { Edit, Check, MapPin, Clock, GitMerge, GitBranch, Github, Linkedin } from "lucide-react";
import { BASEURL } from "../../../constants";
import { addUser } from "../../../store/user/slice";
import PageHeader from "../../shared/PageHeader";
import CompletenessRing from "../../features/profile/CompletenessRing";
import Overview from "../../features/profile/Overview";
import Stack from "../../features/profile/Stack";
import Activity from "../../features/profile/Activity";
import Settings from "../../features/profile/Settings";
import {
  VERIFIED_DEFAULT,
  PREFS_DEFAULT,
  LANGS_DEFAULT,
  PRONOUNS_DEFAULT,
  HANDLE_DEFAULT,
  COVER_DEFAULT,
  COMPLETENESS_DEFAULT,
} from "../../features/profile/data";

// Profile — hero (cover + avatar + identity + Edit CTA) and 4 tabs:
// Overview / Stack / Activity / Settings. Edit-mode is local until Save
// dispatches PATCH /profile/edit and writes back to the user slice.

const TABS = ["overview", "stack", "activity", "settings"];

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user);
  const { copy } = useOutletContext();
  const [tab, setTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");

  if (!user) return null;

  // Fill in display-only fields that the backend user object may not have yet.
  const full = {
    ...user,
    handle: user.handle || HANDLE_DEFAULT,
    pronouns: user.pronouns || PRONOUNS_DEFAULT,
    cover: user.cover || COVER_DEFAULT,
    role: user.role || "Engineer",
    company: user.company || "—",
    location: user.location || "—",
    timezone: user.timezone || "—",
    langs: user.langs || LANGS_DEFAULT,
    github: user.github || VERIFIED_DEFAULT.github,
    linkedin: user.linkedin || VERIFIED_DEFAULT.linkedin,
    stackoverflow: user.stackoverflow || VERIFIED_DEFAULT.stackoverflow,
    prefs: user.prefs || PREFS_DEFAULT,
    completeness: user.completeness || COMPLETENESS_DEFAULT,
    skills: user.skills || [],
    about: user.about || "",
  };

  const enterEdit = () => {
    setDraft({
      first_name: full.first_name,
      last_name: full.last_name,
      photoURL: full.photoURL,
      age: full.age || "",
      gender: full.gender || "",
      about: full.about,
      skills: full.skills,
    });
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(null);
    setError("");
  };

  const save = async () => {
    setError("");
    try {
      const res = await axios.patch(BASEURL + "/profile/edit", draft, {
        withCredentials: true,
      });
      dispatch(addUser(res?.data?.data));
      setEditing(false);
      setDraft(null);
    } catch (err) {
      setError(err.response?.data || "Failed to save");
    }
  };

  const view = editing ? { ...full, ...draft } : full;

  return (
    <>
      <PageHeader
        eyebrow={copy.app.profile.eyebrow}
        titleA={copy.app.profile.titleA}
        titleEm={view.first_name || copy.app.profile.titleEm}
        titleB={copy.app.profile.titleB}
        sub={copy.app.profile.sub}
      />

      <div className="relative rounded-[20px] overflow-hidden bg-mm-paper border border-mm-border shadow-[var(--mm-shadow-soft)] mb-6">
        <div className="h-[200px] relative overflow-hidden">
          <img src={full.cover} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          <button
            type="button"
            className="absolute top-4 right-4 px-2.5 py-1.5 rounded-[8px] bg-white/[.16] border border-white/[.30] text-white font-medium text-[12px] inline-flex items-center gap-1.5 backdrop-blur-[10px] z-[2]"
          >
            <Edit size={12} strokeWidth={1.7} /> {copy.app.profile.changeCover}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[140px_minmax(0,1fr)_auto] gap-[22px] px-7 pb-6 -mt-[68px] items-end relative">
          <div className="relative">
            <div
              className="w-[140px] h-[140px] rounded-[24px] border-4 border-mm-surface bg-cover bg-center shadow-[var(--mm-shadow-card)]"
              style={{ backgroundImage: `url('${view.photoURL}')` }}
            />
            <div className="absolute -bottom-2.5 -right-2.5 flex">
              <VerifyPip><Github size={14} strokeWidth={1.7} /></VerifyPip>
              <VerifyPip className="-ml-1.5"><Linkedin size={14} strokeWidth={1.7} className="text-[#0A66C2]" /></VerifyPip>
              <VerifyPip className="-ml-1.5">
                <span className="font-mono font-semibold text-[10px] text-[#F58025]">SO</span>
              </VerifyPip>
            </div>
          </div>

          <div className="pb-[18px] min-w-0">
            {editing ? (
              <h2 className="m-0 mb-1 font-semibold text-[32px] leading-[1.05] tracking-[-0.025em]">
                <input
                  value={(draft.first_name || "") + " " + (draft.last_name || "")}
                  onChange={(e) => {
                    const [f, ...rest] = e.target.value.split(" ");
                    setDraft({ ...draft, first_name: f, last_name: rest.join(" ") });
                  }}
                  className="font-inherit text-inherit bg-transparent border-0 outline-0 w-full border-b-2 border-dashed border-mm-border-2 focus:border-mm-coral pb-1"
                />
              </h2>
            ) : (
              <h2 className="m-0 mb-1 font-semibold text-[32px] leading-[1.05] tracking-[-0.025em]">
                {view.first_name} {view.last_name}
              </h2>
            )}
            <div className="font-mono font-medium text-[13.5px] text-mm-ink-3">
              {full.handle} · {full.pronouns}
            </div>
            <div className="mt-2 inline-flex flex-wrap gap-x-3 gap-y-1.5 items-center font-medium text-[13px] text-mm-ink-2">
              <Inline icon={GitMerge}>{full.role}</Inline>
              <Dot />
              <Inline icon={GitBranch}>{full.company}</Inline>
              <Dot />
              <Inline icon={MapPin}>{full.location}</Inline>
              <Dot />
              <Inline icon={Clock}>{full.timezone}</Inline>
            </div>
          </div>

          <div className="pb-[18px] flex gap-2 items-center">
            <CompletenessRing
              pct={full.completeness}
              label={full.completeness + "%"}
              sub={copy.app.profile.profileLbl}
            />
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancel}
                  className="h-[38px] px-3.5 rounded-[10px] border border-mm-border-2 bg-transparent text-mm-ink font-medium text-[13px] hover:bg-mm-surface"
                >
                  {copy.app.profile.cancel}
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="h-[38px] px-3.5 rounded-[10px] bg-mm-ink text-mm-bg font-medium text-[13px] inline-flex items-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.14)_inset]"
                >
                  <Check size={14} strokeWidth={1.7} /> {copy.app.profile.save}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={enterEdit}
                className="h-[38px] px-3.5 rounded-[10px] bg-mm-ink text-mm-bg font-medium text-[13px] inline-flex items-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.14)_inset]"
              >
                <Edit size={14} strokeWidth={1.7} /> {copy.app.profile.edit}
              </button>
            )}
          </div>
        </div>
        {error && <p className="px-7 pb-4 text-mm-danger text-[12.5px]">{String(error)}</p>}
      </div>

      <div className="inline-flex p-1 gap-1 bg-mm-paper border border-mm-border rounded-[12px] mb-[18px]">
        {TABS.map((id, i) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              "px-3.5 py-2 rounded-[9px] font-medium text-[13px] transition",
              tab === id
                ? "bg-mm-surface text-mm-ink border border-mm-border-2 shadow-[0_1px_0_rgba(255,255,255,.6)_inset,0_1px_2px_rgba(0,0,0,.06)]"
                : "bg-transparent text-mm-ink-2 hover:text-mm-ink",
            ].join(" ")}
          >
            {copy.app.profile.tabs[i]}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <Overview
          user={view}
          editing={editing}
          draft={draft || full}
          setDraft={setDraft}
          copy={copy}
        />
      )}
      {tab === "stack" && <Stack user={view} copy={copy} />}
      {tab === "activity" && <Activity copy={copy} />}
      {tab === "settings" && <Settings user={view} copy={copy} />}
    </>
  );
};

const VerifyPip = ({ children, className = "" }) => (
  <span
    className={[
      "w-6 h-6 rounded-full bg-mm-surface border-2 border-mm-surface inline-flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,.15)] text-mm-ink",
      className,
    ].join(" ")}
  >
    {children}
  </span>
);

const Inline = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-1.5">
    <Icon size={13} strokeWidth={1.7} className="text-mm-ink-3" />
    {children}
  </span>
);

const Dot = () => <span className="text-mm-ink-4">·</span>;

export default Profile;
