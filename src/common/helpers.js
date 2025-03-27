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

function getDate(date, showTime) {
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

export {
  expectedUsernameFormat,
  expectedPasswordFormat,
  formatFileName,
  formatFileSize,
  formatFileSizeAbbreviation,
  getDate,
  getIslamicDate,
  formatDuration,
  formatCount,
  getHighlightText,
};
