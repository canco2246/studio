"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  TrendingUp,
  ArrowRight
} from "lucide-react"
import { getAssets } from "@/lib/store"
import Link from "next/link"

export default function Dashboard() {
  const assets = getAssets()
  const activeCount = assets.filter(a => a.status === 'Active').length
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance').length

  const stats = [
    { name: 'Total Assets', value: assets.length, icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Healthy (Active)', value: activeCount, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Needs Attention', value: maintenanceCount, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Scanned Today', value: '12', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  ]

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-headline font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <stat.icon className="size-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="font-headline text-xl">Recent Assets</CardTitle>
                <CardDescription>Latest items synced via RFID scanner</CardDescription>
              </div>
              <Link href="/inventory" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="size-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {assets.slice(0, 5).map((asset) => (
                  <div key={asset.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground">
                        {asset.category[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{asset.name}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-tight">{asset.tagId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        asset.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {asset.status}
                      </span>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {new Date(asset.lastScanned).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <History className="size-5 text-primary" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 flex gap-3">
                    <div className="relative">
                      <div className="size-2 bg-primary rounded-full mt-1.5" />
                      {i < 4 && <div className="absolute top-4 left-1 w-px h-full bg-border" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tag Scan Detected</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Location: Warehouse B, Rack 04. Status updated to Active.</p>
                      <p className="text-[10px] text-primary/60 font-semibold mt-1 uppercase">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}