import { StyleSheet, Text, View , Animated} from 'react-native';
import React, {useEffect, useRef, useState} from "react";
import Svg, {G, Circle} from 'react-native-svg';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DonutChart({
  percentage = 75,
  radius = 40,
  strokeWidth = 10,
  duration = 500,
  color = '#e60038',
  delay = 0,
  textcolor,
  max = 1000,
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleCircumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const [strokeDashoffset, setStrokeDashoffset] = useState(circleCircumference);

  const animation = (toValue) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animation(percentage);

    const listener = animatedValue.addListener((v) => {
      const maxPerc = (100 * v.value) / max;
      const offset = circleCircumference - (circleCircumference * maxPerc) / 100;
      setStrokeDashoffset(offset);
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [percentage]);

  return (
    <View style={styles.container}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={0.2}
            fill="transparent"
          />

          <AnimatedCircle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <Text style={[styles.scoreText, { color: textcolor || color }]}>
        {`${percentage}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  scoreText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'normal',
  },
});