import React, { useEffect, useRef } from "react";
import * as LR from "@uploadcare/blocks";
import { useRouter } from "next/navigation";

type Props = {
  onUpload: (e: string) => any;
};

LR.registerBlocks(LR);
const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter();
  const ctxProviderRef = useRef<
    typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
  | null>(null);

  useEffect(() => {
    const handleUpload = async (e: any) => {
      const file = await onUpload(e.detail.cdnUrl);
      if (file) {
        router.refresh();
      }
    };
    // Ensure ctxProviderRef.current is not null before adding event listener
    if (ctxProviderRef.current) {
      ctxProviderRef.current.addEventListener(
        "file-upload-success",
        handleUpload
      );
    }

    // Cleanup function to remove event listener
    return () => {
      if (ctxProviderRef.current) {
        ctxProviderRef.current.removeEventListener(
          "file-upload-success",
          handleUpload
        );
      }
    };
  }, [onUpload, router]);

  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey={`${process.env.UPLOAD_CARE_PUBKEY}`}
      />

      <lr-file-uploader-regular
        ctx-name="my-uploader"
        css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.38.1/web/lr-file-uploader-regular.min.css`}
      />

      <lr-upload-ctx-provider ctx-name="my-uploader" ref={ctxProviderRef} />
    </div>
  );
};

export default UploadCareButton;
