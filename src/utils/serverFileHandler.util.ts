

import { asyncForEach,   awsS3remover,
    awsS3uploader,
    localFileDelete, } from "./utilFunc.util";

export interface IServerFileUploaderReturn {
  success: boolean;
  storedFiles?: string[];
}

export const ServerFileUploader = async (
  img: any,
  deleteOld = true
): Promise<IServerFileUploaderReturn> => {
  try {
    console.log("calling from ServerFileUploader ");

    const storedFiles: string[] = [];

    // if (Array.isArray(img)) {
    //   await asyncForEach(img, async (file) => {
    //     const t = await awsS3uploader(file);
    //     storedFiles.push(`https://${t.Bucket}/${t.Key}`);
    //   });
    //   deleteOld ? localFileDelete(img) : "";
    // } else {
    //   const t = await awsS3uploader(img);
    //  storedFiles.push(`https://${t.Bucket}/${t.Key}`);
    //   deleteOld ? localFileDelete(img) : "";
    // }

    return { success: true, storedFiles };
  } catch (error) {
    console.log(error);
    console.log("calling from ServerFileUploader ");

    return { success: false, storedFiles: [] };
  }
};

export const ServerFileRemover = async (imgPath: string): Promise<any> => {
  console.log(imgPath);
  return awsS3remover(imgPath);
};
