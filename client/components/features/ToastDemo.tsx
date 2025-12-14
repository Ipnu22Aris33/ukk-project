"use client";

import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";

export default function DemoToast() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Toast
      </button>

      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className="p-4 rounded shadow
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <Toast.Title>Data saved!</Toast.Title>
        <Toast.Description>Your changes have been saved successfully.</Toast.Description>
        <Toast.Close className="absolute top-2 right-2">✕</Toast.Close>
      </Toast.Root>
    </>
  );
}
