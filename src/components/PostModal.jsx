import { useUppyState } from "@uppy/react";
import DefaultStore from "@uppy/store-default";
import { useContext, useEffect, useRef, useState } from "react";
import { ModalContext, SessionContext, UserContext } from "../common/contexts";
import { formatFileName } from "../common/helpers";
import { useUppyWithSupabase } from "../common/hooks";
import { supabase } from "../common/supabase";
import FileUpload from "./FileUpload";
import Modal from "./Modal";

function PostModal() {
  const { user } = useContext(UserContext);
  const { session } = useContext(SessionContext);
  const { setShowModal } = useContext(ModalContext);

  const [uploadType, setUploadType] = useState("IMAGE");
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function onBeforeFileAdded(currentFile) {
    const modifiedFile = {
      ...currentFile,
      name:
        Date.now() +
        "_" +
        formatFileName(currentFile.name) +
        "." +
        currentFile.extension,
    };
    return modifiedFile;
  }

  const uppyImage = useUppyWithSupabase({
    id: "images",
    store: new DefaultStore(),
    restrictions: {
      maxNumberOfFiles: 5,
      maxFileSize: 50000000,
      minNumberOfFiles: 1,
      allowedFileTypes: [".jpeg", ".jpg", ".png"],
    },
    onBeforeFileAdded,
  });

  const uppyVerticalVideo = useUppyWithSupabase({
    id: "vertical-videos",
    store: new DefaultStore(),
    restrictions: {
      maxNumberOfFiles: 1,
      maxFileSize: 50000000,
      minNumberOfFiles: 1,
      allowedFileTypes: [".mp4", ".m4v", ".mov"],
    },
    onBeforeFileAdded,
  });

  const uppyVerticalVideoThumbnail = useUppyWithSupabase({
    id: "vertical-video-thumbnails",
    store: new DefaultStore(),
    restrictions: {
      maxNumberOfFiles: 1,
      maxFileSize: 50000000,
      minNumberOfFiles: 0,
      allowedFileTypes: [".jpeg", ".jpg", ".png"],
    },
    onBeforeFileAdded,
  });

  const uppyHorizontalVideo = useUppyWithSupabase({
    id: "horizontal-videos",
    store: new DefaultStore(),
    restrictions: {
      maxNumberOfFiles: 1,
      maxFileSize: 50000000,
      minNumberOfFiles: 1,
      allowedFileTypes: [".mp4", ".m4v", ".mov"],
    },
    onBeforeFileAdded,
  });

  const uppyHorizontalVideoThumbnail = useUppyWithSupabase({
    id: "horizontal-videos-thumbnails",
    store: new DefaultStore(),
    restrictions: {
      maxNumberOfFiles: 1,
      maxFileSize: 50000000,
      minNumberOfFiles: 0,
      allowedFileTypes: [".jpeg", ".jpg", ".png"],
    },
    onBeforeFileAdded,
  });

  const uppyImageFiles = useUppyState(uppyImage, (state) =>
    Object.values(state.files),
  );
  const uppyVerticalVideoFiles = useUppyState(uppyVerticalVideo, (state) =>
    Object.values(state.files),
  );
  const uppyVerticalVideoThumbnailFiles = useUppyState(
    uppyVerticalVideoThumbnail,
    (state) => Object.values(state.files),
  );
  const uppyHorizontalVideoFiles = useUppyState(uppyHorizontalVideo, (state) =>
    Object.values(state.files),
  );
  const uppyHorizontalVideoThumbnailFiles = useUppyState(
    uppyHorizontalVideoThumbnail,
    (state) => Object.values(state.files),
  );

  async function submitImage() {
    const result = await uppyImage.upload();

    if (result && result.failed !== 0) {
      const files = result.successful.map((file) => file.name);

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        // description,
        files,
        // parent_post_id: parentPostId,
        type: uploadType,
      });

      if (error) console.log(error);
    } else {
      // set errors to render to user
      console.log("ERROR", result);
    }

    setShowModal(null);
  }

  async function submitVerticalVideo() {
    let thumbnail = null;

    const result = await uppyVerticalVideo.upload();

    if (result && result.failed !== 0) {
      if (uppyVerticalVideoThumbnailFiles.length !== 0) {
        const result = await uppyVerticalVideoThumbnail.upload();

        if (result.failed !== 0) {
          const file = result.successful[0];
          thumbnail = file.name;
        }
      }

      const file = result.successful[0];
      const video = file.name;

      const files = [video];

      if (thumbnail) files.push(thumbnail);

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        // description,
        files,
        // parent_post_id: parentPostId,
        type: uploadType,
      });

      if (error) console.log(error);
    }

    setShowModal(null);
  }

  async function submitHorizontalVideo() {
    let thumbnail = null;

    const result = await uppyHorizontalVideo.upload();

    if (result && result.failed !== 0) {
      if (uppyHorizontalVideoThumbnailFiles.length !== 0) {
        const result = await uppyHorizontalVideoThumbnail.upload();

        if (result.failed !== 0) {
          const file = result.successful[0];
          thumbnail = file.name;
        }
      }

      const file = result.successful[0];
      const video = file.name;

      const files = [video];

      if (thumbnail) files.push(thumbnail);

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        // description,
        files,
        // parent_post_id: parentPostId,
        type: uploadType,
      });

      if (error) console.log(error);
    }

    setShowModal(null);
  }

  const contentEditableRef = useRef(null);
  const [contentEditableEvent, setContentEditableEvent] = useState(null);

  useEffect(() => {
    console.log("[contentEditableEvent]", contentEditableEvent);

    const key = contentEditableEvent?.key;

    if (key === "Backspace") {
      console.log("BACKSPACE");
    } else if (key === "@") {
      console.log("@");
    } else if (key === " ") {
      console.log("SPACE");
    }
  }, [contentEditableEvent]);

  return (
    <Modal>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded-lg p-2 disabled:pointer-events-none ${uploadType === "IMAGE" ? "bg-sky-500" : "bg-neutral-700"}`}
            disabled={uploadType === "IMAGE"}
            onClick={() => {
              uppyVerticalVideo.cancelAll();
              uppyVerticalVideoThumbnail.cancelAll();
              uppyHorizontalVideo.cancelAll();
              uppyHorizontalVideoThumbnail.cancelAll();
              setUploadType("IMAGE");
            }}
          >
            Image
          </button>
          <button
            type="button"
            className={`rounded-lg p-2 disabled:pointer-events-none ${uploadType === "VERTICAL_VIDEO" ? "bg-sky-500" : "bg-neutral-700"}`}
            disabled={uploadType === "VERTICAL_VIDEO"}
            onClick={() => {
              uppyImage.cancelAll();
              uppyHorizontalVideo.cancelAll();
              uppyHorizontalVideoThumbnail.cancelAll();
              setUploadType("VERTICAL_VIDEO");
            }}
          >
            Vertical Video
          </button>
          <button
            type="button"
            className={`rounded-lg p-2 disabled:pointer-events-none ${uploadType === "HORIZONTAL_VIDEO" ? "bg-sky-500" : "bg-neutral-700"}`}
            disabled={uploadType === "HORIZONTAL_VIDEO"}
            onClick={() => {
              uppyImage.cancelAll();
              uppyVerticalVideo.cancelAll();
              uppyVerticalVideoThumbnail.cancelAll();
              setUploadType("HORIZONTAL_VIDEO");
            }}
          >
            Horizontal Video
          </button>
        </div>

        {uploadType === "IMAGE" && (
          <>
            <FileUpload
              id="uppyImage"
              bucketName="images"
              uppy={uppyImage}
              text={
                uppyImageFiles.length > 0
                  ? `Add More (${uppyImageFiles.length}/5)`
                  : "Browse Files"
              }
              disabled={uploadStarted || uppyImageFiles.length === 5}
              accept="image/png, image/jpeg, image/jpg"
              setUploadStarted={setUploadStarted}
              setUploadCompleted={setUploadCompleted}
            />
          </>
        )}
        {uploadType === "VERTICAL_VIDEO" && (
          <>
            <FileUpload
              id="uppyVerticalVideo"
              bucketName="vertical-videos"
              uppy={uppyVerticalVideo}
              text={
                uppyVerticalVideoFiles.length > 0
                  ? `Add More (${uppyVerticalVideoFiles.length}/1)`
                  : "Browse Files"
              }
              disabled={uploadStarted || uppyVerticalVideoFiles.length === 1}
              accept="video/mp4, video/m4v, video/mov"
              setUploadStarted={setUploadStarted}
              setUploadCompleted={
                uppyVerticalVideoThumbnailFiles.length > 0
                  ? undefined
                  : setUploadCompleted
              }
            />
            <FileUpload
              id="uppyVerticalVideoThumbnail"
              bucketName="vertical-video-thumbnails"
              uppy={uppyVerticalVideoThumbnail}
              text={
                uppyVerticalVideoThumbnailFiles.length > 0
                  ? `Add More (${uppyVerticalVideoThumbnailFiles.length}/1)`
                  : "Browse Files"
              }
              disabled={
                uploadStarted || uppyVerticalVideoThumbnailFiles.length === 1
              }
              accept="image/png, image/jpeg, image/jpg"
              setUploadCompleted={
                uppyVerticalVideoThumbnailFiles.length > 0
                  ? setUploadCompleted
                  : undefined
              }
            />
          </>
        )}
        {uploadType === "HORIZONTAL_VIDEO" && (
          <>
            <FileUpload
              id="uppyHorizontalVideo"
              bucketName="horizontal-videos"
              uppy={uppyHorizontalVideo}
              text={
                uppyHorizontalVideoFiles.length > 0
                  ? `Add More (${uppyHorizontalVideoFiles.length}/1)`
                  : "Browse Files"
              }
              disabled={uploadStarted || uppyHorizontalVideoFiles.length === 1}
              accept="video/mp4, video/m4v, video/mov"
              setUploadStarted={setUploadStarted}
              setUploadCompleted={
                uppyHorizontalVideoThumbnailFiles.length > 0
                  ? undefined
                  : setUploadCompleted
              }
            />
            <FileUpload
              id="uppyHorizontalVideoThumbnail"
              bucketName="horizontal-video-thumbnails"
              uppy={uppyHorizontalVideoThumbnail}
              text={
                uppyHorizontalVideoThumbnailFiles.length > 0
                  ? `Add More (${uppyHorizontalVideoThumbnailFiles.length}/1)`
                  : "Browse Files"
              }
              disabled={
                uploadStarted || uppyHorizontalVideoThumbnailFiles.length === 1
              }
              accept="image/png, image/jpeg, image/jpg"
              setUploadCompleted={
                uppyHorizontalVideoThumbnailFiles.length > 0
                  ? setUploadCompleted
                  : undefined
              }
            />
          </>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p>Title</p>
            <div
              className="w-full rounded-lg border p-2 focus:border focus:border-white focus:outline-none focus:ring-0 dark:border-neutral-700"
              ref={contentEditableRef}
              contentEditable
              onKeyDown={(event) => setContentEditableEvent(event)}
            ></div>
          </div>
          <div className="flex flex-col gap-2">
            <p>Description (Optional)</p>
            <div
              contentEditable
              className="w-full rounded-lg border p-2 focus:border focus:border-white focus:outline-none focus:ring-0 dark:border-neutral-700"
            ></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex rounded-lg bg-neutral-700 p-2 disabled:pointer-events-none disabled:opacity-50"
            disabled={
              title === "" ||
              uploadStarted ||
              uploadCompleted ||
              (uppyImageFiles.length === 0 &&
                uppyVerticalVideoFiles.length === 0 &&
                uppyHorizontalVideoFiles.length === 0)
            }
            type="button"
            onClick={async () => {
              if (
                title.length >= 1 &&
                title.length <= 40 &&
                description.length <= 400
              ) {
                if (uploadType === "IMAGE") {
                  await submitImage();
                } else if (uploadType === "VERTICAL_VIDEO") {
                  await submitVerticalVideo();
                } else if (uploadType === "HORIZONTAL_VIDEO") {
                  await submitHorizontalVideo();
                }
              }
            }}
          >
            Submit
          </button>
          <button
            className="flex rounded-lg bg-neutral-700 p-2 disabled:pointer-events-none disabled:opacity-50"
            type="button"
            disabled={uploadStarted}
            onClick={() => {
              if (uploadType === "IMAGE") {
                uppyImage.cancelAll();
              } else if (uploadType === "VERTICAL_VIDEO") {
                uppyVerticalVideo.cancelAll();
              } else if (uploadType === "HORIZONTAL_VIDEO") {
                uppyHorizontalVideo.cancelAll();
              }
              setShowModal(null);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PostModal;
