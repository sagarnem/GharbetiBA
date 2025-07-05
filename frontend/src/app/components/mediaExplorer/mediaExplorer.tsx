"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  FolderOpen,
  SwitchCamera,
  Pencil,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
type ImageItem = {
  id: number;
  image: string;
  folder?: string;
};
export default function ImageModal({
  isOpen,
  onClose,
  onSelectMedia = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (url: string, type: "image" | "file") => void;
}) {
  const [imagesByFolder, setImagesByFolder] = useState<
    Record<string, { id: number; image: string }[]>
  >({});
  const [uploading, setUploading] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [renamingFolder, setRenamingFolder] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

  const content_api = process.env.NEXT_PUBLIC_COMPANY_URL;

  const fetchImages = async () => {
    try {
      const res = await fetch(`${content_api}/images/`);
      const data = await res.json();
      const grouped: Record<string, ImageItem[]> = {};
      data.forEach((img: ImageItem) => {
        const folder = img.folder || "Uncategorized";
        grouped[folder] = grouped[folder] || [];
        grouped[folder].push(img);
      });
      setImagesByFolder(grouped);
      setSelectedImages(new Set());
      if (!selectedFolder && Object.keys(grouped).length > 0) {
        setSelectedFolder(Object.keys(grouped)[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", selectedFolder || newFolder || "");
    try {
      await fetch(`${content_api}/images/`, { method: "POST", body: form });
      setNewFolder("");
      fetchImages();
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`${content_api}/images/${id}/`, { method: "DELETE" });
    fetchImages();
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;
    if (!confirm("Delete selected images?")) return;

    for (const  id of selectedImages) {
      await fetch(`${content_api}/images/${id}/`, { method: "DELETE" });
    }
    fetchImages();
  };

  const handleRenameFolder = async () => {
    if (!renamingFolder.trim()) return alert("Folder name cannot be empty");
    await fetch(`${content_api}/rename-folder/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        old_folder: selectedFolder,
        new_folder: renamingFolder,
      }),
    });
    setRenamingFolder("");
    fetchImages();
  };

  const toggleImageSelect = (id: number) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
  newSet.delete(id);
} else {
  newSet.add(id);
} return newSet;
    });
  };

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div className="bg-white w-[95vw] max-w-7xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex ring-1 ring-gray-300">
        {/* Sidebar */}
        <aside className="w-72 border-r border-gray-200 overflow-auto p-6 flex flex-col bg-gray-50">
          <h3
            id="image-modal-title"
            className="flex items-center text-gray-700 text-base font-semibold mb-5 tracking-wide"
          >
            <FolderOpen className="mr-2 text-orange-600" size={20} />
            Folders
          </h3>
          <ul className="flex-grow space-y-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 overflow-y-auto">
            {Object.keys(imagesByFolder).map((folder) => (
              <li
                key={folder}
                className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selectedFolder === folder
                    ? "bg-orange-100 font-semibold text-orange-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedFolder(folder);
                  setSelectedImages(new Set());
                  setRenamingFolder("");
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelectedFolder(folder);
                    setSelectedImages(new Set());
                    setRenamingFolder("");
                  }
                }}
                aria-current={selectedFolder === folder ? "true" : undefined}
              >
                <span className="truncate">{folder}</span>
                {selectedFolder === folder && (
                  <Pencil
                    className="text-orange-500 hover:text-orange-700 transition"
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingFolder(folder);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Rename folder"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        setRenamingFolder(folder);
                      }
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
{!renamingFolder && (
          <div className="relative mt-6 w-full max-w-sm">
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 px-4 py-2 pr-16 text-sm shadow-sm
               focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              value={newFolder}
              placeholder="Type folder name here"
              onChange={(e) => setNewFolder(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newFolder.trim()) {
                  setSelectedFolder(newFolder);
                  setRenamingFolder(newFolder);
                  setNewFolder("");
                }
              }}
              aria-label="New folder name input"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => {
                if (!newFolder.trim()) return;
                setSelectedFolder(newFolder);
                setRenamingFolder(newFolder);
                setNewFolder("");
              }}
              className="absolute inset-y-0 right-0 flex items-center px-4 bg-orange-600 rounded-r-md text-white
               hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition"
              aria-label="Add new folder"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
)}
          {renamingFolder && (
            <div className="relative mt-6 w-full max-w-sm">
              <input
                type="text"
                className="block w-full rounded-md border border-gray-300 px-4 py-2 pr-16 text-sm shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                value={renamingFolder}
                onChange={(e) => setRenamingFolder(e.target.value)}
                aria-label="Rename folder input"
              />
              <button
                onClick={handleRenameFolder}
                className="absolute inset-y-0 right-0 flex items-center px-4 bg-orange-600 rounded-r-md text-white
                 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition"
                aria-label="Save folder name"
              >
                Save
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <section className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center text-xl font-semibold text-gray-800">
              <SwitchCamera className="text-orange-600 mr-2" size={24} />
              {selectedFolder || "Uncategorized"}
            </div>
            <div className="flex items-center gap-3">
              {selectedImages.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-shadow shadow-sm text-sm font-semibold"
                  aria-label={`Delete ${selectedImages.size} selected images`}
                >
                  Delete {selectedImages.size} Selected
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                aria-label="Close modal"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
          </header>

          {/* Upload Section */}
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <label
              className={`relative flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 border-dashed px-8 py-10 text-center transition-colors hover:border-orange-500 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-400 ${
                uploading ? "opacity-70 cursor-wait" : "cursor-pointer"
              }`}
            >
              <span className="text-gray-600 text-sm font-medium select-none">
                {uploading ? "Uploading..." : "Click or drag file to upload"}
              </span>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleUpload}
                disabled={uploading}
                aria-label="Upload file"
              />
            </label>
          </div>

          {/* Select All / Deselect All */}
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <div>
              {selectedImages.size ===
              (imagesByFolder[selectedFolder]?.length || 0) ? (
                <button
                  onClick={() => setSelectedImages(new Set())}
                  className="text-orange-600 hover:underline text-sm font-medium focus:outline-none focus:ring-1 focus:ring-orange-600 rounded"
                >
                  Deselect All
                </button>
              ) : (
                <button
                  onClick={() =>
                    setSelectedImages(
                      new Set(
                        imagesByFolder[selectedFolder]?.map((img) => img.id)
                      )
                    )
                  }
                  className="text-orange-600 hover:underline text-sm font-medium focus:outline-none focus:ring-1 focus:ring-orange-600 rounded"
                >
                  Select All
                </button>
              )}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {selectedImages.size} selected
            </div>
          </div>

          {/* Media Grid */}
          <main className="overflow-auto p-6 flex-1 bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {(imagesByFolder[selectedFolder] || []).map(({ id, image }) => {
                const fileName = image.split("/").pop() || "";
                const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(image);
                const isSelected = selectedImages.has(id);

                return (
                  <div
                    key={id}
                    className={`relative rounded-lg overflow-hidden shadow-md transition-shadow cursor-pointer ${
                      isSelected
                        ? "ring-4 ring-orange-400 shadow-lg"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => toggleImageSelect(id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleImageSelect(id);
                      }
                    }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleImageSelect(id)}
                      className="absolute top-2 left-2 z-20 w-5 h-5 cursor-pointer accent-orange-600"
                      aria-label={`Select image ${fileName}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleImageSelect(id);
                      }}
                    />

                    {isImage ? (
                      <Image
                        src={image}
                        alt={fileName}
                        width={300}
                        height={200}
                        className="w-full h-44 object-cover rounded-t-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(image);
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-44 flex items-center justify-center rounded-t-lg text-xs text-gray-600 bg-gray-100 select-none px-2 text-center">
                        {fileName}
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition flex justify-center items-center gap-4 text-white text-xl rounded-t-lg pointer-events-none group-hover:pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(image);
                        }}
                        aria-label="Preview image"
                        className="pointer-events-auto focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-full p-1 hover:bg-black/40 transition"
                      >
                        <Eye />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(id);
                        }}
                        aria-label="Delete image"
                        className="pointer-events-auto focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1 hover:bg-black/40 transition"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
              {Object.keys(imagesByFolder).length === 0 && (
                <p className="text-center text-gray-500 mt-16 text-lg font-light">
                  No images available.
                </p>
              )}
            </div>
          </main>
        </section>

        {/* Lightbox Preview */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <div className="relative max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg bg-gray-900">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Close preview"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
              <Image
                src={previewImage}
                alt="preview"
                width={1000}
                height={800}
                className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
                loading="lazy"
              /> <button
        onClick={() => {
          onSelectMedia(previewImage, "image");
          setPreviewImage(null);
          onClose();
        }}
        className="absolute bottom-3 right-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-orange-400"
        aria-label="Use this image"
      >
        Use this Image
      </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
