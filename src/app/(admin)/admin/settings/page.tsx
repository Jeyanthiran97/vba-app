export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B2545] mb-2">Settings</h1>
      <p className="text-gray-500 mb-6">Site configuration and admin management.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="admin-card">
          <h2 className="font-bold text-[#0B2545] mb-4">Association Info</h2>
          <div className="space-y-3">
            {[["Association Name", "Vavuniya Boxing Association"], ["Short Name", "VBA"], ["District", "Vavuniya"], ["Province", "Northern Province"], ["Country", "Sri Lanka"]].map(([l, v]) => (
              <div key={l}>
                <label className="label">{l}</label>
                <input defaultValue={v} className="input" />
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <h2 className="font-bold text-[#0B2545] mb-4">Contact Details</h2>
          <div className="space-y-3">
            {[["Phone", "+94 24 XXX XXXX"], ["Email", "info@vavuniyaboxing.lk"], ["Address", "Vavuniya, Northern Province"]].map(([l, v]) => (
              <div key={l}>
                <label className="label">{l}</label>
                <input defaultValue={v} className="input" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
        Settings persistence coming in Phase 2. For now, update these values directly in the code at <code>src/components/public/Footer.tsx</code> and <code>src/app/(public)/contact/page.tsx</code>.
      </div>
    </div>
  );
}
