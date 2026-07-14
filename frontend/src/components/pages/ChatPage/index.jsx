import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { userApi } from "../../../api/user/user.api";
import { addConnections } from "../../../store/connections/slice";
import PageHeader from "../../shared/PageHeader";
import ThreadList from "../../features/chat/ThreadList";
import Thread from "../../features/chat/Thread";

// Two-pane Chat page — thread list on the left, active thread on the right.
// Split out of Connections: that page lists the people, this one talks to
// them. The `:userId` URL param drives which thread is selected; clicking a
// row pushes /chat/:userId so the URL is shareable.

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector((s) => s.connections);
  const { copy } = useOutletContext();
  const { userId } = useParams();

  const fetchConnections = async () => {
    try {
      const res = await userApi.getConnections();
      dispatch(addConnections(res.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const list = connections || [];
  const selectedId = userId || list[0]?._id || null;
  const partner = list.find((c) => c._id === selectedId) || null;

  const onSelect = (id) => navigate("/chat/" + id);

  return (
    <>
      <PageHeader
        titleA={copy.app.chat.titleA}
        titleEm={copy.app.chat.titleEm}
        titleB={copy.app.chat.titleB}
        sub={copy.app.chat.sub}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-5 h-[calc(100vh-64px-56px-56px)] min-h-[560px]">
        <ThreadList
          connections={list}
          selectedId={selectedId}
          onSelect={onSelect}
          copy={copy}
        />
        <Thread partner={partner} copy={copy} />
      </div>
    </>
  );
};

export default Chat;
