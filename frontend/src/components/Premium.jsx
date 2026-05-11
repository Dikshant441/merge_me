import {
  Check,
  X,
  User,
  Star,
  Crown,
  Sparkles,
  Zap,
  Shield,
  MessageSquare,
  Infinity,
  Contact,
} from "lucide-react";
import axios from "axios";
import { BASEURL } from "../utils/constants";
import { useState, useEffect } from "react";

const Premium = () => {
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    console.log("enterrr")
    try {
      const response = await axios.get(BASEURL + "/premium/verify", {
        withCredentials: true,
      });

      console.log("Verify Response => ", response.data);

      if (response.data.isPremium) {
        setIsPremiumUser(true);
      }
    } catch (err) {
      console.log("Verify Response Error => ", err.response.data.msg);
    }
  };

  const handleBuyClick = async (plan) => {
    try {
      const order = await axios.post(
        BASEURL + "/payment/create",
        {
          membershipType: plan,
        },
        { withCredentials: true },
      );

      const { key_id, amount, currency, orderId, notes } = order.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "Merge me",
        description: "Test Transaction",
        order_id: orderId,
        prefill: {
          name:
            (notes?.first_name || "Dishant") +
            " " +
            (notes?.last_name || "singh"),
          email: notes?.emailId || "dishantsingh441@gmail.com",
          contact: "9876543212",
          membershipType: notes?.membershipType || "",
        },
        theme: {
          color: "#F37254",
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return isPremiumUser ? (
    <p>You are already premium</p>
  ) : (
    <div className="m-10">
      <div className="flex w-full">
        <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center">
          <h1 className="font-bold text-3xl">Silver Membership</h1>
          <ul>
            <li> - Chat with other people</li>
            <li> - 100 connection Requests per day</li>
            <li> - Blue Tick</li>
            <li> - 3 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("gold")}
            className="btn btn-secondary"
          >
            Buy Silver
          </button>
        </div>
        <div className="divider divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center">
          <h1 className="font-bold text-3xl">Gold Membership</h1>
          <ul>
            <li> - Chat with other people</li>
            <li> - Inifiniye connection Requests per day</li>
            <li> - Blue Tick</li>
            <li> - 6 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("gold")}
            className="btn btn-primary"
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
