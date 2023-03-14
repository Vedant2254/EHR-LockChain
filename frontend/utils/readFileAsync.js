function readAsDataURLAsync(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => resolve(reader.result);
  });
}

function readAsTextAsync(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => resolve(reader.result);
  });
}

module.exports = { readAsDataURLAsync, readAsTextAsync };
