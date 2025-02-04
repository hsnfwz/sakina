import { useUppyEvent } from '@uppy/react';
import { useState } from 'react';
import { formatFileName } from '../common/helpers';
import Button from './Button';
import { useUppyState } from '@uppy/react';

function UploadFileButton({
  id,
  uppy,
  name,
  text,
  isDisabled,
  allowedMimeTypes,
  allowedFileSize,
  bucketName,
  uploadFileButtonRef,
}) {
  const [fileErrors, setFileErrors] = useState([]);

  const uppyFiles = useUppyState(uppy, (state) => Object.values(state.files));

  function handleChange(event) {
    const files = Array.from(event.target.files);

    const _fileErros = [];

    files.forEach((file) => {
      try {
        if (file.size > allowedFileSize) {
          _fileErros.push(`"${file.name}" is too large.`);
        } else if (!allowedMimeTypes.includes(file.type)) {
          _fileErros.push(`"${file.name}" extension is not supported.`);
        } else if (
          uppyFiles.find((uppyFile) => uppyFile.data.name === file.name)
        ) {
          _fileErros.push(`"${file.name}" has already been added.`);
        } else {
          uppy.addFile({
            source: 'file input',
            name: file.name,
            type: file.type,
            data: file,
          });
        }
      } catch (error) {
        // console.log(error);
        _fileErros.push('There was an error with one or more of your files.');
      }

      setFileErrors(_fileErros);
    });
  }

  useUppyEvent(uppy, 'file-added', (file) => {
    file.name =
      formatFileName(file.name) + '_' + Date.now() + '.' + file.extension;

    file.meta = {
      ...file.meta,
      bucketName: bucketName,
      objectName: file.name,
      contentType: file.type,
    };

    if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif'
    ) {
      const image = document.createElement('img');
      image.addEventListener('load', (event) => {
        file.meta.width = image.naturalWidth;
        file.meta.height = image.naturalHeight;
      });
      image.src = URL.createObjectURL(file.data);
    } else if (
      file.meta.type === 'video/mp4' ||
      file.meta.type === 'video/mov' ||
      file.meta.type === 'video/avi'
    ) {
      const video = document.createElement('video');
      video.addEventListener('loadedmetadata', (event) => {
        file.meta.width = video.videoWidth;
        file.meta.height = video.videoHeight;
        file.meta.duration = video.duration;
      });
      video.src = URL.createObjectURL(file.data);
    }
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <input
        id={id}
        multiple
        disabled={isDisabled}
        name={name}
        className="peer hidden"
        type="file"
        accept={allowedMimeTypes}
        onChange={handleChange}
        ref={uploadFileButtonRef}
      />
      <label
        className="flex w-full items-center justify-center self-start rounded-lg border-2 border-emerald-500 p-2 text-center text-white hover:cursor-pointer hover:bg-emerald-500 peer-disabled:pointer-events-none peer-disabled:cursor-default peer-disabled:opacity-50"
        htmlFor={id}
      >
        {text}
      </label>

      {fileErrors.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {fileErrors.map((fileError, index) => (
              <p key={index} className="text-rose-500">
                {fileError}
              </p>
            ))}
          </div>
          <Button isOutline={true} handleClick={() => setFileErrors([])}>
            Clear Message
          </Button>
        </div>
      )}
    </div>
  );
}

export default UploadFileButton;
