
"use client";

import { useState } from "react";
import {
  Facebook,
  Linkedin,
  Twitter,
  MessageCircle,
  Share2,
  Copy,
  Check,
} from "lucide-react";

type BlogShareProps = {
  title: string;
  slug: string;
};

const BlogShare = ({ title, slug }: BlogShareProps) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/blogs/${slug}`;
  };

  const shareUrl = getShareUrl();
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X",
      icon: Twitter,
      color: "bg-gray-900 hover:bg-black dark:bg-gray-700",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-sky-700 hover:bg-sky-800",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600 hover:bg-green-700",
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("COPY_LINK_ERROR:", error);
    }
  };

  const nativeShare = async () => {
    const url = getShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("SHARE_ERROR:", error);
        }
      }
    } else {
      await copyLink();
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100">
          <Share2 size={17} className="text-teal-500" />
          Share this article
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Share this article with your friends and network.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {socialLinks.map((social) => {
          const Icon = social.icon;

          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${social.name}`}
              title={`Share on ${social.name}`}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors ${social.color}`}
            >
              <Icon size={18} />
            </a>
          );
        })}

        <button
          type="button"
          onClick={nativeShare}
          aria-label="Share article"
          title="Share article"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-white transition-colors hover:bg-teal-600"
        >
          <Share2 size={18} />
        </button>

        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy article link"
          title="Copy link"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>

      {copied && (
        <span className="text-xs font-medium text-green-600 sm:hidden">
          Link copied!
        </span>
      )}
    </div>
  );
};

export default BlogShare;
