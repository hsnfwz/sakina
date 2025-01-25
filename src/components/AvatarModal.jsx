import Uppy from "@uppy/core";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../common/contexts";
import { supabase } from "../common/supabase";

const uppy = new Uppy({
  restrictions: {
    maxNumberOfFiles: 1,
    maxFileSize: 50000000, // 50 MB
    minNumberOfFiles: 1,
    allowedFileTypes: [".jpeg", ".jpg", ".png"],
  },
  onBeforeFileAdded: (currentFile) => {
    const modifiedFile = {
      ...currentFile,
      name: Date.now() + "_" + currentFile.name + "." + currentFile.extension,
    };
    return modifiedFile;
  },
});

function AvatarModal({ showModal, hideModal, refreshUser }) {
  const { session } = useContext(SessionContext);

  const [filesExist, setFilesExist] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const initializeUppy = async () => {
      uppy.use(Tus, {
        endpoint: `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/upload/resumable`, // Supabase TUS endpoint
        retryDelays: [0, 3000, 5000, 10000, 20000], // Retry delays for resumable uploads
        headers: {
          authorization: `Bearer ${session?.access_token}`, // User session access token
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, // API key for Supabase
        },
        uploadDataDuringCreation: true, // Send metadata with file chunks
        removeFingerprintOnSuccess: true, // Remove fingerprint after successful upload
        chunkSize: 6 * 1024 * 1024, // Chunk size for TUS uploads (6MB)
        allowedMetaFields: [
          "bucketName",
          "objectName",
          "contentType",
          "cacheControl",
        ], // Metadata fields allowed for the upload
        onError: (error) => console.error("Upload error:", error), // Error handling for uploads
      });

      uppy.on("files-added", (files) => {
        files.forEach((file) => {
          // Attach metadata to each file, including bucket name and content type
          file.meta = {
            ...file.meta,
            bucketName: "avatars", // Bucket
            objectName: file.name, // Use file name as object name
            contentType: file.type, // Set content type based on file MIME type
          };
        });

        setFilesExist(uppy.getFiles().length !== 0);
      });

      uppy.on("file-removed", (file) => {
        setFilesExist(uppy.getFiles().length !== 0);
      });
    };

    if (session) initializeUppy();
  }, [session]);

  if (showModal) {
    return (
      <div id="post-modal" className="flex w-full flex-col bg-neutral-200">
        <div>
          <Dashboard
            uppy={uppy}
            showProgressDetails
            proudlyDisplayPoweredByUppy={false}
            hide
            hideUploadButton
            hideCancelButton
            singleFileFullScreen={false}
            theme="dark"
            note="Images (.jpeg/.jpg/.png) only. Up to 50MB per file. Maximum 1 file."
          />
          <button
            className="flex disabled:pointer-events-none disabled:opacity-50"
            disabled={uploading || !filesExist}
            type="button"
            onClick={async () => {
              setUploading(true);
              const result = await uppy.upload();

              if (result.successful.length > 0) {
                const file = result.successful[0].name;

                const { data, error } = await supabase
                  .from("users")
                  .update({
                    avatar_file: file,
                  })
                  .eq("id", session.user.id)
                  .select("*");

                if (error) console.log(error);

                refreshUser(data[0]);
                uppy.cancelAll();
                setFilesExist(0);
                setUploading(false);
                hideModal();
              }
            }}
          >
            Post
          </button>
          <button
            className="flex disabled:pointer-events-none disabled:opacity-50"
            type="button"
            disabled={uploading}
            onClick={() => {
              uppy.cancelAll();
              setFilesExist(0);
              setUploading(false);
              hideModal();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

export default AvatarModal;
