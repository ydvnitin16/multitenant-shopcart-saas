import React from "react";
import {
  ShoppingCart,
  IndianRupee,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  Bell,
  Search,
} from "lucide-react";

export default function StoreOwnerDashboard() {
  const stats = [
    {
      title: "Total Sales",
      value: "₹1,24,580",
      change: "+18.2%",
      icon: IndianRupee,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Orders",
      value: "248",
      change: "12 Pending",
      icon: ShoppingCart,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      title: "Products",
      value: "124",
      change: "9 Low Stock",
      icon: Package,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Customers",
      value: "89",
      change: "+12 New",
      icon: Users,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
  ];

  const recentOrders = [
    {
      id: "#1021",
      customer: "Rahul",
      amount: "₹799",
      status: "Pending",
    },
    {
      id: "#1022",
      customer: "Priya",
      amount: "₹1,299",
      status: "Shipped",
    },
    {
      id: "#1023",
      customer: "Amit",
      amount: "₹599",
      status: "Delivered",
    },
    {
      id: "#1024",
      customer: "Sneha",
      amount: "₹1,999",
      status: "Cancelled",
    },
  ];

  const lowStock = [
    "Black Hoodie - 2 left",
    "White Shoes - 3 left",
    "Blue Cap - 1 left",
    "Oversized Tee - 4 left",
  ];

  const getBadge = (status) => {
    if (status === "Pending")
      return "bg-yellow-500/10 text-yellow-400";
    if (status === "Shipped")
      return "bg-sky-500/10 text-sky-400";
    if (status === "Delivered")
      return "bg-emerald-500/10 text-emerald-400";

    return "bg-rose-500/10 text-rose-400";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <header className="border-b border-zinc-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Store Dashboard
          </h1>
          <p className="text-zinc-400 text-sm">
            Welcome back, manage your business
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
            <Search size={18} className="text-zinc-500" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm"
            />
          </div>

          <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
            <Bell size={18} />
          </button>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500" />
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-zinc-400">
                      {item.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                      {item.value}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-2">
                      {item.change}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-xl ${item.bg}`}
                  >
                    <Icon
                      className={item.color}
                      size={22}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Graph + Side Cards */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Sales Chart */}
          <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  Sales Analytics
                </h3>
                <p className="text-sm text-zinc-400">
                  Revenue in last 7 days
                </p>
              </div>

              <TrendingUp className="text-emerald-400" />
            </div>

            {/* Fake Graph */}
            <div className="mt-8 h-64 flex items-end gap-3">
              {[45, 70, 55, 90, 75, 120, 95].map(
                (bar, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-violet-500 to-sky-400 rounded-t-xl"
                    style={{ height: `${bar}%` }}
                  />
                )
              )}
            </div>
          </div>

          {/* Side Cards */}
          <div className="space-y-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-sm text-zinc-400">
                Conversion Rate
              </p>
              <h3 className="text-3xl font-bold mt-2">
                3.0%
              </h3>
              <p className="text-sm text-zinc-500 mt-2">
                8,240 visitors → 248 orders
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-sm text-zinc-400">
                Avg Order Value
              </p>
              <h3 className="text-3xl font-bold mt-2">
                ₹890
              </h3>
              <p className="text-sm text-emerald-400 mt-2">
                +6.2% this month
              </p>
            </div>
          </div>
        </section>

        {/* Orders + Low Stock */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Orders */}
          <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h3 className="font-semibold text-lg mb-4">
              Recent Orders
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left py-3">
                      Order
                    </th>
                    <th className="text-left py-3">
                      Customer
                    </th>
                    <th className="text-left py-3">
                      Amount
                    </th>
                    <th className="text-left py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr
                      key={i}
                      className="border-b border-zinc-800/70"
                    >
                      <td className="py-4">
                        {order.id}
                      </td>
                      <td>{order.customer}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-yellow-400" />
              <h3 className="font-semibold text-lg">
                Low Stock
              </h3>
            </div>

            <div className="space-y-3">
              {lowStock.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-zinc-800 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <button className="w-full mt-5 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 transition">
              Restock Products
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}