const crypto = require("crypto");

const secretKey = process.env.DECRYPT_PASSWORD_SECRETKEY;
const iv = process.env.DECRYPT_IV;

async function decryptPassword(encryptedPassword) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey, "utf-8"), Buffer.from(iv, "utf-8"));

    let decrypted = decipher.update(Buffer.from(encryptedPassword, "base64"), "binary", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

module.exports = decryptPassword;
