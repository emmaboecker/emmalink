"use client";

import { Button } from "@/components/ui/button";
import { FiCopy } from "react-icons/fi";

export default function CopyButton({ text }: { text: string }) {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(text);
      }}
      variant={"ghost"}
      size={"icon"}
      title="Copy to clipboard"
    >
      <FiCopy />
    </Button>
  );
}
