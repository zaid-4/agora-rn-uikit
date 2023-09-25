import React, {useContext, useState, useEffect} from 'react';
import {RenderModeType, RtcSurfaceView} from 'react-native-agora';
import styles from '../Style';
import PropsContext, {UidInterface} from '../Contexts/PropsContext';
import {StyleSheet, View, Text} from 'react-native';
import ImageIcon from '../Controls/ImageIcon';
import Username from './Usernames';

// const LocalView = RtcLocalView.SurfaceView;
// const RemoteView = RtcRemoteView.SurfaceView;

interface MaxViewInterface {
  user: UidInterface;
  fallback?: React.ComponentType;
}
/**
 * MaxVideoView takes in a user and renders the video
 */
const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {maxViewStyles} = styleProps || {};
  const Fallback = props.fallback;

  return (
    <React.Fragment>
      {!rtcProps.disableRtm && <Username user={props.user} />}
      {props.user.uid === 'local' ? (
        props.user.video ? (
          <RtcSurfaceView
            style={{...styles.fullView, ...(maxViewStyles as object)}}
            canvas={{renderMode: RenderModeType.RenderModeFit, uid: 0}}
          />
        ) : Fallback ? (
          <Fallback />
        ) : (
          <DefaultFallback user={props.user} />
        )
      ) : props.user.video ? (
        <>
          <RtcSurfaceView
            style={{...styles.fullView, ...(maxViewStyles as object)}}
            canvas={{
              renderMode: RenderModeType.RenderModeFit,
              uid: props.user.uid as number,
            }}
          />
        </>
      ) : Fallback ? (
        <Fallback />
      ) : (
        <DefaultFallback user={props.user} />
      )}
    </React.Fragment>
  );
};

const DefaultFallback: React.FC<{user: UidInterface}> = (props) => {
  const { styleProps, rtcProps } = useContext(PropsContext);
  const [callDuration, setCallDuration] = useState<number>(0);
  const { videoPlaceholderContainer } = styleProps || {};
  const {user} = props;

  const formatCallDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timerInterval;

    // Start the timer when the component mounts (call starts)
    const startCall = () => {
      timerInterval = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    };

    // Example: Start the call (you can trigger this function when the call starts)
    startCall();

    // Clean up the timer when the component unmounts (call ends)
    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <View style={[style.placeholderContainer, videoPlaceholderContainer]}>
      {!rtcProps?.disableVideo ?
        <ImageIcon
          name={'videocamOff'}
          style={[styles.placeholderIcon, styleProps?.videoPlaceholderIcon]}
        /> :
        (<>
          <Text style={[styles.placeholderText, styleProps?.videoPlaceholderIcon]}>
            {rtcProps?.callReciever}
          </Text>
          {user.uid === 'local' ?
            <Text style={[styles.callStatusText]}>Connecting ...</Text>
            :
            <Text style={[styles.callStatusText]}>
              Call Duration: {formatCallDuration(callDuration)}
            </Text>
          }
        </>)
      }
    </View>
  );
};

const style = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
});

export default MaxVideoView;
