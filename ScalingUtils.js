import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 411;
const guidelineBaseHeight = 683;

const scale = size => (width > guidelineBaseWidth) ? Math.round(size) : Math.round(width / guidelineBaseWidth * size);
const verticalScale = size => (height > guidelineBaseHeight) ? Math.round(size) : Math.round(height / guidelineBaseHeight * size);
const moderateScale = (size, factor = 0.5) =>
    Math.round(size + (scale(size) - size) * factor);

export { scale, verticalScale, moderateScale };