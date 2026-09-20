export function Scene({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 760 360"
      className={small ? "scene small" : "scene"}
      role="img"
      aria-label="씨앗과 식물이 자라는 따뜻한 정원 삽화"
    >
      <defs>
        <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".6" fill="#9f987b" opacity=".15" />
        </pattern>
      </defs>
      <rect width="760" height="360" fill="#ebe8d9" />
      <rect width="760" height="360" fill="url(#dots)" />
      <circle cx="619" cy="88" r="37" fill="#e3b951" opacity=".8" />
      <path d="M0 310 Q180 255 360 302 T760 287V360H0Z" fill="#d5dac7" />
      <path
        d="M100 280Q140 215 180 276M577 286Q618 236 674 285"
        fill="none"
        stroke="#b3bba0"
        strokeWidth="3"
      />
      <g transform="translate(295 50)">
        <path
          d="M84 193Q102 110 84 51"
          fill="none"
          stroke="#637b53"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M94 127Q15 129 28 78Q82 68 94 127" fill="#7e9369" />
        <path d="M91 102Q154 102 146 55Q99 50 91 102" fill="#a4b18a" />
        <path d="M87 65Q57 20 87 9Q119 29 87 65" fill="#647f56" />
        <path d="M95 153Q157 161 160 111Q119 94 95 153" fill="#879b70" />
        <path d="M31 186H150L133 281Q90 297 48 281Z" fill="#bd795b" />
        <path d="M26 182H155V205H26Z" fill="#cc906e" />
        <path
          d="M55 217L62 271"
          stroke="#dda789"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <ellipse cx="90" cy="184" rx="59" ry="9" fill="#775d44" />
        <path d="M84 192L90 158" stroke="#637b53" strokeWidth="5" />
      </g>
      <g transform="translate(183 217) rotate(-12)">
        <path d="M0 0L54 4L50 73L-5 67Z" fill="#f9f6e8" stroke="#d4cdb5" />
        <path d="M8 19H38M8 29H28" stroke="#b0ac96" strokeWidth="2" />
        <ellipse cx="23" cy="48" rx="7" ry="10" fill="#b7a071" />
      </g>
      <g stroke="#9b9e77" fill="none" strokeWidth="2">
        <path d="M541 291V233M540 265Q502 259 514 241Q539 241 540 265M541 252Q571 249 565 231Q542 232 541 252" />
      </g>
      <ellipse cx="395" cy="339" rx="104" ry="7" fill="#7c8467" opacity=".09" />
      <g fill="#bfad80">
        <ellipse
          cx="498"
          cy="316"
          rx="6"
          ry="4"
          transform="rotate(-30 498 316)"
        />
        <ellipse cx="513" cy="320" rx="5" ry="3" />
      </g>
    </svg>
  );
}
