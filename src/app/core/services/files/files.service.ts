// import { Injectable } from '@angular/core';
// import * as mime from 'mime';
// import { FileToUpload, SelectFilesTypes, SelectFilesTypesEnum, DEFAULT_MULTIPLE_PICTURES_LIMIT, SelectFilesActions } from './files.type';
// import { CameraService } from '../camera/camera.service';
// import { ActionSheetButton } from '@ionic/angular';

// @Injectable({
//   providedIn: 'root'
// })
// export class FilesService {
//   constructor(
//     private readonly cameraService: CameraService,
//   ) { }

//   public async selectFiles(allowedFilesTypes?: SelectFilesTypesEnum[], limit?: number): Promise<FileToUpload[] | undefined> {

//     allowedFilesTypes = allowedFilesTypes || [
//       SelectFilesTypesEnum.TAKE_PICTURE,
//       SelectFilesTypesEnum.TAKE_MULTIPLE_PICTURES,
//       SelectFilesTypesEnum.SELECT_PICTURE_FROM_GALLERY,
//       SelectFilesTypesEnum.TAKE_VIDEO,
//       SelectFilesTypesEnum.SELECT_VIDEO_FROM_GALLERY
//     ];

//     const actions: SelectFilesActions = {
//       'take-picture': this.takePicture,
//       'take-multiple-pictures':  this.takeMultiplePicures,
//       'select-picture-from-gallery': () => this.selectPictureFromGallery(limit),
//       'take-video': this.takeVideo,
//       'select-video-from-gallery': this.selectVideoFromGallery,
//       'select-file-from-gallery': this.selectFileFromGallery
//     };

//     const buttons: ActionSheetButton[] = [];

//     for (const allowedFilesType of allowedFilesTypes) {
//       buttons.push(SelectFilesTypes[allowedFilesType]);
//     }

//     if (buttons.length === 1) {
//       const button = buttons[0];
//       return actions[button?.data?.action]();
//     }

//     buttons.push({
//       text: 'Fechar',
//       role: 'cancel',
//       icon: 'close-outline'
//     });

//     const actionSheet = await this.actionSheetService.show({
//       buttons
//     });

//     const result = await actionSheet?.onDidDismiss();
//     if (result?.role !== 'success') { return; }

//     return actions[result?.data?.action]();
//   }

//   private takePicture = async (): Promise<FileToUpload[] | undefined> => {
//     const image = await this.cameraService.takePicture();
//     if (!image?.path) { return; }

//     const contents = await Filesystem.readFile({
//       path: image.path
//     });

//     const stat = await Filesystem.stat({
//       path: image.path
//     });

//     const mimeType = mime.getType(image.path) || 'application/file';

//     return [{
//       path: image.path,
//       base64: `data:${mimeType};base64,${contents.data}`,
//       size: stat.size,
//       mimeType,
//       loadingMessage: 'Fazendo upload da imagem...'
//     }];
//   };

//   private takeMultiplePicures = async (): Promise<FileToUpload[] | undefined> => {
//     const maxPictures = 5;
//     let images: FileToUpload[] = [];

//     do {
//       const image = await this.takePicture();
//       if (!image) { break; }

//       images = [...images, ...image];
//     } while (images.length < maxPictures);

//     return images;
//   };

//   private selectPictureFromGallery = async (limit?: number): Promise<FileToUpload[] | undefined> => {
//     const result = await this.pickerService.pickPictures(limit || DEFAULT_MULTIPLE_PICTURES_LIMIT);
//     if (!result?.photos?.length) { return; }

//     const images: FileToUpload[] = [];

//     for (const photo of result.photos) {
//       if (!photo.path) { continue; }

//       const contents = await Filesystem.readFile({
//         path: photo.path
//       });

//       const stat = await Filesystem.stat({
//         path: photo.path
//       });

//       const mimeType = mime.getType(photo.path) || 'application/file';

//       images.push({
//         path: photo.path,
//         base64: `data:${mimeType};base64,${contents.data}`,
//         size: stat.size,
//         mimeType,
//         loadingMessage: 'Fazendo upload da imagem...'
//       });
//     }

//     return images;
//   };


//   private selectVideoFromGallery = async (): Promise<FileToUpload[] | undefined> => {
//     const result = await this.pickerService.pickVideo();
//     if (!result) { return; }

//     const { video, thumbnail } = result;

//     const videoStats = await Filesystem.stat({
//       path: video.path
//     });

//     if (videoStats.size > 6291456) {
//       await this.alertService.show({ message: 'Somente vídeos com menos de 6mb são permitidos' });
//       return;
//     }

//     const videoContents = await Filesystem.readFile({
//       path: video.path
//     });

//     const thumnailContents = await Filesystem.readFile({
//       path: thumbnail.path
//     });

//     const id = uuid.v4();

//     const thumbnailMimeType = mime.getType(thumbnail.path) || 'application/file';
//     const videoMimeType = mime.getType(video.path) || 'application/file';

//     return [
//       {
//         id: id,
//         path: thumbnail.path,
//         base64: `data:${thumbnailMimeType};base64,${thumnailContents.data}`,
//         size: thumbnail.size,
//         mimeType: thumbnailMimeType,
//         loadingMessage: 'Fazendo upload da thumbnail do video...',
//         isThumbnail: true
//       },
//       {
//         id: id,
//         path: video.path,
//         base64: `data:${videoMimeType};base64,${videoContents.data}`,
//         size: videoStats.size,
//         mimeType: videoMimeType,
//         loadingMessage: 'Fazendo upload do video...'
//       }
//     ];
//   };

//   private async optimizeVideo (filePath: string, fileName: string): Promise<string | null> {
//     try {
//       const loading = await this.loadingService.show({ message: 'Otimizando video... 0%' });

//       const editResult = await this.videoEditor.transcodeVideo({
//         fileUri: filePath,
//         outputFileName: fileName,
//         outputFileType: 1,
//         optimizeForNetworkUse: 1,
//         width: 640,
//         height: 640,
//         audioSampleRate: 44100,
//         videoBitrate: 500000,
//         fps: 24,
//         progress: async (info) => {
//           if (!loading) { return; }

//           loading.message = `Otimizando video... ${(info * 100).toFixed(2)}%`;
//         }
//       });

//       await this.loadingService.dismiss();

//       if (!editResult) { return null; }

//       return editResult.includes('file://') ? editResult : 'file://' + editResult;
//     } catch (err) {
//       await this.loadingService.dismiss();
//       this.errorHandlerService.handleError(err, 'Um erro aconteceu ao otimizar o video!');
//       return null;
//     }
//   }

//   private selectFileFromGallery = async (): Promise<FileToUpload[] | undefined> => {
//     const file = await this.pickerService.pickFile();
//     if (!file?.path) { return; }

//     const contents = await Filesystem.readFile({
//       path: file.path
//     });

//     const stat = await Filesystem.stat({
//       path: file.path
//     });

//     const mimeType = mime.getType(file.path) || 'application/file';

//     const fileToUpload: FileToUpload = {
//       path: file.path,
//       base64: `data:${mimeType};base64,${contents.data}`,
//       size: stat.size,
//       mimeType,
//       loadingMessage: 'Fazendo upload da imagem...'
//     };

//     return [fileToUpload];
//   };

//   private async canShowType(filesType: SelectFilesTypesEnum, configurations: Configurations): Promise<boolean> {
//     const isConnected = await this.networkService.isConnected();
//     if (filesType === SelectFilesTypesEnum.SELECT_PICTURE_FROM_GALLERY && !configurations.canSelectFileFromGallery) {
//       return false;
//     }

//     if (filesType === SelectFilesTypesEnum.SELECT_VIDEO_FROM_GALLERY && !configurations.canSelectFileFromGallery) {
//       return false;
//     }

//     if (filesType === SelectFilesTypesEnum.SELECT_VIDEO_FROM_GALLERY && !configurations.canShowVideos) {
//       return false;
//     }

//     if (filesType === SelectFilesTypesEnum.TAKE_VIDEO && !configurations.canShowVideos) {
//       return false;
//     }

//     if (filesType === SelectFilesTypesEnum.TAKE_VIDEO && !isConnected) {
//       return false;
//     }

//     if (filesType === SelectFilesTypesEnum.SELECT_VIDEO_FROM_GALLERY && !isConnected) {
//       return false;
//     }

//     return true;
//   }
// }
