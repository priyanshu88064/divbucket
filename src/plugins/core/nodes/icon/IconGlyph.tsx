import { useEffect, useMemo, useState } from "react";
import type { IconBaseProps } from "react-icons";
import {
  DEFAULT_ICON_ID,
  loadIconPack,
  parseIconId,
  resolveIconComponent,
  type IconComponent,
} from "./catalog";

const FallbackIcon: IconComponent = ({
  size,
  color,
  className,
  ...rest
}: IconBaseProps) => (
  <svg
    stroke={color || "currentColor"}
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size || "1em"}
    height={size || "1em"}
    className={className}
    {...rest}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

interface IconGlyphProps {
  iconId: string;
  size?: number;
  className?: string;
}

export default function IconGlyph({
  iconId,
  size,
  className,
}: IconGlyphProps) {
  const [component, setComponent] = useState<IconComponent | null>(null);

  const normalizedIconId = useMemo(
    () => parseIconId(iconId).normalizedId,
    [iconId],
  );

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const { packId } = parseIconId(normalizedIconId);
      try {
        await loadIconPack(packId);
        const resolvedComponent = await resolveIconComponent(normalizedIconId);
        if (!cancelled) {
          setComponent(() => resolvedComponent);
        }
      } catch {
        if (!cancelled) {
          setComponent(null);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [normalizedIconId]);

  const ResolvedComponent = component || FallbackIcon;

  return (
    <ResolvedComponent
      size={size}
      className={className}
      data-icon-id={normalizedIconId || DEFAULT_ICON_ID}
      aria-hidden="true"
      focusable="false"
    />
  );
}
