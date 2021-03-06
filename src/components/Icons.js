import React from "react";
import { Icon } from "@ui-kitten/components";

export const SettingsIcon = (props) =>  <Icon {...props} name="settings" />;

export const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

export const NavigationBackIcon = (props) => <Icon {...props} style={[props.style, { width: 32, height: 32 }]}  name="arrow-back-outline" />;

export const CloseIcon = (props) =>  <Icon {...props} name="close-outline" />;

export const BluetoothIcon = (props) =>  <Icon {...props} name="bluetooth-outline" />;

export const LocationIcon = (props) =>  <Icon {...props} name="navigation-2-outline" />;

export const ScanQRIcon = (props) => <Icon {...props} name="camera-outline" />;