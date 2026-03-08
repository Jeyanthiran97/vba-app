import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function GalleryAlbumPage({ params }: { params: { albumId: string } }) {
  const supabase = createClient();
  const { data: album } = await supabase.from("gallery_albums").select("*, photos:gallery_photos(*)").eq("id", params.albumId).single();
  if (!album) notFound();
  const photos = (album.photos || []).sort((a: any, b: any) => a.sort_order - b.sort_order);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/gallery" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B2545] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Gallery
      </Link>
      <h1 className="section-title">{album.title}</h1>
      <p className="section-subtitle">{photos.length} photos</p>
      {photos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No photos in this album yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo: any) => (
            <div key={photo.id} className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img src={photo.public_url} alt={photo.caption || "Photo"} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
