import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => `${window.location.origin}/`;

  const handleShare = async () => {
    const url = getShareUrl();
    const shareData = {
      title: "Python Learner",
      text: "Python seekhne ke liye ye app try karo!",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — no-op
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-2 mx-4 mb-4 rounded-md border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors justify-center"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-green-600">Link copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>Share App</span>
        </>
      )}
    </button>
  );
}
