import { FileText, Users, Eye, MessageSquare } from "lucide-react";

export function DashboardStats() {
  const stats = [
    {
      title: "Total Posts",
      value: "24",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Users",
      value: "12",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Views",
      value: "3.4K",
      icon: Eye,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Comments",
      value: "42",
      icon: MessageSquare,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <div key={index} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-2 ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
