import { useState } from 'react';
import { BUTTON_COLOR } from '../common/enums';
import Button from './Button';

function UploadFileButton({
  id,
  uppy,
  name,
  text,
  isDisabled,
  allowedMimeTypes,
  allowedFileSize,
  uploadFileButtonRef,
  label,
}) {
  const [fileErrors, setFileErrors] = useState([]);

  function handleChange(event) {
    const file = Array.from(event.target.files)[0];

    if (!file) return;

    const _fileErros = [];

    try {
      if (file.size > allowedFileSize) {
        _fileErros.push(`"${file.name}" is too large.`);
      } else if (!allowedMimeTypes.includes(file.type)) {
        _fileErros.push(`"${file.name}" extension is not supported.`);
      } else {
        uppy.addFile({
          source: 'file input',
          name: file.name,
          type: file.type,
          data: file,
        });
      }
    } catch (error) {
      _fileErros.push('There was an error with one or more of your files.');
    }

    setFileErrors(_fileErros);
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <label>{text}</label>
      <input
        id={id}
        multiple
        disabled={isDisabled}
        name={name}
        className="flex w-full items-center justify-center self-start rounded-lg border-2 border-emerald-500 bg-emerald-500 px-2 py-1 text-center text-white outline-2 outline-transparent transition-all peer-disabled:pointer-events-none peer-disabled:cursor-default peer-disabled:opacity-50 hover:cursor-pointer hover:bg-emerald-700 focus:z-50 focus:border-black focus:ring-0 focus:outline-0"
        type="file"
        accept={allowedMimeTypes}
        onChange={handleChange}
        ref={uploadFileButtonRef}
      />

      {/* <input
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
        className="flex w-full items-center justify-center self-start rounded-lg border-2 border-emerald-500 p-2 text-center text-black outline-2 outline-transparent peer-disabled:pointer-events-none peer-disabled:cursor-default peer-disabled:opacity-50 hover:cursor-pointer hover:bg-emerald-500 focus:ring-0 focus:outline-black"
        htmlFor={id}
        tabIndex={0}
      >
        {text}
      </label> */}

      {fileErrors.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {fileErrors.map((fileError, index) => (
              <p key={index} className="text-rose-500">
                {fileError}
              </p>
            ))}
          </div>
          <Button
            color={BUTTON_COLOR.SOLID_RED}
            handleClick={() => setFileErrors([])}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

export default UploadFileButton;
