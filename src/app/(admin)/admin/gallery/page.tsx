export default function AdminGalleryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B2545] mb-2">Gallery</h1>
      <p className="text-gray-500 mb-6">Manage photo albums for events.</p>
      <div className="admin-card text-center py-16 text-gray-400">
        <p className="text-lg font-semibold mb-2">Gallery management coming in Phase 2</p>
        <p className="text-sm">You can upload photos directly via Supabase Storage dashboard in the meantime.</p>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex mt-4 text-sm">Open Supabase Storage</a>
      </div>
    </div>
  );
}
