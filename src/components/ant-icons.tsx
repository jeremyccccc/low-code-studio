import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      {...props}
    >
      {children}
    </svg>
  );
}

export function AppstoreOutlinedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </BaseIcon>
  );
}

export function BorderOutlinedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </BaseIcon>
  );
}

export function FontSizeOutlinedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 19 9.2 6h.6L14 19" />
      <path d="M6.6 14h5.8" />
      <path d="M15.5 9.5H20" />
      <path d="M17.75 9.5V19" />
    </BaseIcon>
  );
}

export function HighlightOutlinedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="8" width="16" height="8" rx="4" />
      <path d="M7 12h10" />
    </BaseIcon>
  );
}

export function CalendarOutlinedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M7.5 3.5v3" />
      <path d="M16.5 3.5v3" />
      <path d="M3.5 9.5h17" />
      <path d="M8 13h3" />
      <path d="M13 13h3" />
      <path d="M8 17h3" />
    </BaseIcon>
  );
}

export function CaretDownOutlinedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <path d="m9 11 3 3 3-3" />
    </BaseIcon>
  );
}

export function CheckCircleOutlinedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.7 12.2 2.2 2.2 4.5-4.6" />
    </BaseIcon>
  );
}
