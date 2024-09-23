import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UploadService {
  constructor(private readonly firebaseService: FirebaseService) {}
  async uploadImage(image: Express.Multer.File) {
    const imageUrl = await this.firebaseService.uploadFile(image);
    return { path: imageUrl }
  }
}
