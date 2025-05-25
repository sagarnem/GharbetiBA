"use client";

import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export default function SocialLogin() {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: any) => {
  try {
    const { credential: id_token } = credentialResponse;

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/auth/social/google/`,
      { id_token }
    );

    const { access, refresh } = res.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    toast.success("Logged in with Google");
    router.push("/dashboard");
  } catch (error) {
    console.error(error);
    toast.error("Google login failed");
  }
};


  const handleFacebookResponse = async (response: any) => {
    try {
      const { accessToken } = response;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/auth/social/`,
        {
          access_token: accessToken,
          provider: "facebook",
        }
      );

      const { access, refresh } = res.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      toast.success("Logged in with Facebook");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Facebook login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md text-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Sign in with</h2>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google login failed")}
        width="100%"
        shape="rectangular"
        text="continue_with"
      />

      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
        callback={handleFacebookResponse}
        render={(renderProps: any) => (
          <button
            onClick={renderProps.onClick}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
          >
            <FaFacebookF size={20} />
            Continue with Facebook
          </button>
        )}
      />
    </div>
  );
}
