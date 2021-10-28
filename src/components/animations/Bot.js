import React, { useEffect, useState } from "react";

const Bot = () => {
  const [eyesState, SetEyes] = useState(false);
  const [Volume, setVolume] = useState(0);

  const MicVolRec = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        let audioContext = new AudioContext();
        let analyser = audioContext.createAnalyser();
        let microphone = audioContext.createMediaStreamSource(stream);
        let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = function () {
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          var values = 0;

          var length = array.length;
          for (var i = 0; i < length; i++) {
            values += array[i];
          }

          var average = values / length;
          setVolume(average);
        };
      })
      .catch(function (err) {});
  };

  useEffect(() => {
    const BlinkingAnim = () => {
      setTimeout(() => SetEyes(true), 0);

      setTimeout(() => SetEyes(false), 800);

      let random = Math.floor(Math.random(1, 5) * 10000);

      setTimeout(BlinkingAnim, random);
    };

    MicVolRec();
    BlinkingAnim();
  }, []);

  return (
    <svg
      width="337"
      height="324"
      viewBox="0 0 337 324"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="animCircle1" filter="url(#filter0_f)">
        <path
          d="M326 158C326 240.718 255.837 308 169 308C82.1634 308 12 240.718 12 158C12 75.2824 82.1634 8 169 8C255.837 8 326 75.2824 326 158Z"
          stroke="white"
          strokeWidth="6"
        />
      </g>
      <g className="animCircle1" filter="url(#filter1_d)">
        <path
          d="M319.5 158C319.5 244.488 252.065 314.5 169 314.5C85.9353 314.5 18.5 244.488 18.5 158C18.5 71.5122 85.9353 1.5 169 1.5C252.065 1.5 319.5 71.5122 319.5 158Z"
          stroke="#28FDBA"
          strokeWidth={Volume}
        />
      </g>
      <g className="animCircle2" filter="url(#filter2_f)">
        <path
          d="M332.5 158C332.5 237.748 259.136 302.5 168.5 302.5C77.8642 302.5 4.5 237.748 4.5 158C4.5 78.2523 77.8642 13.5 168.5 13.5C259.136 13.5 332.5 78.2523 332.5 158Z"
          stroke="#28FDBA"
        />
      </g>
      <g className="animCircle2" filter="url(#filter3_f)">
        <path
          d="M269.015 54.613C293.861 82.6911 311.568 120.309 325.999 158.544C325.834 199.372 307.103 227.916 278.085 250.703C248.905 273.616 209.534 290.543 168.393 307.999C125.594 307.819 94.7989 288.66 70.5168 260.299C46.1412 231.829 28.4469 194.221 12.0018 157.365C12.2341 116.72 34.7682 86.3215 65.8857 62.5076C97.0436 38.6629 136.424 21.7248 169.593 8.00117C212.468 8.16995 244.263 26.6402 269.015 54.613Z"
          stroke="white"
          strokeWidth="6"
        />
      </g>
      <g className="eye" filter="url(#filter4_f)">
        <ellipse
          style={eyesState ? { ry: 0 } : { ry: 53.5 }}
          cx="113.5"
          cy="139.5"
          rx="32.5"
          fill="#28FDBA"
        />
      </g>
      <g className="eye" filter="url(#filter5_f)">
        <ellipse
          style={eyesState ? { ry: 0 } : { ry: 53.5 }}
          cx="223.5"
          cy="139.5"
          rx="32.5"
          fill="#28FDBA"
        />
      </g>
      <defs>
        <filter
          id="filter0_f"
          x="5"
          y="1"
          width="328"
          height="314"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter1_d"
          x="13"
          y="0"
          width="312"
          height="324"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_f"
          x="0"
          y="9"
          width="337"
          height="298"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter3_f"
          x="5"
          y="1"
          width="328"
          height="314"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter4_f"
          x="77"
          y="82"
          width="73"
          height="115"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter5_f"
          x="187"
          y="82"
          width="73"
          height="115"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
};

export default Bot;
