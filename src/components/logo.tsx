import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="https://picsum.photos/seed/logo/40/40"
      alt="ZOUDOU Logo"
      width={40}
      height={40}
      className="rounded-lg"
      data-ai-hint="modern letter logo"
    />
  );
}
