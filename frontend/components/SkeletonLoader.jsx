import { Skeleton } from "@/components/ui/skeleton";

// Movie Card Skeleton
export function MovieCardSkeleton() {
  return (
    <div className="flex flex-row gap-4 w-full items-center justify-center">
      <div className="relative group">
        <Skeleton className="w-[200px] h-[140px] rounded-lg" />
      </div>
    </div>
  );
}

// Main Slider Skeleton
export function MainSliderSkeleton() {
  return (
    <div className="w-full h-[100vh] relative">
      <Skeleton className="w-full h-full absolute" />
      <div className="flex flex-col relative z-10 w-[95vw] md:w-[90vw] lg:w-[80vw] mx-auto pt-64">
        <div className="flex flex-col gap-2 p-4 min-h-[35vh] rounded-lg w-full lg:w-1/2 bg-black/25">
          <Skeleton className="w-3/4 h-12 my-2" />
          <Skeleton className="w-1/3 h-6 my-1" />
          <Skeleton className="w-1/2 h-6 my-1" />
          <Skeleton className="w-1/2 h-6 my-1" />
          <Skeleton className="w-1/2 h-6 my-1" />
          <Skeleton className="w-full h-20 my-1" />
          <Skeleton className="w-40 h-12 rounded my-1" />
        </div>
      </div>
    </div>
  );
}

// Top Slider Skeleton
export function TopSliderSkeleton() {
  return (
    <div className="w-[78vw] mx-auto">
      <div className="flex overflow-hidden py-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex-none w-1/5 px-2">
            <div className="flex flex-row gap-4 items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-[200px] h-[280px] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Content Slider Skeleton
export function ContentSliderSkeleton() {
  return (
    <div className="w-[78vw] mx-auto">
      <div className="flex overflow-hidden py-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex-none w-1/6 px-2">
            <Skeleton className="w-[200px] h-[280px] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Login Buttons Skeleton
export function LoginButtonsSkeleton() {
  return (
    <div className="flex flex-row gap-2 align-center">
      <Skeleton className="w-26 h-8 rounded-lg" />
    </div>
  );
}

// Footer Skeleton
export function FooterSkeleton() {
  return (
    <footer className="w-[100vw] md:w-[80vw] lg:w-[80vw] xl:w-[80vw] flex flex-row justify-between pb-5 pt-10 mt-20 border-t-2 border-t-gray-900 mx-auto">
      <div className="flex flex-col justify-between">
        <div>
          <Skeleton className="w-26 h-20 rounded-lg" />
          <Skeleton className="w-150 h-8 rounded-lg" />
          <Skeleton className="w-150 h-8 rounded-lg" />
          <Skeleton className="w-150 h-8 rounded-lg" />
        </div>
        <nav className="pt-5 flex flex-col md:flex-row lg:flex-row xl:flex-row  justify-start gap-5">
          <Skeleton className="w-26 h-8 rounded-lg" />
          <Skeleton className="w-26 h-8 rounded-lg" />
          <Skeleton className="w-26 h-8 rounded-lg" />
          <Skeleton className="w-26 h-8 rounded-lg" />
        </nav>
      </div>
    </footer>
  );
}