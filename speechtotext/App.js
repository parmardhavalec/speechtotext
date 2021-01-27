import React, {useEffect, useReducer, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Video from 'react-native-video';
import SpeechToText from 'react-native-google-speech-to-text';
import {reducer} from './src/reducers/Reducers';
import {ACTIONS} from './src/actions/Actions';
import {catList, dogList} from './src/assets/Lists';

const initialState = {
  Term: '',
  paused: false,
  loading: false,
  currentIndex: 0,
  videoList: [],
  timerTime: 0,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {Term, paused, loading, currentIndex, videoList, timerTime} = state;

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({type: ACTIONS.SET_TIMER_TIME, payload: null});
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timerTime + 1 >= 5 && videoList.length > 0) {
      setTimeout(() => {
        playNext();
      }, 1000);
    }
  }, [timerTime]);

  const speechToTextHandler = async () => {
    dispatch({type: ACTIONS.SET_TIMER_TIME, payload: 0});

    let speechToTextData = null;
    try {
      speechToTextData = await SpeechToText.startSpeech(
        'Try saying something',
        'en_IN',
      );
      console.log('speechToTextData: ', speechToTextData);
      if (speechToTextData.toLowerCase() == 'i want to see cats') {
        console.log('Setting cats');
        dispatch({type: ACTIONS.SET_PAUSE, payload: false});

        dispatch({type: ACTIONS.SET_TERM, payload: speechToTextData});
        dispatch({type: ACTIONS.SET_VIDEO_LIST, payload: catList});

        dispatch({type: ACTIONS.SET_CURRENT_INDEX, payload: 0});
      } else if (speechToTextData.toLowerCase() == 'show me dogs') {
        console.log('Setting dogs');
        dispatch({type: ACTIONS.SET_PAUSE, payload: false});
        dispatch({type: ACTIONS.SET_CURRENT_INDEX, payload: 0});

        dispatch({type: ACTIONS.SET_TERM, payload: speechToTextData});

        dispatch({type: ACTIONS.SET_VIDEO_LIST, payload: dogList});
      } else {
        alert(
          `speach didn't matched try speaking "Show me dogs" or "I want to see cats"`,
        );
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  function playNext() {
    dispatch({type: ACTIONS.SET_LOADING, payload: true});

    dispatch({type: ACTIONS.SET_PAUSE, payload: false});

    setTimeout(() => {
      if (currentIndex < videoList.length - 1) {
        dispatch({type: ACTIONS.SET_CURRENT_INDEX, payload: currentIndex + 1});
      } else {
        dispatch({type: ACTIONS.SET_CURRENT_INDEX, payload: 0});
      }
      dispatch({type: ACTIONS.SET_TIMER_TIME, payload: 0});
      dispatch({type: ACTIONS.SET_LOADING, payload: false});
    }, 2000);
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{flex: 1}}
      onPress={() => {
        dispatch({type: ACTIONS.SET_TIMER_TIME, payload: 0});
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#323F4E',
        }}>
        {/* <Text>{`idle time : ${timerTime}`}</Text> */}

        {Term.length > 0 && (
          <Text
            style={{
              alignContent: 'center',
              margin: 15,
              fontWeight: 'bold',
              fontSize: 18,
              color: 'white',
            }}>{`You Searched For :\n${Term}`}</Text>
        )}

        {loading ? (
          <View
            style={{
              alignSelf: 'stretch',
              height: 400,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              marginHorizontal: 10,
              borderRadius: 10,
            }}>
            <ActivityIndicator size="large" color="black" />
            <Text style={{}}>Loading..</Text>
          </View>
        ) : videoList.length > 0 ? (
          <View
            style={{
              alignSelf: 'stretch',
              backgroundColor: 'white',
              marginHorizontal: 10,
              paddingVertical: 20,
              borderRadius: 12,
            }}>
            <Video
              source={videoList[currentIndex]}
              onEnd={playNext}
              onLoad={() => {
                dispatch({type: ACTIONS.SET_TIMER_TIME, payload: 0});
              }}
              paused={paused}
              style={{
                alignSelf: 'stretch',
                height: 300,
                backgroundColor: 'black',
              }}
              resizeMode="contain"
            />
            <View
              style={{
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch({type: ACTIONS.SET_TIMER_TIME, payload: 0});

                  dispatch({type: ACTIONS.SET_PAUSE, payload: !paused});
                }}
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderColor: 'grey',
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text>{paused ? 'Play' : 'Pause'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              alignSelf: 'center',
              alignContent: 'center',
            }}>
            Search Some thing by clicking the button
          </Text>
        )}

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            alignItems: 'center',
            paddingVertical: 10,
            height: 100,
          }}>
          <TouchableOpacity
            onPress={speechToTextHandler}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              backgroundColor: '#F76A6A',
              borderColor: 'white',
              borderWidth: 3,
            }}></TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default App;
