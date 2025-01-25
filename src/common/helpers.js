function getMediaExtension(fileName) {
  const extension = fileName.split(".").pop();

  if (extension === "jpeg" || extension === "jpg" || extension === "png")
    return "IMAGE";
  if (extension === "mp4" || extension === "m4v" || extension === "mov")
    return "VIDEO";
}

function expectedUsernameFormat(username) {
  return /^[a-zA-Z0-9._]+$/.test(username);
}

function formatFileName(fileName) {
  const newFileName = fileName
    .split(".")
    .slice(0, -1)
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "");
  return newFileName;
}

function formatFileSizeAbbreviation(fileSize) {
  let abbreviation = "";

  if (fileSize > 0 && fileSize < 1000) {
    abbreviation = "B";
  } else if (fileSize >= 1000 && fileSize < 1000000) {
    abbreviation = "KB";
  } else if (fileSize >= 1000000 && fileSize < 1000000000) {
    abbreviation = "MB";
  } else if (fileSize >= 1000000000) {
    abbreviation = "GB";
  }

  return abbreviation;
}

function formatFileSize(fileSize) {
  let _fileSize = "";

  if (fileSize > 0 && fileSize < 1000) {
    const size = fileSize;
    _fileSize = (Math.round(size * 10) / 10).toFixed(1);
  } else if (fileSize >= 1000 && fileSize < 1000000) {
    const size = fileSize / 1000;
    _fileSize = (Math.round(size * 10) / 10).toFixed(1);
  } else if (fileSize >= 1000000 && fileSize < 1000000000) {
    const size = fileSize / 1000000;
    _fileSize = (Math.round(size * 10) / 10).toFixed(1);
  } else if (fileSize >= 1000000000) {
    const size = fileSize / 1000000000;
    _fileSize = (Math.round(size * 10) / 10).toFixed(1);
  }

  return _fileSize;
}

export {
  getMediaExtension,
  expectedUsernameFormat,
  formatFileName,
  formatFileSize,
  formatFileSizeAbbreviation,
};
