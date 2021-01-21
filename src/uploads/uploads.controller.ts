import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
    try {
      //  주의! 딱 한번만 bucket을 생성하면 됩니다.
      //   const upload = await new AWS.S3()
      //     .createBucket({ Bucket: 'chyonichobereats' })
      //     .promise();
      const objectName = Date.now() + file.originalname;
      const BUCKET_NAME = process.env.BUCKET_NAME_ENV;
      await new AWS.S3()
        .putObject({
          Bucket: BUCKET_NAME,
          Body: file.buffer,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
