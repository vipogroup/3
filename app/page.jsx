import HomePage from './components/HomePage';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'קונים חכם | רכישה קבוצתית חכמה',
  description: 'קונים חכם - פלטפורמת רכישה קבוצתית חכמה וחסכונית',
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/home/css/style.css" />
      <link rel="stylesheet" href="/home/css/responsive.css" />
      <link rel="stylesheet" href="/home/css/accessibility.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      <HomePage />
    </>
  );
}
