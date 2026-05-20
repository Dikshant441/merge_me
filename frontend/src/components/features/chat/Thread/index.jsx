import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { GitMerge, MoreHorizontal, Code, Send } from "lucide-react";
import { BASEURL } from "../../../../constants";
import { createSocketConnection } from "../../../../helpers/socket";
import { getConnectionExtras, MOCK_MESSAGES } from "../data";

// Right pane on Connections — chat thread with the selected user.
// Loads message history via /chat/:userId, opens a socket for live messages.
// Until a real thread has 1+ message we keep the mock visible so the design
// renders even on a fresh account.

const Thread = ({ partner, copy }) => {
  const user = useSelector((s) => s.user);
  const userID = user?._id;
  const targetUserId = partner?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);

  const extras = partner ? getConnectionExtras(partner._id) : null;
  const sharedStack = extras?.sharedStack || [];

  // load chat history when the partner changes
  useEffect(() => {
    if (!targetUserId) return;
    let cancelled = false;
    const fetchChat = async () => {
      try {
        const res = await axios.get(BASEURL + "/chat/" + targetUserId, {
          withCredentials: true,
        });
        if (cancelled) return;
        const history = (res?.data?.messages || []).map((msg) => ({
          firstName: msg.senderId?.first_name,
          lastName: msg.senderId?.last_name,
          message: msg.message,
        }));
        setMessages(history);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChat();
    return () => {
      cancelled = true;
    };
  }, [targetUserId]);

  // socket — join room, receive live messages
  useEffect(() => {
    if (!userID || !targetUserId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.first_name,
      userID,
      targetUserId,
    });
    socket.on("receivedMessage", ({ firstName, lastName, message }) => {
      setMessages((prev) => [...prev, { firstName, lastName, message }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userID, targetUserId]);

  // scroll-to-bottom whenever the thread or message list changes
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, targetUserId]);

  const sendMessage = () => {
    if (newMessage.trim() === "" || !targetUserId) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.first_name,
      lastName: user.last_name,
      userID,
      targetUserId,
      message: newMessage,
    });
    setMessages((prev) => [
      ...prev,
      { firstName: user.first_name, lastName: user.last_name, message: newMessage },
    ]);
    setNewMessage("");
  };

  if (!partner) {
    return (
      <div className="bg-mm-surface border border-mm-border rounded-[16px] shadow-[var(--mm-shadow-soft)] flex items-center justify-center text-mm-ink-3 text-[13.5px] min-h-[480px]">
        {copy.app.connections.empty}
      </div>
    );
  }

  // Once the real thread has messages, show those. Otherwise we fall back
  // to the design's mock thread so the UI still renders for empty rooms.
  const showMock = messages.length === 0;

  return (
    <div className="bg-mm-surface border border-mm-border rounded-[16px] shadow-[var(--mm-shadow-soft)] overflow-hidden flex flex-col min-h-0 min-h-[480px]">
      <div className="px-[18px] py-3.5 border-b border-mm-border flex items-center gap-3.5">
        <img
          src={partner.photoURL}
          alt={partner.first_name}
          className="w-[38px] h-[38px] rounded-full object-cover border border-mm-border"
        />
        <div className="leading-[1.2]">
          <div className="font-semibold text-[14px]">
            {partner.first_name} {partner.last_name}
          </div>
          {extras?.online ? (
            <div className="font-mono font-medium text-[11.5px] text-mm-success inline-flex items-center gap-1.5">
              <span className="w-[7px] h-[7px] rounded-full bg-mm-success shadow-[0_0_8px_var(--mm-success)]" />
              {copy.app.connections.lastSeenOn}
            </div>
          ) : (
            <div className="font-mono font-medium text-[11.5px] text-mm-ink-3">
              merged {extras?.mergedAt || "recent"} ago
            </div>
          )}
        </div>
        <div className="ml-auto inline-flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-mm-paper border border-mm-border font-mono font-medium text-[11px] text-mm-ink-3">
            <GitMerge size={12} strokeWidth={1.7} />
            <b className="text-mm-coral-2 dark:text-mm-coral font-medium">{sharedStack.length}</b> {copy.app.connections.shared}
          </span>
          <button
            type="button"
            aria-label="more"
            className="w-9 h-9 rounded-[10px] border border-mm-border bg-mm-surface text-mm-ink-2 inline-flex items-center justify-center hover:text-mm-ink"
          >
            <MoreHorizontal size={16} strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-[22px] pb-3 min-h-0">
        <div className="my-3.5 flex items-center gap-3 text-mm-ink-3 font-mono font-medium text-[11px] tracking-[.08em] uppercase">
          <span className="flex-1 h-px bg-mm-border" />
          <span>{copy.app.connections.today}</span>
          <span className="flex-1 h-px bg-mm-border" />
        </div>

        {showMock
          ? MOCK_MESSAGES.map((m) => <Bubble key={m.id} msg={m} />)
          : messages.map((m, i) => (
              <Bubble
                key={i}
                msg={{
                  from: user?.first_name === m.firstName ? "me" : "them",
                  text: m.message,
                  time: "",
                }}
              />
            ))}
      </div>

      <div className="px-3.5 py-3 border-t border-mm-border bg-mm-surface flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 h-11 px-3.5 bg-mm-paper border border-mm-border-2 rounded-[12px] text-mm-ink-3 text-[13px]">
          <Code size={14} strokeWidth={1.7} />
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={copy.app.connections.composer}
            className="flex-1 bg-transparent outline-none text-mm-ink placeholder:text-mm-ink-3 text-[13px]"
          />
          <span className="font-mono font-medium text-[11px] text-mm-ink-4">
            {copy.app.connections.codeHint}
          </span>
        </div>
        <button
          type="button"
          onClick={sendMessage}
          aria-label={copy.app.connections.send}
          className="w-11 h-11 rounded-[12px] bg-mm-ink text-mm-bg inline-flex items-center justify-center shadow-[0_1px_0_rgba(255,255,255,.14)_inset]"
        >
          <Send size={16} strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
};

// Single bubble — handles both mock messages (with optional `code`) and live
// socket messages (text only).
const Bubble = ({ msg }) => {
  const mine = msg.from === "me";
  return (
    <div
      className={[
        "my-1.5 max-w-[78%] px-3.5 py-2.5 rounded-[14px] text-[14px] leading-[1.5]",
        mine
          ? "bg-mm-ink text-mm-bg ml-auto rounded-br-[4px]"
          : "bg-mm-paper border border-mm-border text-mm-ink rounded-bl-[4px]",
      ].join(" ")}
    >
      <div>{msg.text}</div>
      {msg.code && (
        <div
          className={[
            "block mt-2 mb-1 px-3 py-2.5 rounded-[8px] font-mono font-medium text-[12px] leading-[1.6]",
            "whitespace-pre overflow-x-auto border",
            mine
              ? "bg-white/[.08] border-white/[.10] text-[oklch(0.92_0.08_70)]"
              : "bg-black/[.06] border-black/[.06] text-mm-coral-2 dark:bg-white/[.04] dark:border-white/[.08] dark:text-mm-coral",
          ].join(" ")}
        >
          <span
            className={[
              "block font-mono font-medium text-[10px] tracking-[.08em] uppercase mb-1.5",
              mine ? "text-white/45" : "text-mm-ink-3",
            ].join(" ")}
          >
            {msg.code.lang}
          </span>
          {msg.code.body}
        </div>
      )}
      {msg.time && (
        <span className="block font-mono font-medium text-[10.5px] opacity-50 mt-1.5">
          {msg.time}
        </span>
      )}
    </div>
  );
};

export default Thread;
