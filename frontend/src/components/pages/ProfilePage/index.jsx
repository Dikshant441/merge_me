import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import {
  Edit, Check, X as XIcon, Mail, Crown, Plus, Upload, Trash2,
  Github, Linkedin, Instagram, Globe,
} from "lucide-react";
import { authApi } from "../../../api/auth/auth.api";
import { addUser } from "../../../store/user/slice";
import PageHeader from "../../shared/PageHeader";

// Profile — single page bound to the REAL user schema (Postgres `users`):
// first_name, last_name, email, avatarUrl, about, skills, age, gender,
// membership, isPremium. Edit is local until Save PATCHes /auth/me and writes
// the returned user back into the store. Everything shown here is a persisted
// column — no mock/display-only fields.
//
// Avatar upload: the picked file is downscaled + cropped to a small square on
// the client, encoded as a base64 data URL, and stored in the avatarUrl column
// (i.e. the image bytes live in Postgres — no object storage / file server).

const GENDERS = ["Male", "Female", "Other"];
const MAX_SKILLS = 5;
const MAX_SOCIALS = 6;
const MAX_ABOUT = 500;

// Social/profile-link platforms the user can attach. `key` is stored in the DB
// (must match the backend enum); `Icon` is what shows on the profile.
const SOCIALS = [
  { key: "github",    label: "GitHub",    Icon: Github },
  { key: "linkedin",  label: "LinkedIn",  Icon: Linkedin },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "website",   label: "Website",   Icon: Globe },
];
const SOCIAL_META = Object.fromEntries(SOCIALS.map((s) => [s.key, s]));

// Accept bare domains too — prepend https:// so the stored value is a real URL.
const normalizeUrl = (u) => {
  const t = (u || "").trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};
const AVATAR_MAX_DIM = 256; // downscale target (square)
const AVATAR_MAX_BYTES = 8 * 1024 * 1024; // reject original files bigger than this
const AVATAR_MAX_DATAURL = 900_000; // must stay under the server's cap

const inputCls =
  "border border-mm-border-2 rounded-[10px] bg-mm-paper px-3 py-2 text-[14px] text-mm-ink outline-none focus:border-mm-coral focus:shadow-[0_0_0_4px_oklch(from_var(--mm-coral)_l_c_h_/_.14)]";

const initials = (u) =>
  (`${(u.first_name || "").charAt(0)}${(u.last_name || "").charAt(0)}`).toUpperCase() || "?";

// Draw the image onto a 256×256 canvas (center-cropped to a square) and export
// a JPEG data URL. Keeps a phone photo down to ~15–40 KB so it fits in one row.
const fileToAvatarDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const objUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_MAX_DIM;
      canvas.height = AVATAR_MAX_DIM;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no-canvas"));
      ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_MAX_DIM, AVATAR_MAX_DIM);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      reject(new Error("bad-image"));
    };
    img.src = objUrl;
  });

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user);
  const { copy } = useOutletContext();
  const c = copy.app.profile;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("github");
  const [socialUrl, setSocialUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  if (!user) return null;

  const view = editing ? { ...user, ...draft } : user;
  const skills = view.skills || [];
  const socials = view.socials || [];
  const PickerIcon = (SOCIAL_META[socialPlatform] || SOCIAL_META.website).Icon;
  const membershipLabel = view.isPremium ? c.premium : view.membership || c.free;

  const enterEdit = () => {
    setDraft({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      avatarUrl: user.avatarUrl || "",
      about: user.about || "",
      skills: user.skills || [],
      age: user.age ?? "",
      gender: user.gender || "",
      socials: user.socials || [],
    });
    setSkillInput("");
    setSocialUrl("");
    setSocialPlatform("github");
    setError("");
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(null);
    setSkillInput("");
    setSocialUrl("");
    setError("");
  };

  const patchDraft = (fields) => setDraft((d) => ({ ...d, ...fields }));

  const addSkill = () => {
    const s = skillInput.trim();
    const list = draft.skills || [];
    if (!s || list.includes(s) || list.length >= MAX_SKILLS) {
      setSkillInput("");
      return;
    }
    patchDraft({ skills: [...list, s] });
    setSkillInput("");
  };

  const removeSkill = (s) =>
    patchDraft({ skills: (draft.skills || []).filter((x) => x !== s) });

  const addSocial = () => {
    const url = normalizeUrl(socialUrl);
    const list = draft.socials || [];
    if (!url || list.length >= MAX_SOCIALS) return;
    patchDraft({ socials: [...list, { platform: socialPlatform, url }] });
    setSocialUrl("");
  };

  const removeSocial = (idx) =>
    patchDraft({ socials: (draft.socials || []).filter((_, i) => i !== idx) });

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so picking the same file again re-fires onChange
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError(c.avatarInvalid);
    if (file.size > AVATAR_MAX_BYTES) return setError(c.avatarTooBig);
    try {
      setError("");
      const dataUrl = await fileToAvatarDataUrl(file);
      if (dataUrl.length > AVATAR_MAX_DATAURL) return setError(c.avatarTooBig);
      patchDraft({ avatarUrl: dataUrl });
    } catch {
      setError(c.avatarInvalid);
    }
  };

  const removeAvatar = () => patchDraft({ avatarUrl: "" });

  const save = async () => {
    setError("");
    setSaving(true);
    // Only the schema fields PATCH /auth/me accepts. Empty gender/age → null
    // so the validator (enum / int) doesn't reject a "cleared" value.
    const ageNum =
      draft.age === "" || draft.age == null ? null : Number(draft.age);
    const patch = {
      first_name: draft.first_name.trim(),
      last_name: draft.last_name.trim(),
      avatarUrl: draft.avatarUrl.trim(),
      about: draft.about.trim(),
      skills: draft.skills,
      age: Number.isFinite(ageNum) ? ageNum : null,
      gender: draft.gender || null,
      socials: draft.socials,
    };
    try {
      const res = await authApi.updateProfile(patch);
      dispatch(addUser(res.data.user));
      setEditing(false);
      setDraft(null);
      setSkillInput("");
      setSocialUrl("");
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.message || data?.error?.message || "Failed to save changes"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        titleA={c.titleA}
        titleEm={view.first_name || c.titleEm}
        titleB={c.titleB}
      />

      <div className="rounded-[20px] bg-mm-paper border border-mm-border shadow-[var(--mm-shadow-soft)] p-7 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0 flex flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={() => editing && fileRef.current?.click()}
              disabled={!editing}
              aria-label={editing ? c.avatarUpload : undefined}
              className={[
                "relative w-[104px] h-[104px] rounded-[24px] border-4 border-mm-surface shadow-[var(--mm-shadow-card)] overflow-hidden group",
                editing ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
            >
              {view.avatarUrl ? (
                <span
                  className="block w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${view.avatarUrl}')` }}
                />
              ) : (
                <span className="flex w-full h-full bg-mm-surface items-center justify-center font-semibold text-[28px] text-mm-ink-2">
                  {initials(view)}
                </span>
              )}
              {editing && (
                <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition grid place-items-center text-white">
                  <Upload size={20} strokeWidth={1.8} />
                </span>
              )}
            </button>

            {editing && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={onPickFile}
                  className="hidden"
                />
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="h-[30px] px-2.5 rounded-[8px] border border-mm-border-2 bg-transparent text-mm-ink font-medium text-[12px] inline-flex items-center gap-1.5 hover:bg-mm-surface"
                  >
                    <Upload size={12} strokeWidth={1.8} /> {c.avatarUpload}
                  </button>
                  {draft.avatarUrl && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      aria-label={c.avatarRemove}
                      className="h-[30px] px-2 rounded-[8px] border border-mm-border-2 bg-transparent text-mm-ink-3 hover:text-mm-danger inline-flex items-center justify-center"
                    >
                      <Trash2 size={13} strokeWidth={1.8} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex flex-col sm:flex-row gap-2 mb-2 w-full max-w-[440px]">
                <input
                  value={draft.first_name}
                  onChange={(e) => patchDraft({ first_name: e.target.value })}
                  placeholder={c.labelFirst}
                  className={`${inputCls} flex-1 min-w-0`}
                />
                <input
                  value={draft.last_name}
                  onChange={(e) => patchDraft({ last_name: e.target.value })}
                  placeholder={c.labelLast}
                  className={`${inputCls} flex-1 min-w-0`}
                />
              </div>
            ) : (
              <h2 className="m-0 mb-1 font-semibold text-[28px] leading-[1.05] tracking-[-0.025em]">
                {view.first_name} {view.last_name}
              </h2>
            )}

            <div className="mt-1 inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13.5px] text-mm-ink-2">
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <Mail size={14} strokeWidth={1.7} className="text-mm-ink-3 shrink-0" />
                <span className="truncate">{view.email}</span>
              </span>
              <span className="text-mm-ink-4">·</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                {view.isPremium && (
                  <Crown size={14} strokeWidth={1.7} className="text-mm-amber" />
                )}
                {membershipLabel}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex gap-2">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancel}
                  disabled={saving}
                  className="h-[38px] px-3.5 rounded-[10px] border border-mm-border-2 bg-transparent text-mm-ink font-medium text-[13px] hover:bg-mm-surface disabled:opacity-60"
                >
                  {c.cancel}
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="h-[38px] px-3.5 rounded-[10px] bg-mm-ink text-mm-bg font-medium text-[13px] inline-flex items-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.14)_inset] disabled:opacity-60"
                >
                  <Check size={14} strokeWidth={1.7} /> {saving ? c.saving : c.save}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={enterEdit}
                className="h-[38px] px-3.5 rounded-[10px] bg-mm-ink text-mm-bg font-medium text-[13px] inline-flex items-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.14)_inset]"
              >
                <Edit size={14} strokeWidth={1.7} /> {c.edit}
              </button>
            )}
          </div>
        </div>
        {error && <p className="mt-4 text-mm-danger text-[12.5px]">{String(error)}</p>}
      </div>

      {/* About / Skills (left) + Details (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <Card title={c.sectionAbout}>
            {editing ? (
              <>
                <textarea
                  value={draft.about}
                  onChange={(e) => patchDraft({ about: e.target.value })}
                  placeholder={c.emptyAbout}
                  maxLength={MAX_ABOUT}
                  className="w-full border border-mm-border-2 rounded-[10px] bg-mm-paper p-3 text-[14px] leading-[1.55] text-mm-ink outline-none resize-y min-h-[110px] focus:border-mm-coral focus:shadow-[0_0_0_4px_oklch(from_var(--mm-coral)_l_c_h_/_.14)]"
                />
                <div className="mt-1.5 text-right font-mono text-[11.5px] text-mm-ink-3">
                  {(draft.about || "").length}/{MAX_ABOUT}
                </div>
              </>
            ) : (
              <p className="m-0 text-mm-ink-2 text-[14.5px] leading-[1.6] text-pretty">
                {view.about || c.emptyAbout}
              </p>
            )}
          </Card>

          <Card title={c.sectionSkills}>
            <div className="flex flex-wrap gap-2">
              {skills.length === 0 && !editing && (
                <span className="text-mm-ink-3 text-[13px]">{c.emptySkills}</span>
              )}
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mm-paper border border-mm-border font-mono font-medium text-[12.5px] text-mm-ink"
                >
                  <span>{s}</span>
                  {editing && (
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="w-3.5 h-3.5 rounded-full text-mm-ink-3 hover:text-mm-danger inline-flex items-center justify-center"
                      aria-label={`remove ${s}`}
                    >
                      <XIcon size={10} strokeWidth={1.7} />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {editing && (
              <>
                <div className="mt-3 flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder={c.skillPlaceholder}
                    disabled={skills.length >= MAX_SKILLS}
                    className={`${inputCls} flex-1 disabled:opacity-60`}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    disabled={skills.length >= MAX_SKILLS}
                    className="h-[38px] px-3.5 rounded-[10px] border border-mm-border-2 bg-transparent text-mm-ink font-medium text-[13px] inline-flex items-center gap-1.5 hover:bg-mm-surface disabled:opacity-60"
                  >
                    <Plus size={14} strokeWidth={1.7} /> {c.addSkill}
                  </button>
                </div>
                <p className="mt-2 text-[12px] text-mm-ink-3">
                  {c.maxSkills.replace("{n}", MAX_SKILLS)}
                </p>
              </>
            )}
          </Card>

          <Card title={c.sectionLinks}>
            {!editing && socials.length === 0 && (
              <span className="text-mm-ink-3 text-[13px]">{c.emptyLinks}</span>
            )}

            {!editing && socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map((s, i) => {
                  const meta = SOCIAL_META[s.platform] || SOCIAL_META.website;
                  const Ic = meta.Icon;
                  return (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      title={meta.label}
                      aria-label={meta.label}
                      className="w-9 h-9 rounded-[10px] border border-mm-border bg-mm-paper inline-flex items-center justify-center text-mm-ink-2 hover:text-mm-ink hover:border-mm-border-2 transition"
                    >
                      <Ic size={16} strokeWidth={1.7} />
                    </a>
                  );
                })}
              </div>
            )}

            {editing && (
              <>
                {socials.length > 0 && (
                  <div className="flex flex-col mb-1">
                    {socials.map((s, i) => {
                      const meta = SOCIAL_META[s.platform] || SOCIAL_META.website;
                      const Ic = meta.Icon;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 py-2 border-t border-mm-border first:border-t-0"
                        >
                          <span className="w-7 h-7 rounded-[8px] bg-mm-paper border border-mm-border inline-flex items-center justify-center text-mm-ink-3 shrink-0">
                            <Ic size={14} strokeWidth={1.7} />
                          </span>
                          <span className="flex-1 text-[13px] text-mm-ink-2 truncate">
                            {s.url}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSocial(i)}
                            aria-label="Remove link"
                            className="text-mm-ink-3 hover:text-mm-danger shrink-0"
                          >
                            <XIcon size={14} strokeWidth={1.8} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-3">
                  {/* platform picker — icon chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {SOCIALS.map((s) => {
                      const active = socialPlatform === s.key;
                      const Ic = s.Icon;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setSocialPlatform(s.key)}
                          aria-pressed={active}
                          title={s.label}
                          className={[
                            "h-9 px-2.5 rounded-[10px] border inline-flex items-center gap-1.5 text-[12.5px] font-medium transition",
                            active
                              ? "bg-mm-ink text-mm-bg border-mm-ink shadow-[0_1px_0_rgba(255,255,255,.14)_inset]"
                              : "bg-mm-paper text-mm-ink-2 border-mm-border hover:text-mm-ink hover:border-mm-border-2",
                          ].join(" ")}
                        >
                          <Ic size={15} strokeWidth={1.7} />
                          <span className="hidden sm:inline">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* url + add */}
                  <div className="flex gap-2">
                    <div className="relative flex-1 min-w-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mm-ink-3 pointer-events-none">
                        <PickerIcon size={15} strokeWidth={1.7} />
                      </span>
                      <input
                        value={socialUrl}
                        onChange={(e) => setSocialUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSocial();
                          }
                        }}
                        placeholder={c.linkPlaceholder}
                        disabled={socials.length >= MAX_SOCIALS}
                        className={`${inputCls} w-full pl-9 disabled:opacity-60`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addSocial}
                      disabled={socials.length >= MAX_SOCIALS}
                      className="h-[38px] px-3.5 rounded-[10px] bg-mm-ink text-mm-bg font-medium text-[13px] inline-flex items-center gap-1.5 shadow-[0_1px_0_rgba(255,255,255,.14)_inset] hover:-translate-y-px transition disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      <Plus size={14} strokeWidth={1.7} /> {c.addSkill}
                    </button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        <Card title={c.sectionDetails}>
          <DetailRow label={c.labelEmail}>
            <span className="font-mono text-[13px] text-mm-ink-2 truncate">
              {view.email}
            </span>
          </DetailRow>

          <DetailRow label={c.labelAge}>
            {editing ? (
              <input
                type="number"
                min="16"
                max="120"
                value={draft.age}
                onChange={(e) => patchDraft({ age: e.target.value })}
                className={`${inputCls} w-[90px] text-right`}
              />
            ) : (
              <span className="text-[13.5px] text-mm-ink">{view.age ?? "—"}</span>
            )}
          </DetailRow>

          <DetailRow label={c.labelGender}>
            {editing ? (
              <select
                value={draft.gender}
                onChange={(e) => patchDraft({ gender: e.target.value })}
                className={`${inputCls} pr-9`}
              >
                <option value="">{c.genderUnset}</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-[13.5px] text-mm-ink">{view.gender || "—"}</span>
            )}
          </DetailRow>

          <DetailRow label={c.membership}>
            <span className="inline-flex items-center gap-1.5 text-[13.5px] text-mm-ink font-medium">
              {view.isPremium && (
                <Crown size={13} strokeWidth={1.7} className="text-mm-amber" />
              )}
              {membershipLabel}
            </span>
          </DetailRow>
        </Card>
      </div>
    </>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]">
    <h3 className="m-0 mb-3 font-semibold text-[15px] tracking-[-0.01em]">{title}</h3>
    {children}
  </div>
);

const DetailRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-t border-mm-border first:border-t-0 min-w-0">
    <span className="text-[13px] text-mm-ink-3 shrink-0">{label}</span>
    <div className="min-w-0 text-right">{children}</div>
  </div>
);

export default Profile;
