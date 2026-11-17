import ImageCropPicker from 'react-native-image-crop-picker';

const formatItem = (item) => ({
  path: item.path,
  realPath: item.path,
  fileName: item.filename || (item.path ? item.path.split('/').pop() : `media_${Date.now()}`),
  size: item.size || 0,
  mime: item.mime,
  type: item.mime,
  width: item.width,
  height: item.height,
});

const MultipleImagePicker = {
  openPicker: async (options = {}) => {
    const isMultiple = options.singleSelectedMode === false;
    const mediaType =
      options.mediaType === 'video'
        ? 'video'
        : options.mediaType === 'all'
        ? 'any'
        : 'photo';

    const result = await ImageCropPicker.openPicker({
      multiple: isMultiple,
      mediaType: mediaType,
      cropping: options.isCrop ?? false,
      cropperCircleOverlay: options.isCropCircle ?? false,
      maxFiles: options.maxSelectedAssets || 5,
    });

    if (Array.isArray(result)) {
      return result.map(formatItem);
    }
    return formatItem(result);
  },
};

export const openPicker = MultipleImagePicker.openPicker;
export default MultipleImagePicker;
