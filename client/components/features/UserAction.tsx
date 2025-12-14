// components/UserActions.tsx
"use client";

import { toast } from "sonner";
import { Button } from "@radix-ui/themes";

export function UserActions() {
  return (
    <div className="space-x-2">
      <Button 
        onClick={() => toast("Hello from Sonner! Ini demo Radix Themes dengan system dark mode Coba ubah dark/light mode di sistem OS-mu!")}
      >
        Show Toast
      </Button>
      
      <Button
        variant="outline"
        onClick={() => toast.success("Data saved successfully!")}
      >
        Success
      </Button>
      
      <Button
        variant="soft"
        color="red"
        onClick={() => toast.error("Failed to save data")}
      >
        Error
      </Button>
    </div>
  );
}