import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicFile } from './files.entity';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';
import { type Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private configService: ConfigService,
  ) {}

  async uploadPublicFiles(fileName: string, file: Buffer) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Body: file,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }
}
