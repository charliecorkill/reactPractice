import CardWrapper from '@/app/ui/dashboard/cards';
import { Card } from '@/app/ui/dashboard/cards';
import TemperatureChart from '@/app/ui/dashboard/temperature-chart';
import RecentNotices from '@/app/ui/dashboard/notices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchNotices } from '@/app/lib/data'; // Remove fetchLatestInvoices
import { Suspense } from 'react';
import {
  TemperatureChartSkeleton,
  CardsSkeleton,
  LatestInvoicesSkeleton,
} from '@/app/ui/skeletons';
 
export default async function Page() {
  const {
    HouseBatteryPercentage,
    InternetDownloadSpeed,
    InternetUploadSpeed,
    WifiPassword,
  } = await fetchCardData();
 
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<TemperatureChartSkeleton />}>
          <TemperatureChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <RecentNotices />
        </Suspense>
        </div>
    </main>
  );
}