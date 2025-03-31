import { useState, useContext, useRef, useEffect } from 'react';
import DefaultStore from '@uppy/store-default';
import { useUppyWithSupabase } from '../common/hooks';
import { UPLOAD_TYPE } from '../common/enums';
import { supabase } from '../common/supabase';
import { handleFileAdded } from '../common/helpers';
import { ModalContext } from '../common/context/ModalContextProvider';
import { AuthContext } from '../common/context/AuthContextProvider';
import UploadFileButton from '../components/UploadFileButton';
import Modal from '../components/Modal';
import Button from '../components/Button';

function AvatarModal() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const { modal, setModal } = useContext(ModalContext);

  const [isUploading, setIsUploading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (modal.type === 'AVATAR_MODAL') {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [modal]);

  const uppyAvatar = useUppyWithSupabase({
    store: new DefaultStore(),
    restrictions: {
      minNumberOfFiles: 1,
      maxNumberOfFiles: 1,
      maxFileSize: UPLOAD_TYPE.AVATAR.sizeLimit,
      allowedFileTypes: UPLOAD_TYPE.AVATAR.mimeTypes,
    },
  });

  const avatarUploadFileButtonRef = useRef();
  const [uppyAvatarFile, setUppyAvatarFile] = useState(null);
  const [uppyAvatarFileUploadProgress, setUppyAvatarFileUploadProgress] =
    useState(0);

  useEffect(() => {
    uppyAvatar.on('file-added', (file) => {
      handleFileAdded(file, UPLOAD_TYPE.AVATAR.bucketName);
      setUppyAvatarFile(file);
    });
    uppyAvatar.on('upload-complete', () => {
      avatarUploadFileButtonRef.current.value = null;
    });
    uppyAvatar.on('upload-progress', (file, progress) =>
      setUppyAvatarFileUploadProgress(file.progress.percentage)
    );
  }, [uppyAvatar]);

  async function updateAvatar(file) {
    const { data } = await supabase
      .from('users')
      .update({ avatar_file_name: file.meta.objectName, })
      .eq('id', authUser.id)
      .select('*');

    setAuthUser(data[0]);
  }

  return (
    <Modal show={show} isDisabled={isUploading}>
      <div className="flex flex-col gap-4">
        <UploadFileButton
          id="uppyAvatar"
          uppy={uppyAvatar}
          text={`Select Avatar`}
          isDisabled={isUploading}
          allowedMimeTypes={UPLOAD_TYPE.AVATAR.mimeTypes.toString()}
          allowedFileSize={UPLOAD_TYPE.AVATAR.sizeLimit}
          bucketName={UPLOAD_TYPE.AVATAR.bucketName}
          uploadFileButtonRef={avatarUploadFileButtonRef}
        />
                    {uppyAvatarFile && (
              <div className="flex w-full justify-between gap-2 rounded-lg border-2 border-dotted p-2">
                <p className="w-full">{uppyAvatarFile.data.name}</p>
                {uppyAvatarFileUploadProgress > 0 && (
                  <p className="font-bold">
                    {uppyAvatarFileUploadProgress}%
                  </p>
                )}
              </div>
            )}
      </div>
      <div className="flex gap-2 self-end">
        <Button
          isDisabled={isUploading}
          handleClick={() => {
            uppyAvatar.cancelAll();
            setModal({
              type: null,
              data: null,
            });
          }}
        >
          Close
        </Button>
        <Button
          isDisabled={!uppyAvatarFile || isUploading}
          handleClick={async () => {
            setIsUploading(true);
            const result = await uppyAvatar.upload();
            if (result && result.failed.length === 0) {
              const file = result.successful[0];
              await updateAvatar(file);
            }
            setIsUploading(false);
            setUppyAvatarFile(null);
            setUppyAvatarFileUploadProgress(0);
            setModal({
              type: null,
              data: null,
            });
          }}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default AvatarModal;
