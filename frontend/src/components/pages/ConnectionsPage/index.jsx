import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { BASEURL } from "../../../constants";
import { addConnections } from "../../../store/connections/slice";
import PageHeader from "../../shared/PageHeader";
import ThreadList from "../../features/chat/ThreadList";
import Thread from "../../features/chat/Thread";

// Two-pane Connections page — thread list on the left, active thread on the
// right. The `:userId` URL param drives which thread is selected; clicking a
// row pushes /chat/:userId so the URL is shareable.

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector((s) => s.connections);
  const { copy } = useOutletContext();
  const { userId } = useParams();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASEURL + "/user/connections", {
        withCredentials: true,
      });
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
        eyebrow={copy.app.connections.eyebrow}
        titleA={copy.app.connections.titleA}
        titleEm={copy.app.connections.titleEm}
        titleB={copy.app.connections.titleB}
        sub={copy.app.connections.sub}
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

export default Connections;
