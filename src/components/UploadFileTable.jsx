import { useUppyEvent, useUppyState } from "@uppy/react";
import { useState } from "react";
import IconButton from "./IconButton";
import SVGPause from "./svg/SVGPause";
import SVGPlay from "./svg/SVGPlay";
import SVGOutlineX from "./svgs/outline/SVGOutlineX";

function UploadFileTable({
  uppy,
  setUploadStarted,
  setUploadCompleted,
  uploadFileButtonRef,
}) {
  const uppyFiles = useUppyState(uppy, (state) => Object.values(state.files));

  const [fileUploadStarted, setFileUploadStarted] = useState(false);
  const [fileUploadCompleted, setFileUploadCompleted] = useState(false);
  const [uploadPausedAll, setUploadPausedAll] = useState(false);
  const [uploadResumedAll, setUploadResumedAll] = useState(true);

  useUppyEvent(uppy, "file-removed", () => {
    uploadFileButtonRef.current.value = null;
  });

  useUppyEvent(uppy, "complete", () => {
    setFileUploadCompleted(true);
    if (setUploadCompleted) setUploadCompleted(true);
    uploadFileButtonRef.current.value = null;
  });

  useUppyEvent(uppy, "upload-start", () => {
    setFileUploadStarted(true);
    if (setUploadStarted) setUploadStarted(true);
  });

  useUppyEvent(uppy, "resume-all", () => {
    setUploadPausedAll(false);
    setUploadResumedAll(true);
  });

  useUppyEvent(uppy, "pause-all", () => {
    setUploadResumedAll(false);
    setUploadPausedAll(true);
  });

  useUppyEvent(uppy, "cancel-all", () => {
    setFileUploadStarted(false);
    if (setUploadStarted) {
      setUploadStarted(false);
    }
  });

  return (
    <div className="flex w-full flex-col gap-4">
      {uppyFiles.map((file) => (
        <div
          key={file.id}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dotted p-2 sm:flex-row"
        >
          <p className="w-full">{file.data.name}</p>
          {/* {!file.progress.uploadStarted && (
              <p className="w-full">
                {formatFileSize(file.data.size)}{" "}
                {formatFileSizeAbbreviation(file.data.size)}
              </p>
            )} */}
          {file.progress.uploadStarted && (
            <p className="w-full">
              {file.progress.percentage}%
              {/* ({formatFileSize(file.progress.bytesUploaded)}/
                {formatFileSize(file.progress.bytesTotal)}){" "}
                {formatFileSizeAbbreviation(file.data.size)} */}
            </p>
          )}
          <div className="ml-auto flex gap-2">
            {file.progress.uploadStarted && (
              <IconButton
                isDisabled={file.progress.uploadComplete}
                handleClick={() => {
                  uppy.pauseResume(file.id);
                }}
              >
                {file.isPaused ? <SVGPlay /> : <SVGPause />}
              </IconButton>
            )}
            <IconButton
              isDisabled={fileUploadCompleted}
              handleClick={() => {
                uppy.removeFile(file.id);

                if (uppy.getFiles().length === 0) {
                  setFileUploadStarted(false);
                  if (setUploadStarted) {
                    setUploadStarted(false);
                  }
                }
              }}
            >
              <SVGOutlineX />
            </IconButton>
          </div>
        </div>
      ))}
      {/* {uppyFiles.length > 1 && (
        <div className="flex justify-end gap-2">
          {fileUploadStarted && (
            <>
              {uploadResumedAll && (
                <Button
                  isDisabled={fileUploadCompleted}
                  handleClick={() => {
                    uppy.pauseAll();
                  }}
                >
                  Pause All
                </Button>
              )}
              {uploadPausedAll && (
                <Button
                  isDisabled={fileUploadCompleted}
                  handleClick={() => {
                    uppy.resumeAll();
                  }}
                >
                  Resume All
                </Button>
              )}
            </>
          )}
          <Button
            isOutline={true}
            isDisabled={fileUploadCompleted}
            handleClick={() => uppy.cancelAll()}
          >
            Cancel All
          </Button>
        </div>
      )} */}
    </div>
  );
}

export default UploadFileTable;
