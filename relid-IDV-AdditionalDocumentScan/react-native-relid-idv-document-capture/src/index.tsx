import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-relid-idv-document-capture' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RelidIdvDocumentCapture = NativeModules.RelidIdvDocumentCapture
  ? NativeModules.RelidIdvDocumentCapture
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return RelidIdvDocumentCapture.multiply(a, b);
}
