import React, {useEffect, useState} from 'react';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {
  Alert,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

interface Props {
  title: string;
  imageStyle: object;
  onVerify: Function;
  getErrorStatus: any;
  cancelButtonText: string;
  image: ImageSourcePropType;
  allowDeviceCredentials: boolean;
}

const Biometric = (props: Props) => {
  const [success, setSuccess] = useState(false);
  const initialImageLink = {
    uri: 'https://cdn-icons-png.flaticon.com/512/25/25936.png',
  };
  const {
    onVerify,
    imageStyle,
    title = 'Sign in',
    image = initialImageLink,
    cancelButtonText = 'close',
    allowDeviceCredentials = false,
  } = props;

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: allowDeviceCredentials,
  });
  useEffect(() => {
    isSensorAvailable();
  }, []);

  /**
   * @description Handling error
   * @param code
   */
  const handleError = (code: string) => {
    switch (code) {
      case 'Too many attempts. Try again later.':
        Alert.alert('Too many attempts. Try again later');
        break;
      case 'Too many attempts. Fingerprint sensor disabled.':
        Alert.alert(
          'Too many attempts. Fingerprint sensor disabled please try later',
        );
        break;
      default:
        break;
    }
  };

  /**
   * @desc check type of biometric and prompt biometric
   */
  const isBiometricSupport = async () => {
    if (
      BiometryTypes.Biometrics ||
      BiometryTypes.FaceID ||
      BiometryTypes.TouchID
    ) {
      rnBiometrics
        .simplePrompt({
          promptMessage: title,
          fallbackPromptMessage: 'authencation fail',
          cancelButtonText: cancelButtonText,
        })
        .then(resultObject => {
          const {success, error} = resultObject;
          error
            ? onVerify({verified: success, error: error})
            : onVerify({verified: success});
          setSuccess(success);
        })
        .catch(err => handleError(err.code));
    }
  };
  /**
   * @desc check whether biometric is available on device
   */
  const isSensorAvailable = async () => {
    try {
      const {available} = await rnBiometrics.isSensorAvailable();
      if (available) {
        isBiometricSupport();
      }
    } catch (err) {
      onVerify({error: err});
      console.log('asas', err);
    }
  };

  return (
    <>
      {!success && (
        <TouchableOpacity onPress={isSensorAvailable} activeOpacity={0.8}>
          <Image source={image} style={[styles.imageStylee, imageStyle]} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default Biometric;

const styles = StyleSheet.create({
  imageStylee: {
    height: 100,
    width: 100,
  },
});
