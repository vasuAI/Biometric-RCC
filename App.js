import React, {useState} from 'react';
import {Text, View} from 'react-native';
import Biometric from './Biometric';

export default App = () => {
  const [success, setSuccess] = useState(false);

  return (
    <View style={{alignItems: 'center', marginTop: 200}}>
      <Biometric
        image={require('./fingerPrint.png')}
        title="Sign in with Touch ID"
        cancelButtonText="Close"
        onVerify={res => {
          setSuccess(res.verified);
        }}
        imageStyle={{height: 120}}
        allowDeviceCredentials={false}
      />
      {success ? (
        <View>
          <Text>Login Successfull</Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};
