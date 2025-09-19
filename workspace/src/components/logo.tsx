import Image from "next/image";

export function Logo() {
  return (
    <Image 
      src="https://picsum.photos/seed/logo/120/40" 
      alt="N+ Logo" 
      width={100} 
      height={32}
      className="h-8 w-auto"
      data-ai-hint="modern logo"
    />
  );
}
