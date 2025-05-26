"use client";
import React from "react";
import ContentDescription from "../Layouts/ContentDescription";
import { useParams } from "next/navigation";
import {  descriptions } from "../../../../data/data";

export default function RoomDetailPage() {
  const params = useParams();
  const slug = decodeURIComponent((params?.slug as string) || "");

  // Find description by slug directly
  const description = descriptions.find((desc) => desc.slug === slug);

  if (!description) {
    return (
      <p className="text-center text-gray-500">
        No details found for `{slug}`.
      </p>
    );
  }

  return (
    <div className="p-4">
      <ContentDescription {...description} />
    </div>
  );
}
