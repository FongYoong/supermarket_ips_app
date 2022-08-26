import React from "react";
import { Icon } from "@ui-kitten/components";

export const InfoIcon = (props) =>  <Icon {...props} name="info-outline" />;

export const SettingsIcon = (props) =>  <Icon {...props} name="settings" />;

export const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

export const NavigationBackIcon = (props) => <Icon {...props} style={[props.style, { width: 32, height: 32 }]}  name="arrow-back-outline" />;

export const CloseIcon = (props) =>  <Icon {...props} name="close-outline" />;

export const BluetoothIcon = (props) =>  <Icon {...props} name="bluetooth-outline" />;

export const LocationIcon = (props) =>  <Icon {...props} name="navigation-2-outline" />;

export const RecenterLocationIcon = (props) =>  <Icon {...props} name="compass-outline" />;

export const ScanQRIcon = (props) => <Icon {...props} name="camera-outline" />;

export const GitHubIcon = (props) => <Icon {...props} name="github-outline" />;
