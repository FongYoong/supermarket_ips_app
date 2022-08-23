import * as React from "react"
import Svg, { Defs, ClipPath, Path, Text, TSpan, G } from "react-native-svg"

const AeyonTitle = (props) => (
  <Svg
    width={109.696}
    height={29.514}
    viewBox="0 0 150 150"
    preserveAspectRatio="xMinYMin slice" 
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Defs>
      <ClipPath id="a">
        <Path d="M0 500h500V0H0Z" />
      </ClipPath>
    </Defs>
    <Text
      transform="matrix(1.3041 0 0 1.3631 -431.803 503.865)"
      x={332.641}
      y={-352.435}
      fontSize={23.595}
      fontStyle="italic"
      fontWeight={600}
      style={{
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: "23.59547234px",
        fontFamily: "'Montserrat SemiBold'",
        fill: "#27af4b",
        strokeWidth: 0.97814959,
      }}
    >
      <TSpan
        x={332.641}
        y={-352.435}
        style={{
          strokeWidth: 0.97814959,
        }}
      >
        {"Ae"}
      </TSpan>
    </Text>
    <Text
      transform="matrix(1.3041 0 0 1.3631 -431.803 503.865)"
      x={363.182}
      y={-353.077}
      fontSize={23.595}
      fontStyle="italic"
      fontWeight="bold"
      style={{
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: "23.59547234px",
        fontFamily: "Montserrat",
        fill: "#113f59",
        strokeWidth: 0.97814959,
      }}
    >
      <TSpan
        x={363.182}
        y={-353.077}
        style={{
          strokeWidth: 0.97814959,
        }}
      >
        {"yon"}
      </TSpan>
    </Text>
  </Svg>
)

export default AeyonTitle;
