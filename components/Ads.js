export default function Ads({ slot = 'default' }) {
  return (
    <div className="my-4">
      {/* Ad placeholder - replace with your AdSense or ad network code */}
      <div className="w-full border border-dashed py-8 flex items-center justify-center bg-white">
        <div className="text-center text-sm text-gray-600">
          Ad placeholder - {slot} — paste your AdSense snippet or ad unit here.
          <div className="mt-2 text-xs text-gray-400">Example: &lt;ins className="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXX" data-ad-slot="YYYY" data-ad-format="auto"&gt;&lt;/ins&gt;</div>
        </div>
      </div>
    </div>
  );
}
