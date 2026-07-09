import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { userApi } from "../../../api/user/user.api";
import { addRequests, removeRequest } from "../../../store/requests/slice";
import PageHeader from "../../shared/PageHeader";
import RequestCard from "../../features/requests/RequestCard";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((s) => s.requests);
  const { copy } = useOutletContext();

  const fetchRequests = async () => {
    try {
      const res = await userApi.getReceivedRequests();
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      await userApi.reviewRequest(status, _id);
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
