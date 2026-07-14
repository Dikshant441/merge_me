import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router";
import { userApi } from "../../../api/user/user.api";
import { addConnections } from "../../../store/connections/slice";
import PageHeader from "../../shared/PageHeader";
import ConnectionCard from "../../features/connections/ConnectionCard";

// Connections — the people you've merged with, as feed-style cards. Chat
// lives on its own /chat page now; each card's message action opens its
// thread at /chat/:userId.

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector((s) => s.connections);
  const { copy } = useOutletContext();

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

  return (
    <>
      <PageHeader
        eyebrow={copy.app.connections.eyebrow}
        titleA={copy.app.connections.titleA}
        titleEm={copy.app.connections.titleEm}
        titleB={copy.app.connections.titleB}
        sub={copy.app.connections.sub}
      />

      <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(270px,1fr))] max-w-[1180px]">
        {list.length === 0 ? (
          <div className="col-span-full py-20 text-center text-mm-ink-3">
            <h3 className="m-0 font-semibold text-[22px] tracking-[-0.02em] text-mm-ink">
              {copy.app.connections.emptyTitle}
            </h3>
            <p className="mt-2 m-0">{copy.app.connections.emptySub}</p>
          </div>
        ) : (
          list.map((c) => (
            <ConnectionCard
              key={c._id}
              user={c}
              copy={copy}
              onMessage={(id) => navigate("/chat/" + id)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Connections;
