import { Injectable } from '@nestjs/common';

@Injectable()
export class LibraryService {
  findAll() {
    return `This action returns all library`;
  }
}
