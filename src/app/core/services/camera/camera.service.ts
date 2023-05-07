import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  public async takePicture(): Promise<Photo | null> {
    if (!Capacitor.isNativePlatform()) {
      return null;
    }

    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        allowEditing: false,
        quality: 100,
        height: 640,
        width: 480,
        saveToGallery: true,
        correctOrientation: true,
        promptLabelCancel: 'Cancelar',
        promptLabelHeader: 'Tirar foto',
        source: CameraSource.Camera
      });

      return image;
    } catch(err: any) {
      if (err.message === 'User cancelled photos app') {
        return null;
      }

      console.error(err);
      return null;
    }
  }
}
