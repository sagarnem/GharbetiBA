"use client";

import { useState } from "react";
// import { Editor } from "@tiptap/react";
import {

  Image as ImageIcon,
 

} from "lucide-react";
import ImageModal from "./mediaExplorer";
// import LinkModal from "./LinkModel";

export default function ASMedia() {
  const [showModal, setShowModal] = useState(false);








  return (
    <div className="flex flex-wrap gap-2 mb-2 bg-gray-100 px-2 py-2 border rounded">
  



      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="text-orange-600 text-sm px-2 py-1 rounded bg-white border hover:bg-gray-200"
        title="Insert Image or File"
        aria-label="Insert Image or File"
      >
        <ImageIcon className="w-4 h-4" />
      </button>


   

      {/* Modals */}
      <ImageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
     

     
    </div>
  );
}
