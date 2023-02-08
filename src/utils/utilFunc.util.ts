import { BadRequestException } from "@nestjs/common";
import * as AWS from "aws-sdk";
import * as FS from "fs";
import { diskStorage } from "multer";
import * as path from "path";
// import { slug } from "slug";
import * as slugify from "slugify";
import { ENV } from "src/ENV";

export const imgSetting = {
  schema: {
    type: "object",
    properties: {
      image: {
        type: "string",
        format: "binary",
      },
      name: {
        type: "string",
      },
    },
  },
};

export const awsS3uploader = (file) => {
  AWS.config.update({
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    region: ENV.AWS_REGION,
    signatureVersion: "v4",
  });

  const s3 = new AWS.S3({ signatureVersion: "v4" });

  return s3
    .upload({
      ACL: "public-read",
      Bucket: ENV.AWS_BUCKET_NAME,
      Body: FS.createReadStream(file.path),
      Key: `images/${generateFilename(file)}`,
      ContentType: file.mimetype,
    })
    .promise();
}; 

export const awsS3remover = (imgPath: string) =>
  new Promise(async (resolve, reject) => {
    const s3 = new AWS.S3({ signatureVersion: "v4" });
    s3.createBucket(
      {
        Bucket: ENV.AWS_BUCKET_NAME,
      },
      () => {
        const params = {
          Bucket: ENV.AWS_BUCKET_NAME,
          Key: imgPath.split(ENV.AWS_PREFIX_URL).pop(),
        };

        s3.deleteObject(params, (err, data) => {
          if (err) console.log(err);
          else console.log("Successfully deleted file from bucket");
          return data;
        });
      }
    );
  });

export const localFileDelete = async (files) => {
  if (!files) return;
  setTimeout(async () => {
    try {
      if (Array.isArray(files)) {
        if (files.length == 1) {
          FS.unlinkSync(files[0].path);
        } else {
          await asyncForEach(files, async (file) => {
            FS.unlinkSync(file.path);
          });
        }
      } else {
        FS.unlinkSync(files.path);
      }
    } catch (err) {
      console.error(err);
    }
  }, 100);
};

export const asyncForEach = async (array: any[], callback: any) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const objectSize = async (obj) => {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

export const fixNullPrototype = async (data: any) => {
  // fixes the issue of [Object: null prototype]{}
  return JSON.parse(JSON.stringify(data));
};

export const storageOptions = diskStorage({
  destination: (req, file, cb) => {
    cb(null, ENV.IMAGE_LOCAL_PATH);
  },
  // destination: "./uploads",
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

export const generateFilename = (file, prefix = "CrudImage-") => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

  return `${prefix + uniqueSuffix + path.extname(file.originalname)}`;
};

export function toNumber(value: string): number {
  return parseInt(value, 10);
}

export function isEmptyObject(obj): boolean {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

export function resetValuesToZero (obj) { 
  Object.keys(obj).forEach(function (key) {
      if (typeof obj[key] === 'object') {
          return resetValuesToZero(obj[key]);
      }
      obj[key] = 0;
  });
  return obj;
}

export function toBool(value: string): boolean {
  return value === "true";
}

export function genHexNumber() {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return n.slice(0, 10).toUpperCase();
}

export const gen6digitOTP=()=> { 
  return Math.floor(100000 + Math.random() * 900000);
}

export function RsSlugify(name) {
  return slugify.default(name);
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function QueryErrorHandle(err: any) {
  let message: string;
  let error: string;
  console.log(err.code);

  if (err.code == "23505") {
    message = "Name Must Be Unique!";
    error = "This Name Already Exists";
  } else if (err.code == "22P02") {
    message = "Invalid uuid !";
    error = "This id is Wrong";
  } else if (err.code == "23503") {
    message = "Wrong Foreign Key";
    error = "Foreign Key Doesn't exist";
  } else {
    message = "Operation Failed!";
    error = err;
  }
  throw new BadRequestException(message, error);
}

export function timeFormatter(date:Date) {
  var hr = date.getHours();
var min: any = date.getMinutes();
if (min < 10) {
    min = "0" + min;
}
var ampm = "am";
if( hr > 12 ) {
    hr -= 12;
    ampm = "pm";
}
return hr + ':' + min + ampm ; 
}
