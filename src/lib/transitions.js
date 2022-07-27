import React, { useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated'; 

export function FadeIn ({style, children, show=true, duration=800}) {
    const opacity = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: withTiming(opacity.value, { duration })
      };
    });

    useEffect(() => {
        opacity.value = show ? 1 : 0;
    }, [show])

    return (
        <Animated.View
            style={[{
                ...style
            }, animatedStyles]}
        >
            {children}
        </Animated.View>
    )
}

export function ZoomIn ({style, children, duration=500}) {
    const scale = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withTiming(scale.value, { duration }) }],
      };
    });

    useEffect(() => {
        scale.value = 1
    }, [])

    return (
        <Animated.View
            style={[{
                ...style
            }, animatedStyles]}
        >
            {children}
        </Animated.View>
    )
}

export function FlyIn ({style, children}) {
    const window = useWindowDimensions();
    const offset = useSharedValue(-window.width);
    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: withSpring(offset.value, { damping: 20, stiffness: 90 }) }],
      };
    });

    useEffect(() => {
        offset.value = 0
    }, [])

    return (
        <Animated.View
            style={[{
                ...style
            }, animatedStyles]}
        >
            {children}
        </Animated.View>
    )
}