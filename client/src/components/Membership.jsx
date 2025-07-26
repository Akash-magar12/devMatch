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
        theme: {
          color: "#3399cc",
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
            await getMembership(); // ✅ Refresh membership status after payment
          } catch (verifyErr) {
            console.error(
              "Verification failed:",
              verifyErr.response?.data || verifyErr.message
            );
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Loader className="w-6 h-6 text-white animate-spin" />
            </div>
            <p className="text-lg font-medium text-gray-700">Checking membership...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-red-200">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-medium text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      {!membership ? (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                PREMIUM MEMBERSHIP
              </h1>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Unlock exclusive features and supercharge your developer networking experience with our premium membership plans.
            </p>
          </div>

          {/* Membership Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {memberships.map((plan, index) => {
              const isPopular = index === 1; // Middle plan is popular
              const planIcons = [Star, Zap, Crown];
              const PlanIcon = planIcons[index] || Star;
              const gradients = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-yellow-500 to-orange-500"
              ];
              const gradient = gradients[index] || gradients[0];

              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-3xl shadow-xl border-2 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                    isPopular 
                      ? "border-purple-300 ring-4 ring-purple-100" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        ⭐ MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <PlanIcon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.title}
                      </h2>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => fetchMemberShip(plan.title)}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        isPopular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          : `bg-gradient-to-r ${gradient} hover:opacity-90 text-white`
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Level Up Your Networking?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Join thousands of developers who have already upgraded their networking experience. 
                Choose the plan that fits your needs and start connecting today!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh] flex justify-center items-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto border border-gray-200 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Membership Active! 🎉
            </h2>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
              <p className="text-lg text-gray-700 mb-2">
                You currently have an active
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg">
                <Crown className="w-5 h-5" />
                {purchasedPlan} Membership
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Enjoy all the premium features and exclusive benefits that come with your membership. 
              Happy networking! 🚀
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;