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
        resultType: CameraResultType.Uri, // tipo de retorno da foto
        allowEditing: false, // permite editar a foto
        quality: 100, // qualidade da foto
        height: 640, // altura da foto
        width: 480, // largura da foto
        saveToGallery: true, // salva a foto na galeria
        correctOrientation: true, // corrige a orientação da foto
        promptLabelCancel: 'Cancelar', // texto do botão de cancelar
        promptLabelHeader: 'Tirar foto', // texto do cabeçalho
        source: CameraSource.Camera // fonte da foto
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
