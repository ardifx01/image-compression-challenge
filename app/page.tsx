import { Gallery } from "@/components/gallery";
import { UploadImage } from "@/components/upload-dialog";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <section className="p-16 pt-32">
        <Suspense fallback={<p className="italic">Loading...</p>}>
          <Gallery />
        </Suspense>
      </section>

      <section className="fixed bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center mb-8">
        <UploadImage />
      </section>
    </>
  );
}
