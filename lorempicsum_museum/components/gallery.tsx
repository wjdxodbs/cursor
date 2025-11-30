"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  width: number;
  height: number;
}

export default function Gallery() {
  const [currentPage, setCurrentPage] = useState(1);
  // 새로고침할 때마다 다른 이미지를 보여주기 위한 랜덤 시드
  // SSR이 비활성화되어 있으므로 클라이언트에서만 실행됨
  const [randomSeed] = useState(() => Math.floor(Math.random() * 10000));
  const imagesPerPage = 10;
  const totalImages = 100;

  // 100개의 이미지 ID 생성 (1-100)
  const allImages: GalleryImage[] = Array.from(
    { length: totalImages },
    (_, i) => ({
      id: i + 1,
      width: 300,
      height: 300,
    })
  );

  // 현재 페이지의 이미지들
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = allImages.slice(indexOfFirstImage, indexOfLastImage);

  // 전체 페이지 수
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // 페이지 번호 버튼 생성 (현재 페이지 주변만 표시)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      const adjustedStartPage = Math.max(1, endPage - maxVisible + 1);
      for (let i = adjustedStartPage; i <= endPage; i++) {
        pages.push(i);
      }
    } else {
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="container py-12">
      {/* 갤러리 헤더 */}
      <div className="mb-12 space-y-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <ImageIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Photo Gallery</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Lorem Picsum의 랜덤 이미지 컬렉션을 감상하세요. 각 이미지는 고유한
          아름다움을 담고 있습니다.
        </p>
        <Badge variant="secondary" className="text-sm">
          총 {totalImages}개의 작품 | 페이지 {currentPage} / {totalPages}
        </Badge>
      </div>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
        {currentImages.map((image) => (
          <Card
            key={image.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={`https://picsum.photos/300?random=${
                    randomSeed + image.id
                  }`}
                  alt={`Gallery image ${image.id}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium">Photo #{image.id}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {image.width} × {image.height}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            이전
          </Button>

          <div className="flex items-center space-x-1">
            {currentPage > 3 && (
              <>
                <Button variant="outline" size="sm" onClick={() => goToPage(1)}>
                  1
                </Button>
                {currentPage > 4 && <span className="px-2">...</span>}
              </>
            )}

            {getPageNumbers().map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-2">...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={currentPage === totalPages}
          >
            다음
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {indexOfFirstImage + 1} - {Math.min(indexOfLastImage, totalImages)} /{" "}
          {totalImages}
        </p>
      </div>
    </div>
  );
}
