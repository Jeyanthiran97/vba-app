export default function AdminRankingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B2545] mb-2">Rankings</h1>
      <p className="text-gray-500 mb-6">Rankings are auto-calculated from results data.</p>
      <div className="admin-card text-center py-16 text-gray-400">
        <p className="text-lg font-semibold mb-2">Auto-calculated from Results</p>
        <p className="text-sm">Enter bout results in the Results section. Rankings will update automatically.</p>
      </div>
    </div>
  );
}
