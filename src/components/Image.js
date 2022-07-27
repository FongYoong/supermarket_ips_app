import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';

export const Image = createImageProgress(FastImage);
export const ProgressIndicator = Progress.Bar;
export const resizeModes = FastImage.resizeMode;