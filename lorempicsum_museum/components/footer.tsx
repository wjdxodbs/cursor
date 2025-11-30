import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Camera, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 박물관 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span className="font-bold">Lorem Picsum Museum</span>
            </div>
            <p className="text-sm text-muted-foreground">
              세계 최고의 랜덤 이미지 컬렉션을 만나보세요. 매일 새로운 작품이
              추가됩니다.
            </p>
          </div>

          {/* 전시 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold">전시 정보</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  현재 전시
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  예정 전시
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  지난 전시
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  온라인 전시
                </Link>
              </li>
            </ul>
          </div>

          {/* 방문 안내 */}
          <div className="space-y-4">
            <h3 className="font-semibold">방문 안내</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>운영시간: 10:00 - 18:00</li>
              <li>휴관일: 매주 월요일</li>
              <li>입장료: 성인 15,000원</li>
              <li>청소년 10,000원</li>
            </ul>
          </div>

          {/* 연락처 */}
          <div className="space-y-4">
            <h3 className="font-semibold">연락처</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>서울시 강남구 테헤란로 123</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>02-1234-5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@lipsummuseum.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between space-y-4 text-sm text-muted-foreground md:flex-row md:space-y-0">
          <p>© 2024 Lorem Picsum Museum. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-foreground transition-colors">
              이용약관
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              고객센터
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
