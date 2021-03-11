import { request } from "../utils/axios";
// import { uploadTypeName } from '@/utils/const'

/**
 * 附件上传接口
 * @param {*} files
 */
export const fileLoad = files => {
  let formData = new FormData();
  // formData.append('userid', '0259422363690630')
  // formData.append('tablename', uploadTypeName)

  // 多个文件上传
  for (let i = 0; i < files.length; i++) {
    formData.append("file", files[i].file);
  }

  const config = {
    params: {
      type: "upload"
    },
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };

  return request.post("/attachment/dingTalk/upload", formData, config);
};
