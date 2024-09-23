import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post('image')
  async uploadImage(@UploadedFile() image: Express.Multer.File | null) {
    return this.uploadService.uploadImage(image);
  }
}
