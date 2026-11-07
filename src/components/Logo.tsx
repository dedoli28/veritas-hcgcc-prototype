import Image from "next/image";

/** Team Veritas logo (provided by the team). Sits on a light pill so it reads in both themes. */
export default function Logo({ height = 32 }: { height?: number }) {
  const width = Math.round((height * 961) / 249);
  return (
    <span className="inline-flex shrink-0 items-center rounded-lg bg-[#f7f7f7] px-2 py-1">
      <Image src="/veritas-logo.png" alt="Veritas" width={width} height={height} priority style={{ height, width: "auto" }} />
    </span>
  );
}
