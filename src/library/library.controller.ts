import { Controller, Get } from '@nestjs/common';
import { LibraryService } from './library.service';
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  findAll() {
    return this.libraryService.findAll();
  }
}
