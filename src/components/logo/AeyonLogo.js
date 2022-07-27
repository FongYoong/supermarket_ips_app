import * as React from "react"
import Svg, { Defs, ClipPath, Path, Text, TSpan, G } from "react-native-svg"

const AeyonLogo = (props) => (
  <Svg
    width={130.42}
    height={151.31}
    viewBox="0 0 150 150"
    preserveAspectRatio="xMinYMin slice" 
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Defs>
      <ClipPath id="a">
        <Path d="M0 500h500V0H0z" />
      </ClipPath>
    </Defs>
    <Text
      transform="matrix(1.3041 0 0 1.3632 -421.03 569.88)"
      x={340.254}
      y={-311.509}
      fill="#27af4b"
      fontFamily="'Montserrat SemiBold'"
      fontSize={23.595}
      fontStyle="italic"
      fontWeight={600}
      strokeWidth={0.978}
    >
      <TSpan x={340.254} y={-311.509}>
        {"Ae"}
      </TSpan>
    </Text>
    <Text
      transform="matrix(1.3041 0 0 1.3632 -421.03 569.88)"
      x={370.795}
      y={-312.151}
      fill="#113f59"
      fontFamily="Montserrat"
      fontSize={23.595}
      fontStyle="italic"
      fontWeight="bold"
      strokeWidth={0.978}
    >
      <TSpan x={370.795} y={-312.151}>
        {"yon"}
      </TSpan>
    </Text>
    <G clipPath="url(#a)" transform="matrix(1.3333 0 0 -1.3333 -421.03 569.88)">
      <Path
        d="M323.21 418.3h11.855a.04.04 0 0 0 .041-.037l2.367-21.884 8.127 9.586-2.315 21.409a.042.042 0 0 1-.041.037h-27.429a.042.042 0 0 1-.032-.068l7.395-9.028a.04.04 0 0 1 .032-.015M384.07 409.43h-11.496v-9.099c1.192-.007 7.783-.012 7.794-.012h4.297c7.915 0 14.312-6.624 13.939-14.619-.351-7.518-6.855-13.289-14.382-13.289h-23.787l-6.963-7.981a21.35 21.35 0 0 1 6.806-1.129h24.387c12.176 0 22.178 9.483 23.009 21.451.941 13.553-10.018 24.678-23.604 24.678"
        fill="#27af4b"
      />
      <Path
        d="M367.53 353.14a7.393 7.393 0 1 0-14.786 0 7.393 7.393 0 0 0 14.786 0M398.7 353.14a7.393 7.393 0 1 0-14.786 0 7.393 7.393 0 0 0 14.786 0M363.47 397.1a2.982 2.982 0 0 0-3.504 3.505 2.982 2.982 0 0 0 2.339 2.339 2.982 2.982 0 0 0 3.505-3.505 2.982 2.982 0 0 0-2.34-2.339m-14.826 8.721-21.918-25.851a3.461 3.461 0 0 1 .348-4.832l15.537-13.737a3.462 3.462 0 0 1 4.901.318l22.838 26.178.147 19.179a2.259 2.259 0 0 1-2.664 2.24z"
        fill="#113f59"
      />
    </G>
  </Svg>
)

export default AeyonLogo;
