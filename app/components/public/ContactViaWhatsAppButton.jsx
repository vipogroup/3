"use client";

import { buildManagerWhatsAppUrl } from "@/lib/whatsapp";

export default function ContactViaWhatsAppButton({ sourceLabel }) {
  const message = `שלום, הגעתי דרך ${sourceLabel || "האתר של VIPO"} ואני מעוניין לקבל פרטים נוספים.`;
  const url = buildManagerWhatsAppUrl(message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold bg-green-500 text-white hover:bg-green-600 shadow-md w-full sm:w-auto"
    >
      דברו איתי בוואטסאפ
    </a>
  );
}
