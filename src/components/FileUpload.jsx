import { useUppyEvent, useUppyState } from "@uppy/react";
import { useRef, useState } from "react";
import { formatFileSize, formatFileSizeAbbreviation } from "../common/helpers";

function FileUpload({
  id,
  bucketName,
  uppy,
  name,
  text,
  disabled,
  accept,
  setUploadStarted,
  setUploadCompleted,
}) {
  const ref = useRef();

  const [fileErrors, setFileErrors] = useState([]);

  const [sizeErrorMessage, setSizeErrorMessage] = useState("");
  const [typeErrorMessage, setTypeErrorMessage] = useState("");
  const [limitErrorMessage, setLimitErrorMessage] = useState("");

  const [fileUploadStarted, setFileUploadStarted] = useState(false);
  const [fileUploadCompleted, setFileUploadCompleted] = useState(false);
  const [uploadPausedAll, setUploadPausedAll] = useState(false);
  const [uploadResumedAll, setUploadResumedAll] = useState(true);

  const uppyFiles = useUppyState(uppy, (state) => Object.values(state.files));

  useUppyEvent(uppy, "upload-start", () => {
    setFileUploadStarted(true);
    if (setUploadStarted) setUploadStarted(true);
  });

  useUppyEvent(uppy, "cancel-all", () => {
    setFileUploadStarted(false);
    if (setUploadStarted) {
      setUploadStarted(false);
    }
  });

  useUppyEvent(uppy, "complete", () => {
    setFileUploadCompleted(true);
    if (setUploadCompleted) setUploadCompleted(true);
    ref.current.value = null;
  });

  useUppyEvent(uppy, "resume-all", () => {
    setUploadPausedAll(false);
    setUploadResumedAll(true);
  });

  useUppyEvent(uppy, "pause-all", () => {
    setUploadResumedAll(false);
    setUploadPausedAll(true);
  });

  useUppyEvent(uppy, "restriction-failed", (file) => {
    console.log("[RESTRICTION]:", file);
  });

  useUppyEvent(uppy, "file-removed", () => {
    ref.current.value = null;
  });

  useUppyEvent(uppy, "file-added", (file) => {
    file.meta = {
      ...file.meta,
      bucketName, // Bucket specified by the user of the hook
      objectName: file.name, // Use file name as object name
      contentType: file.type, // Set content type based on file MIME type
    };
  });

  // useUppyEvent(uppy, 'error', (error) => {
  //   console.log('[ERROR]:', error);
  // });

  // useUppyEvent(uppy, 'upload-error', (uploadError) => {
  //   console.log('[UPLOAD ERROR]:', uploadError);
  // });

  // useUppyEvent(uppy, 'upload-stalled', () => {
  //   console.log('[UPLOAD STALLED]');
  // });

  return (
    <div>
      <input
        id={id}
        multiple
        disabled={disabled}
        name={name}
        className="peer hidden"
        ref={ref}
        type="file"
        accept={accept}
        onChange={(event) => {
          const files = Array.from(event.target.files);

          const _fileErrors = [...fileErrors];

          files.forEach((file) => {
            try {
              uppy.addFile({
                source: "file input",
                name: file.name,
                type: file.type,
                data: file,
              });
            } catch (error) {
              if (error.isRestriction) {
                const _file = error.file;

                if (_file) {
                  const size = _file.size;
                  const type = _file.meta.type;
                  const name = _file.meta.name;

                  if (size > 50000000) {
                    setSizeErrorMessage("Maximum 50MB per file.");
                  }

                  // TODO: COMEBACK TO THIS !!!!!!

                  if (
                    type !== "image/jpeg" &&
                    type !== "image/jpg" &&
                    type !== "image/png"
                  ) {
                    setTypeErrorMessage(".jpeg, .jpg, and .png files only.");
                  }

                  _fileErrors.push({
                    size,
                    type,
                    name,
                  });
                } else {
                  setLimitErrorMessage("Maximum 5 files.");
                }
              } else {
                console.error(error);
              }
            }
          });

          setFileErrors(_fileErrors);
        }}
      />
      <label
        className="block rounded-lg bg-emerald-500 p-2 text-white hover:cursor-pointer hover:bg-emerald-700 peer-disabled:cursor-default peer-disabled:opacity-50"
        htmlFor={id}
      >
        {text}
      </label>

      {uppyFiles.length > 0 && <h1>Files</h1>}
      {uppyFiles.map((file) => (
        <div key={file.id} className="flex justify-between gap-4">
          <p>{file.data.name}</p>
          <p>{file.data.type}</p>
          <p>
            {formatFileSize(file.data.size)}{" "}
            {formatFileSizeAbbreviation(file.data.size)}
          </p>

          {file.progress.uploadStarted && (
            <>
              <p>
                {file.progress.percentage}% (
                {formatFileSize(file.progress.bytesUploaded)}/
                {formatFileSize(file.progress.bytesTotal)}){" "}
                {formatFileSizeAbbreviation(file.data.size)}
              </p>
              <button
                className="disabled:opacity-50"
                disabled={file.progress.uploadComplete}
                type="button"
                onClick={() => {
                  uppy.pauseResume(file.id);
                }}
              >
                {file.isPaused ? "Resume" : "Pause"}
              </button>
            </>
          )}

          {file.error && <p>Error buddy</p>}

          <button
            className="disabled:opacity-50"
            type="button"
            disabled={fileUploadCompleted}
            onClick={() => {
              uppy.removeFile(file.id);

              if (uppy.getFiles().length === 0) {
                setFileUploadStarted(false);
                if (setUploadStarted) {
                  setUploadStarted(false);
                }
              }
            }}
          >
            Cancel
          </button>
        </div>
      ))}
      {uppyFiles.length > 1 && (
        <>
          {fileUploadStarted && (
            <>
              {uploadResumedAll && (
                <button
                  className="disabled:opacity-50"
                  type="button"
                  disabled={fileUploadCompleted}
                  onClick={() => {
                    uppy.pauseAll();
                  }}
                >
                  Pause All
                </button>
              )}
              {uploadPausedAll && (
                <button
                  className="disabled:opacity-50"
                  type="button"
                  disabled={fileUploadCompleted}
                  onClick={() => {
                    uppy.resumeAll();
                  }}
                >
                  Resume All
                </button>
              )}
            </>
          )}
          <button
            type="button"
            className="disabled:opacity-50"
            disabled={fileUploadCompleted}
            onClick={() => uppy.cancelAll()}
          >
            Cancel All
          </button>
        </>
      )}

      {fileErrors.length > 0 && <h1>Errors</h1>}
      {fileErrors.map((fileError, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="flex justify-between gap-4">
            <p>{fileError.name}</p>
            <p>{fileError.type}</p>
            <p>
              {formatFileSize(fileError.size)}{" "}
              {formatFileSizeAbbreviation(fileError.size)}
            </p>

            <button
              type="button"
              onClick={() => {
                const _fileErrors = [...fileErrors];
                _fileErrors.splice(index, 1);
                setFileErrors(_fileErrors);
              }}
            >
              Clear
            </button>
          </div>

          <ul>
            {typeErrorMessage && <li>{typeErrorMessage}</li>}
            {sizeErrorMessage && <li>{sizeErrorMessage}</li>}
            {limitErrorMessage && <li>{limitErrorMessage}</li>}
          </ul>
        </div>
      ))}
      {fileErrors.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setFileErrors([]);
          }}
        >
          Clear All
        </button>
      )}
    </div>
  );
}

export default FileUpload;
