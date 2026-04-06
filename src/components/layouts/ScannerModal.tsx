"use client";
import { useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, Button, Flex, Text } from "@radix-ui/themes";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (value: string) => void;
};

export default function ScannerModal({ open, onOpenChange, onDetected }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);
  const closedRef = useRef(false);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    scannerRef.current = null;

    try { await scanner.stop(); } catch {}
    try { scanner.clear(); } catch {}
  }, []);

  const handleClose = useCallback(async () => {
    closedRef.current = true;
    await stopScanner();
    onOpenChange(false);
  }, [stopScanner, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    closedRef.current = false;
    scannedRef.current = false;

    const startScanner = async () => {
      const element = document.getElementById("reader");
      if (!element || closedRef.current) return;

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (closedRef.current || scannedRef.current) return;
            scannedRef.current = true;

            await stopScanner();
            onDetected(decodedText);
            onOpenChange(false);
          },
          () => {}
        );
      } catch (err) {
        console.error("Scanner error:", err);
      }
    };

    const timeoutId = setTimeout(startScanner, 200);

    return () => {
      clearTimeout(timeoutId);
      stopScanner();
    };
  }, [open, stopScanner, onDetected, onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={(val) => !val && handleClose()}>
      <Dialog.Content style={{ maxWidth: 360 }}>
        <Dialog.Title>Scan Barcode</Dialog.Title>
        <Flex direction="column" gap="3">
          <div id="reader" style={{ width: "100%" }} />
          <Text size="2" color="gray" align="center">
            Arahkan kamera ke barcode
          </Text>
          <Button color="red" onClick={handleClose}>
            Tutup
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}