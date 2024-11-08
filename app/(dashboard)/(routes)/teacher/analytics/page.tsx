import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DataCard from "./_components/data-card";
import { CreditCard, DollarSign, Users } from "lucide-react";
import { Chart } from "./_components/chart";
import { ChartConfig } from "@/components/ui/chart";
import { formatPrice } from "@/lib/format";

const AnalyticsPage = async () => {
 const { userId } = auth();
 if (!userId) return redirect("/");

 const { data, totalRevenue, totalSales } = await getAnalytics(userId);

 const chartConfig = {
  desktop: {
   label: "Desktop",
   color: "#2563eb",
  },
 } satisfies ChartConfig;

 return (
  <div className="p-6">
   <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-4">
    <DataCard
     label="Total Revenue"
     value={totalRevenue}
     icon={DollarSign}
     shouldFormat
    />
    <DataCard label="Total Sales" value={totalSales} icon={CreditCard} />
   </div>
   <Chart chartData={data} chartConfig={chartConfig} />
  </div>
 );
};

export default AnalyticsPage;
