"use client";
import React, { useEffect, useState } from "react";
import ContentDescription from "../Layouts/ContentDescription";
import { useParams } from "next/navigation";
import { Listing } from "@/types/listing";
import { fetchListings } from "@/data/lib/api/roomApi";

export default function RoomDetailPage() {
  const params = useParams();
  const slug = decodeURIComponent((params?.slug as string) || "");

  const [description, setDescription] = useState<Listing | null>(null);

  useEffect(() => {
    fetchListings().then((listings) => {
      const item = listings.find((desc) => desc.slug === slug);
      setDescription(item || null);
    });
  }, [slug]);

  if (!description) {
    return (
      <p className="text-center text-gray-500">
        No details found for `{slug}`.
      </p>
    );
  }

  return <ContentDescription {...description} />;
}
