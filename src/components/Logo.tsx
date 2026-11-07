import Image from "next/image";

/** Team Veritas logo (provided by the team). Transparent background; text is inverted to white in dark theme. */
export default function Logo({ height = 32 }: { height?: number }) {
  const width = Math.round((height * 961) / 249);
  return (
    <span className="inline-flex shrink-0 items-center">
      <Image src="/veritas-logo.png" alt="Veritas" width={width} height={height} priority className="veritas-logo" style={{ height, width: "auto" }} />
    </span>
  );
}
