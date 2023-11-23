import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CanvasComponent from './components/CanvasComponent';

import tw from 'twrnc'

export default function App() {
  return (
    <View style={tw`bg-black mt-8 h-24 absolute`}>
      <Text style={tw`text-white text-center my-6`}>INsight</Text>
        <CanvasComponent/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
