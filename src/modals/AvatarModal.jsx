import { useState, useContext, useRef } from 'react';
import { useUppyState } from '@uppy/react';
import DefaultStore from '@uppy/store-default';
import { useUppyWithSupabase } from '../common/hooks';
import { supabase } from '../common/supabase';
import { UserContext, ModalContext } from '../common/contexts';
import UploadFileButton from '../components/UploadFileButton';
import UploadFileTable from '../components/UploadFileTable';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { UPLOAD_TYPE } from '../common/enums';

function AvatarModal() {
  const { user, setUser } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const uppyAvatar = useUppyWithSupabase({
    store: new DefaultStore(),
    restrictions: {
      minNumberOfFiles: 1,
      maxNumberOfFiles: 1,
      maxFileSize: UPLOAD_TYPE.AVATAR.sizeLimit,
      allowedFileTypes: UPLOAD_TYPE.AVATAR.mimeTypes,
    },
  });

  const uppyAvatarFiles = useUppyState(uppyAvatar, (state) =>
    Object.values(state.files)
  );

  const avatarUploadFileButtonRef = useRef();

  async function updateUserAvatar(avatarId) {
    const { data } = await supabase
      .from('users')
      .update({
        avatar_id: avatarId,
      })
      .eq('id', user.id)
      .select('*, avatar:avatar_id(*)');

    setUser(data[0]);
  }

  async function addAvatar(file) {
    const { data } = await supabase
      .from('avatars')
      .insert({
        user_id: user.id,
        name: file.meta.objectName,
        width: file.meta.width,
        height: file.meta.height,
      })
      .select('*');

    return data[0];
  }

  return (
    <Modal>
      <div className="flex flex-col gap-4">
        <UploadFileButton
          id="uppyAvatar"
          uppy={uppyAvatar}
          text={`Select Avatar (${uppyAvatarFiles.length}/1)`}
          isDisabled={uploadStarted || uppyAvatarFiles.length === 1}
          allowedMimeTypes={UPLOAD_TYPE.AVATAR.mimeTypes.toString()}
          allowedFileSize={UPLOAD_TYPE.AVATAR.sizeLimit}
          bucketName={UPLOAD_TYPE.AVATAR.bucketName}
          uploadFileButtonRef={avatarUploadFileButtonRef}
        />
        {uppyAvatarFiles.length > 0 && (
          <UploadFileTable
            uppy={uppyAvatar}
            setUploadStarted={setUploadStarted}
            setUploadCompleted={setUploadCompleted}
            uploadFileButtonRef={avatarUploadFileButtonRef}
          />
        )}
      </div>
      <div className="flex gap-2 self-end">
        <Button
          isDisabled={uploadStarted}
          handleClick={() => {
            uppyAvatar.cancelAll();
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
            uploadStarted || uploadCompleted || uppyAvatarFiles.length === 0
          }
          handleClick={async () => {
            const result = await uppyAvatar.upload();
            if (result && result.failed.length === 0) {
              const files = result.successful;
              const avatar = await addAvatar(files[0]);
              await updateUserAvatar(avatar.id);
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
    </Modal>
  );
}

export default AvatarModal;
