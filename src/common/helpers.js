function expectedUsernameFormat(username) {
  return /^[a-zA-Z0-9._]+$/.test(username);
}

function expectedPasswordFormat(password) {
  return (
    password.length >= 8 &&
    /\d/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password)
  );
}

function formatFileName(fileName) {
  const newFileName = fileName
    .split('.')
    .slice(0, -1)
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
  return newFileName;
}

function formatFileSizeAbbreviation(fileSize) {
  let abbreviation = '';

  if (fileSize > 0 && fileSize < 1000) {
    abbreviation = 'B';
  } else if (fileSize >= 1000 && fileSize < 1000000) {
    abbreviation = 'KB';
  } else if (fileSize >= 1000000 && fileSize < 1000000000) {
    abbreviation = 'MB';
  } else if (fileSize >= 1000000000) {
    abbreviation = 'GB';
  }

  return abbreviation;
}

function formatFileSize(fileSize) {
  let _fileSize = '';

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

function formatDate(date, showTime) {
  const _date = new Date(date);
  const dateTime = new Intl.DateTimeFormat('default', {
    hour: showTime ? 'numeric' : undefined,
    minute: showTime ? 'numeric' : undefined,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(_date);

  return dateTime;
}

function getIslamicDate(date, showTime) {
  const _date = new Date(date);
  const dateTime = new Intl.DateTimeFormat('en-u-ca-islamic-nu-latn', {
    hour: showTime ? 'numeric' : undefined,
    minute: showTime ? 'numeric' : undefined,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(_date);

  return dateTime;
}

function formatDuration(seconds) {
  // note: this assumes videos are maximum 24 hours long

  let iso;

  const tenMinuteInSeconds = 600;
  const oneHourInSeconds = 3600;
  const tenHoursInSeconds = 36000;

  if (seconds < tenMinuteInSeconds) {
    iso = new Date(seconds * 1000).toISOString().substring(15, 19);
  } else if (seconds < oneHourInSeconds) {
    iso = new Date(seconds * 1000).toISOString().substring(14, 19);
  } else if (seconds < tenHoursInSeconds) {
    iso = new Date(seconds * 1000).toISOString().substring(12, 19);
  } else {
    iso = new Date(seconds * 1000).toISOString().substring(11, 19);
  }
  return iso;
}

function formatCount(count) {
  let countFormatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  const _count = countFormatter.format(count);
  return _count;
}

function getHighlightText(mainText, subText) {
  const lowercaseText = mainText.toLowerCase();
  const lowerCaseSearchTerm = subText.toLowerCase();

  const highlightText = lowercaseText.replaceAll(
    lowerCaseSearchTerm,
    `<span className="bg-sky-500 text-black rounded-lg p-1">${lowerCaseSearchTerm}</span>`
  );

  return highlightText;
}

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

function getTodayAndLastWeekDateISO() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  let lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);

  today = today.toISOString();
  lastWeek = lastWeek.toISOString();

  return {
    today,
    lastWeek,
  };
}

function getSessionStorageData(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

function setSessionStorageData(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export {
  expectedUsernameFormat,
  expectedPasswordFormat,
  formatFileName,
  formatFileSize,
  formatFileSizeAbbreviation,
  formatDate,
  getIslamicDate,
  formatDuration,
  formatCount,
  getHighlightText,
  handleFileAdded,
  getTodayAndLastWeekDateISO,
  getSessionStorageData,
  setSessionStorageData,
};
