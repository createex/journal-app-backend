const util = require("util");
const fs = require("fs");
const unlinkFile = util.promisify(fs.unlink);
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const accountName = "myjournalstorage";
const containerName = "uploads";
const accountKey =
  "iSyv23U5Ims5WNL2ZfjSZGiIJSJKlncj2WxJ+TEOqirgyCubkhtsDwmq4av/Ws5mBytqkcE5pa5m+AStvEhXkw==";

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

const uploadImage = async (imagePath, blobName) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const imageStream = fs.createReadStream(imagePath);
    const imageStats = fs.statSync(imagePath);
    await blockBlobClient.uploadStream(imageStream, imageStats.size, 5);
    await unlinkFile(imagePath);
    return `${containerName}/${blobName}`;
  } catch (error) {
    await unlinkFile(imagePath);
    return "";
  }
};

module.exports = {
  uploadImage,
};
