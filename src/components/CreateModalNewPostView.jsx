import { useUppyState } from '@uppy/react';
import DefaultStore from '@uppy/store-default';
import { useContext, useEffect, useRef, useState } from 'react';
import { ModalContext, SessionContext, UserContext } from '../common/contexts';
import { useUppyWithSupabase } from '../common/hooks';
import { supabase } from '../common/supabase';
import Button from './Button';
import Modal from './Modal';
import UploadFileButton from './UploadFileButton';
import UploadFileTable from './UploadFileTable';
import { Link } from 'react-router';
import VideoView from './VideoView';
import ImageView from './ImageView';

const UPLOAD_TYPE = Object.freeze({
  IMAGE: {
    type: 'IMAGE',
    bucketName: 'images',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    sizeLimit: 50000000, // 50 MB
  },
  VIDEO: {
    type: 'VIDEO',
    bucketName: 'videos',
    mimeTypes: ['video/mp4', 'video/mov', 'video/avi'],
    sizeLimit: 50000000, // 50 MB
  },
});

function CreateModalNewPostView() {
  const { user } = useContext(UserContext);
  const { session } = useContext(SessionContext);
  const { setShowModal } = useContext(ModalContext);

  const [uploadType, setUploadType] = useState(UPLOAD_TYPE.IMAGE.type);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const uppyImage = useUppyWithSupabase({
    store: new DefaultStore(),
    restrictions: {
      minNumberOfFiles: 1,
      maxNumberOfFiles: 5,
      maxFileSize: UPLOAD_TYPE.IMAGE.sizeLimit,
      allowedFileTypes: UPLOAD_TYPE.IMAGE.mimeTypes,
    },
  });

  const uppyVideo = useUppyWithSupabase({
    store: new DefaultStore(),
    restrictions: {
      minNumberOfFiles: 1,
      maxNumberOfFiles: 1,
      maxFileSize: UPLOAD_TYPE.VIDEO.sizeLimit,
      allowedFileTypes: UPLOAD_TYPE.VIDEO.mimeTypes,
    },
  });

  const uppyVideoThumbnail = useUppyWithSupabase({
    store: new DefaultStore(),
    restrictions: {
      minNumberOfFiles: 0,
      maxNumberOfFiles: 1,
      maxFileSize: UPLOAD_TYPE.IMAGE.sizeLimit,
      allowedFileTypes: UPLOAD_TYPE.IMAGE.mimeTypes,
    },
  });

  const uppyImageFiles = useUppyState(uppyImage, (state) => {
    console.log(state);

    return Object.values(state.files);
  });
  const uppyVideoFiles = useUppyState(uppyVideo, (state) =>
    Object.values(state.files)
  );
  const uppyVideoThumbnailFiles = useUppyState(uppyVideoThumbnail, (state) =>
    Object.values(state.files)
  );

  const imageUploadFileButtonRef = useRef();
  const videoUploadFileButtonRef = useRef();
  const videoThumbnailUploadFileButtonRef = useRef();

  async function addPost() {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title,
        description,
        type: uploadType,
      })
      .select('id');

    return data[0];
  }

  async function addImages(post, files) {
    const promises = files.map((file) => {
      return supabase.from('images').insert({
        user_id: user.id,
        post_id: post.id,
        name: file.meta.objectName,
        width: file.meta.width,
        height: file.meta.height,
      });
    });

    await Promise.all(promises);
  }

  async function addVideos(post, files) {
    const promises = files.map((file) => {
      return supabase.from('videos').insert({
        user_id: user.id,
        post_id: post.id,
        name: file.meta.objectName,
        width: file.meta.width,
        height: file.meta.height,
        duration: file.meta.duration,
      });
    });

    await Promise.all(promises);
  }

  async function addPostNotification(postId) {
    const { error } = await supabase.from('notifications').insert({
      receiver_user_id: user.id,
      type: 'PENDING',
      post_id: postId,
    });

    console.log(error);
  }

  async function handleSubmit() {
    if (uploadType === 'IMAGE') {
      const result = await uppyImage.upload();
      if (result && result.failed.length === 0) {
        const post = await addPost();
        const files = result.successful;
        await addImages(post, files);
        await addPostNotification(post.id);
      }
    } else if (uploadType === 'VIDEO') {
      const result = await uppyVideo.upload();
      if (result && result.failed.length === 0) {
        const post = await addPost();
        const files = result.successful;
        await addVideos(post, files);

        if (uppyVideoThumbnailFiles.length !== 0) {
          const result = await uppyVideoThumbnail.upload();
          if (result && result.failed.length === 0) {
            const files = result.successful;
            await addImages(post, files);
          }
        }

        await addPostNotification(post.id);
      }
    }

    setShowModal({
      type: null,
      data: null,
    });
  }

  const contentEditableRef = useRef(null);
  const [contentEditableEvent, setContentEditableEvent] = useState(null);

  useEffect(() => {
    // console.log("[contentEditableEvent]", contentEditableEvent);

    const key = contentEditableEvent?.key;

    if (key === 'Backspace') {
      console.log('BACKSPACE');
    } else if (key === '@') {
      console.log('@');
    } else if (key === ' ') {
      console.log('SPACE');
    }
  }, [contentEditableEvent]);

  // function previewImages(files) {
  //   const element = document.getElementById('preview');
  //   element.src = URL.createObjectURL(files);
  //   element.onload = function() {
  //     URL.revokeObjectURL(element.src) // free memory
  //   }
  // };

  return (
    <>
      <h1 className="text-2xl font-bold">New Post</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p>Title*</p>
          <div
            className="w-full rounded-lg border-2 p-2 focus:border-2 focus:border-white focus:outline-none focus:ring-0 dark:border-neutral-700"
            ref={contentEditableRef}
            contentEditable
            onKeyDown={(event) => setContentEditableEvent(event)}
          ></div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Description</p>
          <div
            contentEditable
            className="w-full rounded-lg border-2 p-2 focus:border-2 focus:border-white focus:outline-none focus:ring-0 dark:border-neutral-700"
          ></div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to="#"
            onClick={() => {
              uppyVideo.cancelAll();
              uppyVideoThumbnail.cancelAll();
              setUploadType(UPLOAD_TYPE.IMAGE.type);
            }}
            className={`${uploadType === 'IMAGE' ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          >
            <span className="capitalize">
              Upload {UPLOAD_TYPE.IMAGE.type.toLowerCase()}
            </span>
          </Link>
          <Link
            to="#"
            onClick={() => {
              uppyImage.cancelAll();
              setUploadType(UPLOAD_TYPE.VIDEO.type);
            }}
            className={`${uploadType === 'VIDEO' ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          >
            <span className="capitalize">
              Upload {UPLOAD_TYPE.VIDEO.type.toLowerCase()}
            </span>
          </Link>
        </div>

        {uploadType === 'IMAGE' && (
          <>
            <h1 className="text-2xl font-bold">Upload Image</h1>
            <div className="flex flex-col gap-4">
              <UploadFileButton
                id="uppyImage"
                uppy={uppyImage}
                text={`Select Images (${uppyImageFiles.length}/5)`}
                isDisabled={uploadStarted || uppyImageFiles.length === 5}
                allowedMimeTypes={UPLOAD_TYPE.IMAGE.mimeTypes.toString()}
                allowedFileSize={UPLOAD_TYPE.IMAGE.sizeLimit}
                bucketName={UPLOAD_TYPE.IMAGE.bucketName}
                uploadFileButtonRef={imageUploadFileButtonRef}
              />
              {uppyImageFiles.length > 0 && (
                <UploadFileTable
                  uppy={uppyImage}
                  setUploadStarted={setUploadStarted}
                  setUploadCompleted={setUploadCompleted}
                  uploadFileButtonRef={imageUploadFileButtonRef}
                />
              )}
            </div>
            <h2>Preview</h2>
            {/* {uppyImageFiles.length > 0 && (

            )}
            <ImageView
              images={uppyVideoThumbnailFiles}
            /> */}
          </>
        )}
        {uploadType === 'VIDEO' && (
          <>
            <h1 className="text-2xl font-bold">Upload Video</h1>
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-col gap-4">
                <UploadFileButton
                  id="uppyVideo"
                  uppy={uppyVideo}
                  text={`Select Video (${uppyVideoFiles.length}/1)`}
                  isDisabled={uploadStarted || uppyVideoFiles.length === 1}
                  allowedMimeTypes={UPLOAD_TYPE.VIDEO.mimeTypes.toString()}
                  allowedFileSize={UPLOAD_TYPE.VIDEO.sizeLimit}
                  bucketName={UPLOAD_TYPE.VIDEO.bucketName}
                  uploadFileButtonRef={videoUploadFileButtonRef}
                />
                {uppyVideoFiles.length > 0 && (
                  <UploadFileTable
                    uppy={uppyVideo}
                    setUploadStarted={setUploadStarted}
                    setUploadCompleted={
                      uppyVideoThumbnailFiles.length > 0
                        ? undefined
                        : setUploadCompleted
                    }
                    uploadFileButtonRef={videoUploadFileButtonRef}
                  />
                )}
              </div>
              <div className="flex w-full flex-col gap-4">
                <UploadFileButton
                  id="uppyVideoThumbnail"
                  uppy={uppyVideoThumbnail}
                  text={`Select Thumbnail (${uppyVideoThumbnailFiles.length}/1)`}
                  isDisabled={
                    uploadStarted || uppyVideoThumbnailFiles.length === 1
                  }
                  allowedMimeTypes={UPLOAD_TYPE.IMAGE.mimeTypes.toString()}
                  allowedFileSize={UPLOAD_TYPE.IMAGE.sizeLimit}
                  bucketName={UPLOAD_TYPE.IMAGE.bucketName}
                  uploadFileButtonRef={videoThumbnailUploadFileButtonRef}
                />
                {uppyVideoThumbnailFiles.length > 0 && (
                  <UploadFileTable
                    uppy={uppyVideoThumbnail}
                    setUploadCompleted={
                      uppyVideoThumbnailFiles.length > 0
                        ? setUploadCompleted
                        : undefined
                    }
                    uploadFileButtonRef={videoThumbnailUploadFileButtonRef}
                  />
                )}
              </div>
            </div>
            <h2>Preview</h2>
            {/* {uppyVideosFiles.length > 0 && (

            )}

            {/* <VideoView
              images={uppyVideoThumbnailFiles}
              videos={uppyVideoFiles}
            /> */}
          </>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:self-end">
        <Button
          isDisabled={uploadStarted}
          handleClick={() => {
            if (uploadType === 'IMAGE') {
              uppyImage.cancelAll();
            } else if (uploadType === 'VIDEO') {
              uppyVideo.cancelAll();
              uppyVideoThumbnail.cancelAll();
            }
            setShowModal({
              type: null,
              data: null,
            });
          }}
        >
          Close
        </Button>
        <Button
          isOutline={true}
          isDisabled={
            uploadStarted ||
            uploadCompleted ||
            (uppyImageFiles.length === 0 && uppyVideoFiles.length === 0)
          }
          handleClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </>
  );
}

export default CreateModalNewPostView;
