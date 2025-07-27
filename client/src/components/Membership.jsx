import axios from "axios";
import React, { useEffect, useState } from "react";
import API_URL, { memberships } from "../utils/const";
import { toast } from "react-toastify";
import { Crown, Check, Loader, CheckCircle, Star, Zap } from "lucide-react";

const MembershipPage = () => {
  const [membership, setMembership] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasedPlan, setPurchasedPlan] = useState(null);

  const getMembership = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/payment/verify`, {
        withCredentials: true,
      });
      setMembership(res.data.hasMembership);
      setPurchasedPlan(res.data.plan);
    } catch (err) {
      setError("Failed to check membership");
      console.error("Error checking membership:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberShip = async (type) => {
    try {
      const res = await axios.post(
        `${API_URL}/payment/created`,
        { plan: type },
        { withCredentials: true }
      );

      const { orderKey, order } = res.data;

      const options = {
        key: orderKey,
        amount: order.amount,
        currency: "INR",
        name: "Dev Match",
        description: "Connect to other developers",
        order_id: order.id,
        prefill: {
          name: order.notes.name,
          email: order.notes.email,
        },
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          try {
            const verifyRes = await axios.post(
              `${API_URL}/payment/verification`,
              {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                plan: type,
              },
              { withCredentials: true }
            );
            toast.success(verifyRes.data.message);
            await getMembership();
          } catch (verifyErr) {
            console.error("Verification failed:", verifyErr.response?.data || verifyErr.message);
          }
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log("Error creating order:", error);
    }
  };

  useEffect(() => {
    getMembership();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="p-12 border border-gray-300 rounded-xl text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-800">Checking membership...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="p-12 border border-gray-300 rounded-xl text-center">
          <Star className="w-8 h-8 text-black mx-auto mb-4" />
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 text-black">
      {!membership ? (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <Crown className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Premium Membership</h1>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Unlock premium features and improve your networking experience.
            </p>
          </div>

          {/* Membership Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {memberships.map((plan, index) => {
              const planIcons = [Star, Zap, Crown];
              const PlanIcon = planIcons[index] || Star;

              return (
                <div
                  key={index}
                  className="border border-gray-300 p-8 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="text-center mb-6">
                    <PlanIcon className="w-8 h-8 mx-auto mb-2" />
                    <h2 className="text-xl font-semibold">{plan.title}</h2>
                    <p className="text-2xl font-bold">{plan.price}</p>
                  </div>

                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex gap-2 items-start text-gray-800">
                        <Check className="w-4 h-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => fetchMemberShip(plan.title)}
                    className="w-full py-3 border border-black rounded-lg font-medium hover:bg-black hover:text-white transition"
                  >
                    {plan.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh] flex justify-center items-center">
          <div className="bg-white border border-gray-300 rounded-xl p-12 text-center max-w-xl">
            <CheckCircle className="w-10 h-10 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold mb-2">Membership Active!</h2>
            <p className="mb-4">You currently have:</p>
            <div className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg font-semibold">
              <Crown className="w-4 h-4" />
              {purchasedPlan} Membership
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;
