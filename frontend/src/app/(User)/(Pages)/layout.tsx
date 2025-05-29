import React, { ReactNode } from "react";
export default function pages({ children }: { children: ReactNode }) {
  return (
    <>
      <div
      className="max-w-[1320px] w-full mx-auto px-2 sm:px-4"
      >{children}</div>
    </>
  );
}
