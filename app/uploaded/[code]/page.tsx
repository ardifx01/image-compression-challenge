import { prisma } from "@/lib/prisma";
import { utapi } from "@/lib/uploadthing";
import { notFound } from "next/navigation";

export default async function UploadedDetails({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const data = await prisma.uploads.findUnique({
    where: {
      code,
    },
  });

  if (!data) {
    return notFound();
  }

  const [originalImageUrl, optimizedImageUrl, thumbnailImageUrl] =
    await Promise.all([
      utapi.getSignedURL(data.originalImage),
      utapi.getSignedURL(data.optimizedImage),
      utapi.getSignedURL(data.thumbnail),
    ]);

  return (
    <section className="p-16 pt-32 space-y-8">
      <h1 className="font-bold text-lg">{data.name}</h1>

      <section className="grid grid-cols-3 gap-4 w-full">
        <div>
          <h2 className="font-semibold mb-2">Original</h2>
          <img
            className="w-full h-auto rounded-lg"
            src={originalImageUrl.ufsUrl}
          />
          <p>
            {data.width} x {data.height}
          </p>
          <p>{(data.originalSize / 1024 / 1024).toFixed(2)}MB</p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Optimized</h2>
          <img
            className="rounded-lg w-full h-auto"
            src={optimizedImageUrl.ufsUrl}
          />
          <p>
            {data.width} x {data.height}
          </p>
          <p>{(data.optimizedSize / 1024 / 1024).toFixed(2)}MB</p>
        </div>

        <div>
          <h2 className="font-semibold mb-2 rounded-lg">Thumbnail</h2>
          <img className="rounded-lg" src={thumbnailImageUrl.ufsUrl} />
          <p>{(data.width * (150 / data.height)).toFixed(0)} x 150</p>
          <p>{(data.thumbnailSize / 1024).toFixed(2)}KB</p>
        </div>
      </section>
    </section>
  );
}
