import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { useUppyState } from '@uppy/react';
import DefaultStore from '@uppy/store-default';
import { useUppyWithSupabase } from '../common/hooks';
import { supabase } from '../common/supabase';
import { UserContext, ModalContext } from '../common/contexts';
import UploadFileButton from '../components/UploadFileButton';
import UploadFileTable from '../components/UploadFileTable';
import Modal from '../components/Modal';
import Toggle from '../components/Toggle';
import TextInput from '../components/TextInput';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import { UPLOAD_TYPE } from '../common/enums';

function PostModal() {
  const titleCharacterLimit = 100;
  const descriptionCharacterLimit = 2000;

  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  const location = useLocation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const [isAddingPost, setIsAddingPost] = useState(false);

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

  const uppyImageFiles = useUppyState(uppyImage, (state) =>
    Object.values(state.files)
  );
  const uppyVideoFiles = useUppyState(uppyVideo, (state) =>
    Object.values(state.files)
  );
  const uppyVideoThumbnailFiles = useUppyState(uppyVideoThumbnail, (state) =>
    Object.values(state.files)
  );

  const imageUploadFileButtonRef = useRef();
  const videoUploadFileButtonRef = useRef();
  const videoThumbnailUploadFileButtonRef = useRef();

  async function addImagePost() {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title,
        description,
        status: 'PENDING',
        type: 'IMAGE',
        is_anonymous: isAnonymous,
      })
      .select('id');

    return data[0];
  }

  async function addVideoPost() {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title,
        description,
        status: 'PENDING',
        type: 'VIDEO',
        is_anonymous: isAnonymous,
      })
      .select('id');

    return data[0];
  }

  async function addDiscussionPost() {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title,
        description,
        status: 'PENDING',
        type: 'DISCUSSION',
        is_anonymous: isAnonymous,
      })
      .select('id');

    if (error) console.log(error);

    return data;
  }

  async function addNotification(postId) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        receiver_user_id: user.id,
        type: 'PENDING',
        post_id: postId,
      })
      .select('id');

    if (error) console.log(error);
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

  return (
    <Modal>
      <div className="flex">
        <Link
          to="#image"
          className={`${location.hash === '' || location.hash === '#image' ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
        >
          Image
        </Link>
        <Link
          to="#video"
          className={`${location.hash === '#video' ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
        >
          Video
        </Link>
        <Link
          to="#discussion"
          className={`${location.hash === '#discussion' ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
        >
          Discussion
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Toggle
            handleChange={() => setIsAnonymous(!isAnonymous)}
            isChecked={isAnonymous}
          />
          <p>Anonymous</p>
        </div>

        <div className="flex flex-col gap-2">
          <p
            className={`self-end ${title.length > titleCharacterLimit ? 'text-rose-500' : 'text-white'}`}
          >
            {title.length} / {titleCharacterLimit}
          </p>
          <TextInput
            handleInput={(event) => setTitle(event.target.value)}
            placeholder="Title"
            value={title}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p
            className={`self-end ${description.length > descriptionCharacterLimit ? 'text-rose-500' : 'text-white'}`}
          >
            {description.length} / {descriptionCharacterLimit}
          </p>
          <Textarea
            handleInput={(event) => setDescription(event.target.value)}
            placeholder="Description"
            value={description}
          />
        </div>
      </div>

      {(location.hash === '' || location.hash === '#image') && (
        <>
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
          <div className="flex gap-2 self-end">
            <Button
              isDisabled={uploadStarted}
              handleClick={() => {
                setTitle('');
                setDescription('');
                uppyImage.cancelAll();
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
                description.length > descriptionCharacterLimit ||
                uploadStarted ||
                uploadCompleted ||
                (uppyImageFiles.length === 0 && uppyVideoFiles.length === 0)
              }
              handleClick={async () => {
                const result = await uppyImage.upload();
                if (result && result.failed.length === 0) {
                  const post = await addImagePost();
                  const files = result.successful;
                  await addImages(post, files);
                  await addNotification(post.id);
                }
                setShowModal({
                  type: null,
                  data: null,
                });
              }}
            >
              Submit
            </Button>
          </div>
        </>
      )}

      {location.hash === '#video' && (
        <>
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
          <div className="flex gap-2 self-end">
            <Button
              isDisabled={uploadStarted}
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
            >
              Close
            </Button>
            <Button
              isDisabled={
                title.length === 0 ||
                title.length > titleCharacterLimit ||
                description.length > descriptionCharacterLimit ||
                uploadStarted ||
                uploadCompleted ||
                (uppyImageFiles.length === 0 && uppyVideoFiles.length === 0)
              }
              handleClick={async () => {
                const result = await uppyVideo.upload();
                if (result && result.failed.length === 0) {
                  const post = await addVideoPost();
                  const files = result.successful;
                  await addVideos(post, files);

                  if (uppyVideoThumbnailFiles.length !== 0) {
                    const result = await uppyVideoThumbnail.upload();
                    if (result && result.failed.length === 0) {
                      const files = result.successful;
                      await addImages(post, files);
                    }
                  }

                  await addNotification(post.id);
                }
                setShowModal({
                  type: null,
                  data: null,
                });
              }}
            >
              Submit
            </Button>
          </div>
        </>
      )}

      {location.hash === '#discussion' && (
        <>
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
                isAddingPost ||
                title.length === 0 ||
                title.length > titleCharacterLimit ||
                description.length > descriptionCharacterLimit
              }
              isLoading={isAddingPost}
              handleClick={async () => {
                setIsAddingPost(true);
                const data = await addDiscussionPost();
                await addNotification(data[0].id);
                setIsAddingPost(false);
                setShowModal({
                  type: null,
                  data: null,
                });
              }}
              isOutline={true}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default PostModal;
