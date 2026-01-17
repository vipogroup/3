import { redirect } from 'next/navigation';

// דף /shop הופנה לדף הבית החדש (מרקטפלייס)
// כל הסינון לפי עסקים וסוג מכירה נמצא בדף הבית
export default function ShopPage() {
  redirect('/');
}
