"use client";

import dynamic from "next/dynamic";

const Gallery = dynamic(() => import("@/components/gallery"), {
  ssr: false,
  loading: () => (
    <div className="container py-12 text-center">
      <p className="text-muted-foreground">갤러리를 불러오는 중...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="bg-background">
      <Gallery />
    </div>
  );
}
