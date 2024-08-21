const util = require("util");
const fs = require("fs");
const unlinkFile = util.promisify(fs.unlink);
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const accountName = "myjournalstorage";
const containerName = "notes";
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

const uploadNote = async (filePath, blobName) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const fileStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);
    await blockBlobClient.uploadStream(fileStream, fileStats.size, 5);
    await unlinkFile(filePath);
    return `${containerName}/${blobName}`;
  } catch (error) {
    await unlinkFile(filePath);
    return "";
  }
};

module.exports = {
  uploadNote,
};
