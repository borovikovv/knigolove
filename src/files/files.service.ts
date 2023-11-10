import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  splitFileName(name: string) {
    return name.split('.').at(1);
  }

  splitFileExtension(ext: string) {
    return ext.split('/').at(1);
  }

  create() {
    return '';
  }
}
