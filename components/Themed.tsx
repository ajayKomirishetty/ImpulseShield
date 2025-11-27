/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '@/constants/colors';
import { useColorScheme } from './useColorScheme';

// Define a type for valid color keys
type ColorName = 'text' | 'background' | keyof typeof Colors.primaryLight | keyof typeof Colors.primaryDark;

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme === 'light'
      ? Colors.primaryLight[colorName as keyof typeof Colors.primaryLight]
      : Colors.primaryDark[colorName as keyof typeof Colors.primaryDark];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = String(useThemeColor({ light: lightColor, dark: darkColor }, 'text'));

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = String(useThemeColor({ light: lightColor, dark: darkColor }, 'background'));

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
