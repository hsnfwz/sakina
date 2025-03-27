import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import DefaultStore from '@uppy/store-default';
import { UPLOAD_TYPE } from '../common/enums';
import { formatFileName } from '../common/helpers';
import { useUppyWithSupabase } from '../common/hooks';
import { supabase } from '../common/supabase';
import { ModalContext } from '../common/context/ModalContextProvider';
import { AuthContext } from '../common/context/AuthContextProvider';
import UploadFileButton from '../components/UploadFileButton';
import Modal from '../components/Modal';
import Toggle from '../components/Toggle';
import TextInput from '../components/TextInput';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

function CreateModal() {
  const titleCharacterLimit = 100;
  const descriptionCharacterLimit = 2000;

  const location = useLocation();
  const { authUser } = useContext(AuthContext);
  const { showModal, setShowModal } = useContext(ModalContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uppyClip = useUppyWithSupabase({
    store: new DefaultStore(),
    restrictions: {
      minNumberOfFiles: 1,
      maxNumberOfFiles: 1,
      maxFileSize: UPLOAD_TYPE.CLIP.sizeLimit,
      allowedFileTypes: UPLOAD_TYPE.CLIP.mimeTypes,
    },
  });

  const uppyClipThumbnail = useUppyWithSupabase({
    store: new DefaultStore(),
    restrictions: {
      minNumberOfFiles: 0,
      maxNumberOfFiles: 1,
      maxFileSize: UPLOAD_TYPE.CLIP_THUMBNAIL.sizeLimit,
      allowedFileTypes: UPLOAD_TYPE.CLIP_THUMBNAIL.mimeTypes,
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
      maxFileSize: UPLOAD_TYPE.VIDEO_THUMBNAIL.sizeLimit,
      allowedFileTypes: UPLOAD_TYPE.VIDEO_THUMBNAIL.mimeTypes,
    },
  });

  const [uppyVideoFile, setUppyVideoFile] = useState(null);
  const [uppyVideoThumbnailFile, setUppyVideoThumbnailFile] = useState(null);
  const [uppyClipFile, setUppyClipFile] = useState(null);
  const [uppyClipThumbnailFile, setUppyClipThumbnailFile] = useState(null);

  const videoUploadFileButtonRef = useRef();
  const videoThumbnailUploadFileButtonRef = useRef();
  const clipUploadFileButtonRef = useRef();
  const clipThumbnailUploadFileButtonRef = useRef();

  const [uppyVideoFileUploadProgress, setUppyVideoFileUploadProgress] =
    useState(0);
  const [
    uppyVideoThumbnailFileUploadProgress,
    setUppyVideoThumbnailFileUploadProgress,
  ] = useState(0);
  const [uppyClipFileUploadProgress, setUppyClipFileUploadProgress] =
    useState(0);
  const [
    uppyClipThumbnailFileUploadProgress,
    setUppyClipThumbnailFileUploadProgress,
  ] = useState(0);

  function handleFileAdded(file, bucketName) {
    file.name =
      formatFileName(file.name) + '_' + Date.now() + '.' + file.extension;

    file.meta = {
      ...file.meta,
      bucketName,
      objectName: file.name,
      contentType: file.type,
    };

    if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif'
    ) {
      const image = document.createElement('img');
      image.addEventListener('load', (event) => {});
      image.src = URL.createObjectURL(file.data);
    } else if (
      file.meta.type === 'video/mp4' ||
      file.meta.type === 'video/mov' ||
      file.meta.type === 'video/avi'
    ) {
      const video = document.createElement('video');
      video.addEventListener('loadedmetadata', (event) => {
        file.meta.duration = video.duration;
      });
      video.src = URL.createObjectURL(file.data);
    }
  }

  useEffect(() => {
    uppyVideo.on('file-added', (file) => {
      handleFileAdded(file, UPLOAD_TYPE.VIDEO.bucketName);
      setUppyVideoFile(file);
    });
    uppyVideo.on('upload-complete', () => {
      videoUploadFileButtonRef.current.value = null;
    });
    uppyVideo.on('upload-progress', (file, progress) =>
      setUppyVideoFileUploadProgress(file.progress.percentage)
    );
  }, [uppyVideo]);

  useEffect(() => {
    uppyVideoThumbnail.on('file-added', (file) => {
      handleFileAdded(file, UPLOAD_TYPE.VIDEO_THUMBNAIL.bucketName);
      setUppyVideoThumbnailFile(file);
    });
    uppyVideoThumbnail.on('upload-complete', () => {
      videoThumbnailUploadFileButtonRef.current.value = null;
    });
    uppyVideoThumbnail.on('upload-progress', (file, progress) =>
      setUppyVideoThumbnailFileUploadProgress(file.progress.percentage)
    );
  }, [uppyVideoThumbnail]);

  useEffect(() => {
    uppyClip.on('file-added', (file) => {
      handleFileAdded(file, UPLOAD_TYPE.CLIP.bucketName);
      setUppyClipFile(file);
    });
    uppyClip.on('upload-complete', () => {
      clipUploadFileButtonRef.current.value = null;
    });
    uppyClip.on('upload-progress', (file, progress) =>
      setUppyClipFileUploadProgress(file.progress.percentage)
    );
  }, [uppyClip]);

  useEffect(() => {
    uppyClipThumbnail.on('file-added', (file) => {
      handleFileAdded(file, UPLOAD_TYPE.CLIP_THUMBNAIL.bucketName);
      setUppyClipThumbnailFile(file);
    });
    uppyClipThumbnail.on('upload-complete', () => {
      clipThumbnailUploadFileButtonRef.current.value = null;
    });
    uppyClipThumbnail.on('upload-progress', (file, progress) =>
      setUppyClipThumbnailFileUploadProgress(file.progress.percentage)
    );
  }, [uppyClipThumbnail]);

  async function addClip(clipFile, clipThumbnailFile) {
    const { data, error } = await supabase
      .from('clips')
      .insert({
        user_id: authUser.id,
        title,
        description,
        clip_file_name: clipFile.meta.objectName,
        clip_duration: clipFile.meta.duration,
        clip_thumbnail_file_name: clipThumbnailFile
          ? clipThumbnailFile.meta.objectName
          : null,
      })
      .select('id');

    return data[0];
  }

  async function addVideo(videoFile, videoThumbnailFile) {
    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: authUser.id,
        title,
        description,
        video_file_name: videoFile.meta.objectName,
        video_duration: videoFile.meta.duration,
        video_thumbnail_file_name: videoThumbnailFile
          ? videoThumbnailFile.meta.objectName
          : null,
      })
      .select('id');

    return data[0];
  }

  async function addDiscussion() {
    const { data, error } = await supabase
      .from('discussions')
      .insert({
        user_id: authUser.id,
        title,
        description,
        is_anonymous: isAnonymous,
      })
      .select('id');

    if (error) console.log(error);
  }

  if (showModal.type === 'CREATE_MODAL') {
    return (
      <Modal isDisabled={isUploading}>
        <nav className="flex w-full bg-black text-white">
          {authUser && authUser.is_verified && (
            <>
              <Link className="px-4 py-2 text-xs" to="#video">
                Video
              </Link>
              <Link className="px-4 py-2 text-xs" to="#clip">
                Clip
              </Link>
            </>
          )}
          <Link className="px-4 py-2 text-xs" to="#discussion">
            Discussion
          </Link>
        </nav>
        {(location.hash === '' || location.hash === '#video') && (
          <>
            <UploadFileButton
              id="uppyVideo"
              uppy={uppyVideo}
              text={`Select Video`}
              allowedMimeTypes={UPLOAD_TYPE.VIDEO.mimeTypes.toString()}
              allowedFileSize={UPLOAD_TYPE.VIDEO.sizeLimit}
              bucketName={UPLOAD_TYPE.VIDEO.bucketName}
              uploadFileButtonRef={videoUploadFileButtonRef}
              isDisabled={isUploading}
            />
            {uppyVideoFile && (
              <div className="flex w-full justify-between gap-2 rounded-lg border-2 border-dotted p-2">
                <p className="w-full">{uppyVideoFile.data.name}</p>
                {uppyVideoFileUploadProgress > 0 && (
                  <p className="font-bold">{uppyVideoFileUploadProgress}%</p>
                )}
              </div>
            )}
            <UploadFileButton
              id="uppyVideoThumbnail"
              uppy={uppyVideoThumbnail}
              text={`Select Thumbnail`}
              allowedMimeTypes={UPLOAD_TYPE.VIDEO_THUMBNAIL.mimeTypes.toString()}
              allowedFileSize={UPLOAD_TYPE.VIDEO_THUMBNAIL.sizeLimit}
              bucketName={UPLOAD_TYPE.VIDEO_THUMBNAIL.bucketName}
              uploadFileButtonRef={videoThumbnailUploadFileButtonRef}
              isDisabled={isUploading}
            />
            {uppyVideoThumbnailFile && (
              <div className="flex w-full justify-between gap-2 rounded-lg border-2 border-dotted p-2">
                <p className="w-full">{uppyVideoThumbnailFile.data.name}</p>
                {uppyVideoThumbnailFileUploadProgress > 0 && (
                  <p className="font-bold">
                    {uppyVideoThumbnailFileUploadProgress}%
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {location.hash === '#clip' && (
          <>
            <UploadFileButton
              id="uppyClip"
              uppy={uppyClip}
              text={`Select Clip`}
              allowedMimeTypes={UPLOAD_TYPE.CLIP.mimeTypes.toString()}
              allowedFileSize={UPLOAD_TYPE.CLIP.sizeLimit}
              bucketName={UPLOAD_TYPE.CLIP.bucketName}
              uploadFileButtonRef={clipUploadFileButtonRef}
              isDisabled={isUploading}
            />
            {uppyClipFile && (
              <div className="flex w-full justify-between gap-2 rounded-lg border-2 border-dotted p-2">
                <p className="w-full">{uppyClipFile.data.name}</p>
                {uppyClipFileUploadProgress > 0 && (
                  <p className="font-bold">{uppyClipFileUploadProgress}%</p>
                )}
              </div>
            )}
            <UploadFileButton
              id="uppyClipThumbnail"
              uppy={uppyClipThumbnail}
              text={`Select Thumbnail`}
              allowedMimeTypes={UPLOAD_TYPE.CLIP_THUMBNAIL.mimeTypes.toString()}
              allowedFileSize={UPLOAD_TYPE.CLIP_THUMBNAIL.sizeLimit}
              bucketName={UPLOAD_TYPE.CLIP_THUMBNAIL.bucketName}
              uploadFileButtonRef={clipThumbnailUploadFileButtonRef}
              isDisabled={isUploading}
            />
            {uppyClipThumbnailFile && (
              <div className="flex w-full justify-between gap-2 rounded-lg border-2 border-dotted p-2">
                <p className="w-full">{uppyClipThumbnailFile.data.name}</p>
                {uppyClipThumbnailFileUploadProgress > 0 && (
                  <p className="font-bold">
                    {uppyClipThumbnailFileUploadProgress}%
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p
              className={`self-end ${title.length > titleCharacterLimit ? 'text-rose-500' : 'text-black'}`}
            >
              {title.length} / {titleCharacterLimit}
            </p>
            <TextInput
              handleInput={(event) => setTitle(event.target.value)}
              placeholder="Title"
              value={title}
              isDisabled={isUploading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p
              className={`self-end ${description.length > descriptionCharacterLimit ? 'text-rose-500' : 'text-black'}`}
            >
              {description.length} / {descriptionCharacterLimit}
            </p>
            <Textarea
              handleInput={(event) => setDescription(event.target.value)}
              placeholder="Description"
              value={description}
              isDisabled={isUploading}
            />
          </div>
        </div>

        {(location.hash === '' || location.hash === '#video') && (
          <div className="flex gap-2 self-end">
            <Button
              handleClick={() => {
                setTitle('');
                setDescription('');
                uppyVideo.cancelAll();
                uppyVideoThumbnail.cancelAll();
                setShowModal({
                  type: null,
                  data: null,
                });
              }}
              isDisabled={isUploading}
            >
              Close
            </Button>
            <Button
              isDisabled={
                title.length === 0 ||
                title.length > titleCharacterLimit ||
                description.length > descriptionCharacterLimit ||
                !uppyVideoFile ||
                !uppyVideoThumbnailFile ||
                isUploading
              }
              handleClick={async () => {
                setIsUploading(true);

                const [videoUploadResult, videoThumbnailUploadResult] =
                  await Promise.all([
                    uppyVideo.upload(),
                    uppyVideoThumbnail.upload(),
                  ]);

                if (
                  videoUploadResult &&
                  videoUploadResult.failed.length === 0 &&
                  videoThumbnailUploadResult &&
                  videoThumbnailUploadResult.failed.length === 0
                ) {
                  const videoFile = videoUploadResult.successful[0];
                  const videoThumbnailFile =
                    videoThumbnailUploadResult.successful[0];

                  await addVideo(videoFile, videoThumbnailFile);
                }

                setIsUploading(false);
                setUppyVideoFile(null);
                setUppyVideoThumbnailFile(null);
                setUppyVideoFileUploadProgress(0);
                setUppyVideoThumbnailFileUploadProgress(0);
                setTitle('');
                setDescription('');

                setShowModal({ type: null, data: null });
              }}
            >
              Submit
            </Button>
          </div>
        )}

        {location.hash === '#clip' && (
          <div className="flex gap-2 self-end">
            <Button
              handleClick={() => {
                setTitle('');
                setDescription('');
                uppyClip.cancelAll();
                uppyClipThumbnail.cancelAll();
                setShowModal({
                  type: null,
                  data: null,
                });
              }}
              isDisabled={isUploading}
            >
              Close
            </Button>
            <Button
              isDisabled={
                title.length === 0 ||
                title.length > titleCharacterLimit ||
                description.length > descriptionCharacterLimit ||
                !uppyClipFile ||
                !uppyClipThumbnailFile ||
                isUploading
              }
              handleClick={async () => {
                setIsUploading(true);

                const [clipUploadResult, clipThumbnailUploadResult] =
                  await Promise.all([
                    uppyClip.upload(),
                    uppyClipThumbnail.upload(),
                  ]);

                if (
                  clipUploadResult &&
                  clipUploadResult.failed.length === 0 &&
                  clipThumbnailUploadResult &&
                  clipThumbnailUploadResult.failed.length === 0
                ) {
                  const clipFile = clipUploadResult.successful[0];
                  const clipThumbnailFile =
                    clipThumbnailUploadResult.successful[0];

                  await addClip(clipFile, clipThumbnailFile);
                }

                setIsUploading(false);
                setUppyClipFile(null);
                setUppyClipThumbnailFile(null);
                setUppyClipFileUploadProgress(0);
                setUppyClipThumbnailFileUploadProgress(0);
                setTitle('');
                setDescription('');

                setShowModal({ type: null, data: null });
              }}
            >
              Submit
            </Button>
          </div>
        )}

        {location.hash === '#discussion' && (
          <>
            <div className="flex items-center gap-2">
              <Toggle
                handleChange={() => setIsAnonymous(!isAnonymous)}
                isChecked={isAnonymous}
              />
              <p>Anonymous</p>
            </div>
            <div className="flex gap-2 self-end">
              <Button
                handleClick={() => {
                  setTitle('');
                  setDescription('');
                  setShowModal({
                    type: null,
                    data: null,
                  });
                }}
              >
                Close
              </Button>
              <Button
                isDisabled={
                  title.length === 0 ||
                  title.length > titleCharacterLimit ||
                  description.length > descriptionCharacterLimit
                }
                handleClick={async () => {
                  setIsUploading(true);

                  await addDiscussion();

                  setIsUploading(false);
                  setTitle('');
                  setDescription('');
                  setIsAnonymous(false);

                  setShowModal({ type: null, data: null });
                }}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </Modal>
    );
  }
}

export default CreateModal;
