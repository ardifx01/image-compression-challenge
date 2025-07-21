import { prisma } from "@/lib/prisma";
import { utapi } from "@/lib/uploadthing";
import Link from "next/link";

export const Gallery = async () => {
  const uploads = await prisma.uploads.findMany();
  const urls = await Promise.all(
    uploads.map(async (upload) => utapi.getSignedURL(upload.optimizedImage))
  );

  return (
    <section className="grid grid-cols-3 gap-4">
      {uploads.map((upload, index) => (
        <Link href={`/uploaded/${upload.code}`} key={upload.id}>
          <article>
            <img
              className="w-full h-auto mb-2 rounded-lg"
              src={urls[index].ufsUrl}
              alt={upload.name}
            />

            <p className="font-medium">{upload.name}</p>
          </article>
        </Link>
      ))}
    </section>
  );
};
