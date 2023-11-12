import React, { useState,useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Image } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import tw from 'twrnc'
import axios from 'axios';


const { height, width } = Dimensions.get('window');

export default () => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isClearButtonClicked, setClearButtonClicked] = useState(false);

  const [snapshotImg, setSnapshotImg] = useState()

  const viewToSnapshotRef = useRef();
  const snapshotBottom = useRef()
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const onTouchEnd = async () => {
    paths.push(currentPath);
    setCurrentPath([]);
    setClearButtonClicked(false);
    snapshot()
    await delay(10000)
    handleClearButtonClick()
    
  };

  const onTouchMove = (event) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const handleClearButtonClick = () => {
    setPaths([]);
    setCurrentPath([]);
    setClearButtonClicked(true);
  };

  const snapshot = async() => {

    const result = await captureRef(viewToSnapshotRef, { result:'data-uri'})
    setSnapshotImg(result)
    console.log(snapshotImg)
    // fetch('http://127.0.0.1:5000/predict', {
    // method: 'POST',
    // headers: {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    // },
    // body: JSON.stringify({
    //   imguri: snapshotImg
    // }),
    // });
    axios.post('http://10.0.2.2/predict', {
      imguri: snapshotImg,
    })
      .then(response => {
        console.log('Image uploaded successfully');
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  }
  return (
    <View style={tw`flex justify-center items-center mt-[18rem]`}>
      <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} ref={viewToSnapshotRef}>
        <Svg height={height * 0.4} width={width}>
          <Path
            d={paths.join('')}
            stroke={isClearButtonClicked ? 'transparent' : 'black'}
            fill={'transparent'}
            strokeWidth={10}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
          />
          {paths.length > 0 &&
            paths.map((item, index) => (
              <Path
                key={`path-${index}`}
                d={currentPath.join('')}
                stroke={isClearButtonClicked ? 'transparent' : 'black'}
                fill={'transparent'}
                strokeWidth={2}
                strokeLinejoin={'round'}
                strokeLinecap={'round'}
              />
            ))}
        </Svg>
      </View>
      {snapshotImg && <Image resizeMode='contain' style={tw`h-24 w-full`} source={{uri: snapshotImg}} ref={snapshotBottom}></Image>}
      {/* <TouchableOpacity style={tw`mt-4 bg-black py-4 px-10 border border-4`} onPress={handleClearButtonClick}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    height: height * 0.4,
    width,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});