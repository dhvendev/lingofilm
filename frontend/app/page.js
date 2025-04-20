import MainSlider from "@/components/MainSlider";
import Slider from "@/components/Slider";
import TopSlider from "@/components/TopSlider";
import { getMovies } from "@/services/axiosMethods";
import Link from "next/link";
import { Suspense } from "react";
import { MainSliderSkeleton, ContentSliderSkeleton, TopSliderSkeleton } from "@/components/SkeletonLoader";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Suspense fallback={<MainSliderSkeleton />}>
        <MainSlider/>
      </Suspense>
      
      <Suspense fallback={<TopSliderSkeleton />}>
        <TopSlider/>
      </Suspense>
      
      <section className="w-full my-4">
        <div className="w-[80vw] flex justify-between mx-auto mb-2">
          <h2 className="font-semibold text-2xl">Новинки</h2>
        </div>
        <Suspense fallback={<ContentSliderSkeleton />}>
          <Slider />
        </Suspense>
      </section>

      <section className="w-full my-4">
        <div className="w-[80vw] flex justify-between mx-auto mb-2">
          <Link href="/films" className="hover:text-green-500 transition-colors duration-200">
            <h2 className="font-semibold text-2xl">Фильмы</h2>
          </Link>
        </div>
        <Suspense fallback={<ContentSliderSkeleton />}>
          <Slider />
        </Suspense>
      </section>

      <section className="w-full my-4">
        <div className="w-[80vw] flex justify-between mx-auto mb-2">
          <Link href="/films" className="hover:text-green-500 transition-colors duration-200">
            <h2 className="font-semibold text-2xl">Сериалы</h2>
          </Link>
        </div>
        <Suspense fallback={<ContentSliderSkeleton />}>
          <Slider />
        </Suspense>
      </section>
    </main>
  );
}