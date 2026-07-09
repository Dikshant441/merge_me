// Fallback portrait helpers for users with no photo: big initials over a
// tint derived from the user's id, so every card gets its own stable hue
// while staying inside the app's oklch palette.

export const initialsOf = (u) =>
  (`${(u.first_name || "").charAt(0)}${(u.last_name || "").charAt(0)}`).toUpperCase() || "?";

export const hueOf = (u) => {
  const s = String(u._id || u.first_name || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
};
