import { FOOTER_TEXT } from "@/data/case";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface2">
      <p className="mx-auto max-w-6xl px-4 py-8 text-center text-base text-muted sm:px-6">{FOOTER_TEXT}</p>
    </footer>
  );
}
