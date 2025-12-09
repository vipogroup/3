import { redirect } from 'next/navigation';

export default function CustomerRedirectPage() {
  redirect('/products');
  return null;
}

