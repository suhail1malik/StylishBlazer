export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-brand-700">
        Brand 700 Text (should be dark green)
      </h1>
      <p className="mt-4 text-brand-800">
        Brand 800 Text (should be darker green)
      </p>
      <div className="mt-4 bg-brand-100 p-4 rounded">
        Brand 100 Background (light green)
      </div>
      <div className="mt-4 border-4 border-brand-300 p-4">
        Brand 300 Border (green border)
      </div>

      {/* Inline style comparison */}
      <p className="mt-8 text-lg" style={{ color: "#15803d" }}>
        This is inline style #15803d (for comparison)
      </p>
    </div>
  );
}
