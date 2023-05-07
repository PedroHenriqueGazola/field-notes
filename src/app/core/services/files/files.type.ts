export interface FileToUpload {
  id?: string;
  path?: string;
  base64: string;
  blob?: Blob;
  size: number;
  mimeType: string;
  isThumbnail?: boolean;
  loadingMessage?: string;
}

export enum SelectFilesTypesEnum {
  TAKE_PICTURE = 'take-picture',
  TAKE_MULTIPLE_PICTURES = 'take-multiple-pictures',
  SELECT_PICTURE_FROM_GALLERY = 'select-picture-from-gallery',
  TAKE_VIDEO = 'take-video',
  SELECT_VIDEO_FROM_GALLERY = 'select-video-from-gallery',
  SELECT_FILE_FROM_GALLERY = 'select-file-from-gallery'
}

export type SelectFilesActions = { [key: string]: () => Promise<FileToUpload[] | undefined> }

export const DEFAULT_MULTIPLE_PICTURES_LIMIT = 5;

export const SelectFilesTypes = {
  [SelectFilesTypesEnum.TAKE_PICTURE]: {
    text: 'Tirar foto',
    role: 'success',
    icon: 'camera-outline',
    data: { action: SelectFilesTypesEnum.TAKE_PICTURE }
  },
  [SelectFilesTypesEnum.TAKE_MULTIPLE_PICTURES]: {
    text: 'Tirar várias fotos',
    role: 'success',
    icon: 'camera-reverse-outline',
    data: { action: SelectFilesTypesEnum.TAKE_MULTIPLE_PICTURES }
  },
  [SelectFilesTypesEnum.SELECT_PICTURE_FROM_GALLERY]: {
    text: 'Selecionar imagens',
    role: 'success',
    icon: 'images-outline',
    data: { action: 'select-picture-from-gallery' }
  },
  [SelectFilesTypesEnum.TAKE_VIDEO]: {
    text: 'Gravar vídeo',
    role: 'success',
    icon: 'videocam-outline',
    data: { action: SelectFilesTypesEnum.TAKE_VIDEO }
  },
  [SelectFilesTypesEnum.SELECT_VIDEO_FROM_GALLERY]: {
    text: 'Selecionar vídeo',
    role: 'success',
    icon: 'folder-open-outline',
    data: { action: SelectFilesTypesEnum.SELECT_VIDEO_FROM_GALLERY }
  },
  [SelectFilesTypesEnum.SELECT_FILE_FROM_GALLERY]: {
    text: 'Selecionar arquivo',
    role: 'success',
    icon: 'document-outline',
    data: { action: SelectFilesTypesEnum.SELECT_FILE_FROM_GALLERY }
  }
};
