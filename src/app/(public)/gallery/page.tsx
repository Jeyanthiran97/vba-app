import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Camera, Images } from "lucide-react";
import type { Metadata } from "next";
import type { GalleryAlbum } from "@/lib/types";

export const metadata: Metadata = { title: "Gallery" };
export const revalidate = 300;

export default async function GalleryPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("gallery_albums")
    .select("*, photos:gallery_photos(id, public_url, sort_order)")
    .order("created_at", { ascending: false });
  const albums = (data || []) as (GalleryAlbum & { photos: any[] })[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title">Photo Gallery</h1>
      <p className="section-subtitle">Moments from VBA events and tournaments</p>

      {albums.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold mb-2">No albums yet</h3>
          <p>Photos will appear here once uploaded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => {
            const cover = album.photos?.sort((a, b) => a.sort_order - b.sort_order)[0];
            return (
              <Link key={album.id} href={`/gallery/${album.id}`} className="card group overflow-hidden">
                <div className="h-52 bg-gradient-to-br from-[#0B2545] to-[#1A4A8A] flex items-center justify-center overflow-hidden relative">
                  {cover ? (
                    <img src={cover.public_url} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Images className="w-12 h-12 text-white/20" />
                  )}
                  <div className="absolute inset-0 bg-[#0B2545]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">View Album</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 group-hover:text-[#0B2545] transition-colors">{album.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    <Camera className="w-3.5 h-3.5 inline mr-1" />
                    {album.photos?.length || 0} photos
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
