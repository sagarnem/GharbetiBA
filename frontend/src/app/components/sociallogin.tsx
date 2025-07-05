"use client";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebookF } from "react-icons/fa";
import { CredentialResponse } from "@react-oauth/google";
export default function SocialLogin() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState("tenant");

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const { credential: id_token } = credentialResponse;

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/auth/social/google/`,
                { id_token, role: selectedRole }
            );

            const data = res.data;

            if (data.otp_required) {
                // Redirect to OTP verification page or modal
                router.push(`/auth/verify-otp?email=${data.email}&purpose=social_login`);
                toast.info("OTP verification required");
            } else {
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
                toast.success("Logged in with Google");
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error("Google login failed");
        }
    };

    // const handleFacebookResponse = async (response: any) => {
    //     try {
    //         const { accessToken } = response;
    //         const res = await axios.post(
    //             `${process.env.NEXT_PUBLIC_API_URL}/user/auth/social/facebook/`,
    //             {
    //                 access_token: accessToken,
    //                 role: selectedRole,
    //                 provider: "facebook",
    //             }
    //         );

    //         const data = res.data;

    //         if (data.otp_required) {
    //             router.push(`/auth/verify-otp?email=${data.email}&purpose=social_login`);
    //             toast.info("OTP verification required");
    //         } else {
    //             localStorage.setItem("access_token", data.access);
    //             localStorage.setItem("refresh_token", data.refresh);
    //             toast.success("Logged in with Facebook");
    //             router.push("/dashboard");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Facebook login failed");
    //     }
    // };


    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Sign in with</h2>
            <h3 className="text-md font-light text-gray-600">What are you?</h3>
            <div className="flex justify-center gap-6 text-left">

                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="radio"
                        className="form-radio"
                        name="role"
                        value="tenant"
                        checked={selectedRole === "tenant"}
                        onChange={() => setSelectedRole("tenant")}
                    />
                    <span className="ml-2 text-black font-medium">Tenant</span>
                </label>

                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="radio"
                        className="form-radio"
                        name="role"
                        value="owner"
                        checked={selectedRole === "owner"}
                        onChange={() => setSelectedRole("owner")}
                    />
                    <span className="ml-2 text-black font-medium" >Property Owner</span>
                </label>
            </div>

            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                width="100%"
                shape="rectangular"
                text="continue_with"
            />

            {/* <FacebookLogin
                appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
                callback={handleFacebookResponse}
                render={(renderProps: any) => (
                    <button
                        onClick={renderProps.onClick}
                        className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-md text-black hover:bg-blue-50 cursor-pointer font-semibold shadow-md transition"
                    >
                        <FaFacebookF size={20} className="text-blue-600" />
                        Continue with Facebook
                    </button>
                )}
            /> */}
        </div>
    );
}
