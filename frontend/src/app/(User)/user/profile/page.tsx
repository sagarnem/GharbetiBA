"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/auth";

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserProfile>();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const router = useRouter();

  // Watch photo input to update preview on file select
  const watchedPhoto = watch("photo");

  useEffect(() => {
    if (watchedPhoto instanceof FileList && watchedPhoto.length > 0) {
      const file = watchedPhoto[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [watchedPhoto]);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated. Please login.");
        router.push("/auth/login");
        return;
      }
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile/me/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const profile = res.data;
        setIsEditing(true);
        Object.entries(profile).forEach(([key, value]) => {
          if (key !== "photo"){
if (
      typeof value === "string" || 
      typeof value === "number" || 
      value === null || 
      value === undefined
    ) {
      setValue(key as keyof UserProfile, value);
    }

          }
        });
        if (profile.photo) {
          setPhotoPreview(profile.photo); // Assuming API returns photo URL
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("access_token");
          router.push("/auth/login");
        } else {
          setIsEditing(false);
          toast.error("Failed to load profile");
        }
      }
    }
    fetchProfile();
  }, [router, setValue]);

  const onSubmit = async (data: UserProfile) => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Not authenticated. Please login.");
      router.push("/auth/login");
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "photo") {
          const files = value as FileList;
          if (files && files.length > 0) {
            formData.append("photo", files[0]);
          }
        } else if (typeof value === "string" || typeof value === "number") {
          formData.append(key, value.toString());
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value === null || value === undefined) {
          // Skip null or undefined
        } else {
          formData.append(key, String(value));
        }
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditing) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile/update/`,
          formData,
          config
        );
        toast.success("Profile updated!");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile/create/`,
          formData,
          config
        );
        toast.success("Profile created!");
      }

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("access_token");
        router.push("/auth/login");
        return;
      }
      // Handle other errors
      setPhotoPreview(null); // Reset photo preview on error
      setValue("photo", null); // Reset photo input
      toast.error("Failed to save profile. Please try again.");
      console.error("Profile save error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        {isEditing ? "Edit Profile" : "Create Profile"}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row md:space-x-10 bg-white p-8 rounded-lg shadow-lg"
        encType="multipart/form-data"
      >
        {/* Photo preview */}
        <div className="mb-6 md:mb-0 flex flex-col items-center md:w-1/3">
          <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-indigo-500 mb-4 bg-gray-100 flex items-center justify-center">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt="Profile Photo Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400">No Photo</span>
            )}
          </div>
          <label
            htmlFor="photo"
            className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Choose Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            {...register("photo")}
            className="hidden"
          />
          {errors.photo && (
            <p className="text-red-600 mt-1 text-sm">{errors.photo.message}</p>
          )}
        </div>

        {/* Form fields */}
        <div className="flex-1 space-y-5">
          <div>
            <label
              className="block text-gray-700 mb-1 font-medium"
              htmlFor="full_name"
            >
              Full Name
            </label>
            <input
              id="full_name"
              {...register("full_name")}
              placeholder="Full Name"
              className={`w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.full_name && (
              <p className="text-red-600 mt-1 text-sm">{errors.full_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                className="block text-gray-700 mb-1 font-medium"
                htmlFor="phone_number_1"
              >
                Phone Number 1
              </label>
              <input
                id="phone_number_1"
                {...register("phone_number_1")}
                placeholder="Phone 1"
                className={`w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.phone_number_1 ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone_number_1 && (
                <p className="text-red-600 mt-1 text-sm">{errors.phone_number_1.message}</p>
              )}
            </div>
            <div>
              <label
                className="block text-gray-700 mb-1 font-medium"
                htmlFor="phone_number_2"
              >
                Phone Number 2
              </label>
              <input
                id="phone_number_2"
                {...register("phone_number_2")}
                placeholder="Phone 2"
                className={`w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.phone_number_2 ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone_number_2 && (
                <p className="text-red-600 mt-1 text-sm">{errors.phone_number_2.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 mb-1 font-medium"
              htmlFor="date_of_birth"
            >
              Date of Birth
            </label>
            <input
              id="date_of_birth"
              type="date"
              {...register("date_of_birth")}
              className={`w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.date_of_birth ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date_of_birth && (
              <p className="text-red-600 mt-1 text-sm">{errors.date_of_birth.message}</p>
            )}
          </div>

          <div>
            <label
              className="block text-gray-700 mb-1 font-medium"
              htmlFor="location"
            >
              Location
            </label>
            <input
              id="location"
              {...register("location")}
              placeholder="Location"
              className={`w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.location && (
              <p className="text-red-600 mt-1 text-sm">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              {...register("bio")}
              placeholder="Tell us about yourself..."
              className={`w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24 ${
                errors.bio ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.bio && (
              <p className="text-red-600 mt-1 text-sm">{errors.bio.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : isEditing ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
