import { Check, Clock } from "lucide-react";
import { SAMPLE_RECEIPTS } from "../data";

// 4-col billing-history table. paid → success-green pill, trial → paper pill.
// `rows` defaults to sample placeholder data; pass real /billing/invoices
// rows in when the endpoint exists. Same `[item, when, amount, status]` shape.

const BillingTable = ({ rows = SAMPLE_RECEIPTS, copy }) => {
  const cols = copy.app.premium.receiptsCols;

  return (
    <>
      <table className="w-full border-collapse text-[13px] font-medium">
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th
                key={c}
                className={[
                  "font-mono font-medium text-[10.5px] text-mm-ink-3 uppercase tracking-[.08em] text-left pb-2.5 px-2 border-b border-mm-border",
                  i === 2 ? "text-right" : "",
                ].join(" ")}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="px-2 py-3 border-b border-mm-border last:border-b-0 text-mm-ink font-medium">
                {r[0]}
              </td>
              <td className="px-2 py-3 border-b border-mm-border last:border-b-0 text-mm-ink-3 font-mono font-medium text-[11.5px]">
                {r[1]}
              </td>
              <td className="px-2 py-3 border-b border-mm-border last:border-b-0 text-mm-ink font-mono font-medium text-[13px] text-right">
                {r[2]}
              </td>
              <td className="px-2 py-3 border-b border-mm-border last:border-b-0">
                {r[3] === "trial" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-mm-paper border border-mm-border text-mm-ink-3 font-mono font-medium text-[10.5px]">
                    <Clock size={10} strokeWidth={1.7} /> trial
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full mm-pill-success font-mono font-medium text-[10.5px]">
                    <Check size={10} strokeWidth={1.7} /> {r[3]}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-right">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="font-medium text-[12.5px] text-mm-coral-2 dark:text-mm-coral hover:underline"
        >
          {copy.app.premium.receiptsAll}
        </a>
      </div>
    </>
  );
};

export default BillingTable;
