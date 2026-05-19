import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { BASEURL } from "../../../constants";
import { addRequests, removeRequest } from "../../../store/requests/slice";
import PageHeader from "../../shared/PageHeader";
import RequestCard from "../../features/requests/RequestCard";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((s) => s.requests);
  const { copy } = useOutletContext();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASEURL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASEURL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow={copy.app.requests.eyebrow}
        titleA={copy.app.requests.titleA}
        titleEm={copy.app.requests.titleEm}
        titleB={copy.app.requests.titleB}
        sub={copy.app.requests.sub}
      />

      <div className="flex flex-col gap-4 max-w-[920px]">
        {(!requests || requests.length === 0) ? (
          <div className="py-20 text-center text-mm-ink-3">
            <h3 className="m-0 font-semibold text-[22px] tracking-[-0.02em] text-mm-ink">
              {copy.app.requests.emptyTitle}
            </h3>
            <p className="mt-2 m-0">{copy.app.requests.emptySub}</p>
          </div>
        ) : (
          requests.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              copy={copy}
              onResolve={reviewRequest}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Requests;
