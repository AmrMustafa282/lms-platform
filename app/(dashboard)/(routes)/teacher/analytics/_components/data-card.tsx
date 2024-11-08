import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { LucideIcon, Plus } from "lucide-react";

interface DataCardProps {
 value: number;
 label: string;
 icon: LucideIcon;
 shouldFormat?: boolean;
}

const DataCard = ({
 value,
 label,
 icon: Icon,
 shouldFormat,
}: DataCardProps) => {
 return (
  <Card>
   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">{label}</CardTitle>
    <Icon className="h-6 w-6 text-primary" />
   </CardHeader>
   <CardContent>
    <div className="text-2xl font-bold">
     {shouldFormat ? formatPrice(value) : value}
    </div>
   </CardContent>
  </Card>
 );
};

export default DataCard;
