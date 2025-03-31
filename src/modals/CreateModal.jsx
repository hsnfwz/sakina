import { useState, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import DefaultStore from '@uppy/store-default';
import { BUTTON_COLOR, CHARACTER_LIMIT, UPLOAD_TYPE } from '../common/enums';
import { handleFileAdded } from '../common/helpers';
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
import Anchor from '../components/Anchor';
import Radio from '../components/Radio';

function CreateModal() {
  const titleCharacterLimit = 100;
  const descriptionCharacterLimit = 2000;

  const location = useLocation();
  const { authUser } = useContext(AuthContext);
  const { modal, setModal } = useContext(ModalContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orientation, setOrientation] = useState('HORIZONTAL');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (modal.type === 'CREATE_MODAL') {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [modal]);

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

  const videoUploadFileButtonRef = useRef();
  const videoThumbnailUploadFileButtonRef = useRef();

  const [uppyVideoFileUploadProgress, setUppyVideoFileUploadProgress] =
    useState(0);
  const [
    uppyVideoThumbnailFileUploadProgress,
    setUppyVideoThumbnailFileUploadProgress,
  ] = useState(0);

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

  async function addVideo(videoFile, videoThumbnailFile) {
    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: authUser.id,
        title,
        description,
        orientation,
        file_name: videoFile.meta.objectName,
        duration: videoFile.meta.duration,
        thumbnail_file_name: videoThumbnailFile
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

    return (
      <Modal isDisabled={isUploading} show={show}>
        <nav className="flex w-full">
          {authUser && authUser.is_verified && (
            <>
              <Anchor
                active={location.hash === '' || location.hash === '#video'}
                to="#video"
                handleClick={() => setOrientation('HORIZONTAL')}
              >
                Video
              </Anchor>
                            <Anchor
                            active={location.hash === '#clip'}
                            to="#clip"
                            handleClick={() => setOrientation('VERTICAL')}
                          >
                            Clip
                          </Anchor>
                          </>
          )}
          <Anchor active={location.hash === '#discussion'} to="#discussion">
            Discussion
          </Anchor>
        </nav>
        {location.hash !== '#discussion' && (
          <>            
              <UploadFileButton
                id="uppyVideo"
                uppy={uppyVideo}
                text={`${orientation === 'HORIZONTAL' ? 'Select Video' : 'Select Clip'}`}
                allowedMimeTypes={UPLOAD_TYPE.VIDEO.mimeTypes.toString()}
                allowedFileSize={UPLOAD_TYPE.VIDEO.sizeLimit}
                bucketName={UPLOAD_TYPE.VIDEO.bucketName}
                uploadFileButtonRef={videoUploadFileButtonRef}
                isDisabled={isUploading}
                label={`${orientation === 'HORIZONTAL' ? 'Video' : 'Clip'}`}
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
              label="Thumbnail"

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
            {/* <Radio value={orientation} fields={[['Horizontal', 'HORIZONTAL'], ['Vertical', 'VERTICAL']]} handleChange={() => {
              if (orientation === 'VERTICAL') {
                setOrientation('HORIZONTAL');
              } else {
                setOrientation('VERTICAL');
              }
            }} /> */}
          </>
        )}

        <div className="flex flex-col gap-4">
          <TextInput
            handleInput={(event) => setTitle(event.target.value)}
            placeholder="Title"
            value={title}
            isDisabled={isUploading}
            label="Title"
            limit={CHARACTER_LIMIT.TITLE}
          />
          <Textarea
            handleInput={(event) => setDescription(event.target.value)}
            placeholder="Description"
            value={description}
            isDisabled={isUploading}
            label="Description"
            limit={CHARACTER_LIMIT.DESCRIPTION}
          />
          <Toggle
            handleChange={() => setIsAnonymous(!isAnonymous)}
            isChecked={isAnonymous}
          >Anonymous</Toggle>
        </div>

        {(location.hash === '' || location.hash === '#video') && (
          <div className="flex gap-2 self-end">
            <Button
              handleClick={() => {
                setTitle('');
                setDescription('');
                uppyVideo.cancelAll();
                uppyVideoThumbnail.cancelAll();
                setModal({
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

                setModal({ type: null, data: null });
              }}
            >
              Submit
            </Button>
          </div>
        )}

        {location.hash === '#discussion' && (
            <div className="flex gap-2 self-end">
              <Button
                handleClick={() => {
                  setTitle('');
                  setDescription('');
                  setModal({
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

                  setModal({ type: null, data: null });
                }}
              >
                Submit
              </Button>
            </div>
        )}
      </Modal>
    );
}

export default CreateModal;
