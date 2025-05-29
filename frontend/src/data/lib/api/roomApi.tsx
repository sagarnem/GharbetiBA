"use client";
import React from 'react'
import { useEffect, useState } from "react";
import { fetchListings } from "../../data"; // Adjust path if needed
import { Listing } from "@/types/listing";

export default function ListingsClientPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings().then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {listings.map((l) => (
        <div key={l.slug}>{l.title}</div>
      ))}
    </div>
  );
}
