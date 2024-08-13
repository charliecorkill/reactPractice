import {
  CogIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InboxIcon,
  Battery100Icon,
  WifiIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  cog: CogIcon,
  wifi: WifiIcon,
  battery: Battery100Icon,
  pending: ClockIcon,
  invoices: InboxIcon,
  arrowUp: ArrowUpIcon,
  arrowDown: ArrowDownIcon,
};

export default async function CardWrapper() {
  const {
    HouseBatteryPercentage,
    InternetDownloadSpeed,
    InternetUploadSpeed,
    WifiPassword,
  } = await fetchCardData();

  return (
    <>

      <Card title="House Battery" value={HouseBatteryPercentage+"%"} type="battery" />
      <Card title="Internet Download Speed" value={InternetDownloadSpeed+"Mbps"} type="arrowDown" />
      <Card title="Internet Upload Speed" value={InternetUploadSpeed+"Mbps"} type="arrowUp" />
      <Card title="Wi-Fi Password" value={WifiPassword} type="wifi" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'battery' | 'arrowDown' | 'arrowUp' | 'wifi';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
