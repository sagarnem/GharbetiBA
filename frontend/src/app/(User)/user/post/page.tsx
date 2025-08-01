'use client';

import { useEffect, useState } from 'react';
import { Listing } from '@/types/listing'; // Adjust if your type path is different
import Link from 'next/link';
import Image from 'next/image';
import Pagination from '@/app/components/ui/pagination';
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { Pencil, Trash2, X } from "lucide-react";

export default function ListingsDashboard() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingListing, setEditingListing] = useState<Listing | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const BaseURL = process.env.NEXT_PUBLIC_API_URL
        const fetchListings = async (page = 1) => {
            try {
                const res = await fetch(`${BaseURL}/post/posts/?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Or use cookies/session if SSR
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch listings');
                const data = await res.json();
                setListings(data.results || []);
                setTotalPages(Math.ceil(data.count / 10));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
  fetchListings(currentPage);
}, [currentPage]);

const deletePost = async (id: number, token: string | null) => {
  if (!token) return;

  await fetch(`${BaseURL}/post/posts/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const refetch = () => fetchListings(currentPage);

const { showConfirm, handleDelete, confirmDelete, cancelDelete } =
  useConfirmDelete(async (id: number) => {
    await deletePost(id, token);
    refetch();
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingListing) return;
    setEditingListing({
      ...editingListing,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!editingListing || !token) return;

    try {
      const res = await fetch(`${BaseURL}/post/posts/${editingListing.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingListing),
      });
      if (!res.ok) throw new Error("Failed to update post");
      setEditingListing(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };



    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Your Listings</h1>
                    <p className="text-gray-600">{listings.length} total listing{listings.length !== 1 && 's'}</p>
                </div>
                {listings.length > 0 && (
                    <Link
                        href="/user/create-post"
                        className="mt-4 md:mt-0 inline-block bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 transition"
                    >
                        Create New Listing
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="text-center text-gray-600">Loading listings...</div>
            ) : listings.length === 0 ? (
                <div className="text-center text-gray-700 border border-dashed border-gray-300 rounded-md p-10">
                    <p className="mb-4">You don&apos;t have any listings yet.</p>
                    <Link
                        href="/user/create-post"
                        className="inline-block bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 transition"
                    >
                        Create Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {listings.map((listing) => (
                        <div key={listing.id} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden border">
                            <div className="h-48 bg-gray-100 overflow-hidden">
                                <Image
                                    src={listing.uploaded_images?.[0] ? listing.uploaded_images[0] : '/placeholder-image.png'}
                                    alt={listing.title}
                                    width={500}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />

                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 mb-1">{listing.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">{new Date(listing.created_at).toLocaleDateString()}</span>
                                    <div><button
                    onClick={() => setEditingListing(listing)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="text-red-600 hover:text-red-800 transition px-4"
                  >
                    <Trash2 size={16} />
                  </button></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && listings.length > 0 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={(page) => setCurrentPage(page)}
  />
)}
<div className="text-wrap">
        <ConfirmModal
          isOpen={showConfirm}
          message="Are you sure you want to delete this Post?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
{editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
            <button
              onClick={() => setEditingListing(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Listing</h2>
            <input
              name="title"
              value={editingListing.title}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
              placeholder="Title"
            />
            <textarea
              name="description"
              value={editingListing.description}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
              placeholder="Description"
            />
            <input
              name="price"
              value={editingListing.price || ""}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
              placeholder="Price"
              type="number"
            />
            <input
              name="location"
              value={editingListing.location || ""}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
              placeholder="Location"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Listing
            </button>
          </div>
        </div>
      )}
        </div>
    );
}
