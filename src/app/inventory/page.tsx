"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { 
  MoreVertical, 
  Search, 
  Filter, 
  ChevronDown, 
  Download,
  Edit2,
  Trash2,
  ExternalLink
} from "lucide-react"
import { getAssets, deleteAsset } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Asset } from "@/lib/types"

export default function Inventory() {
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [search, setSearch] = React.useState("")
  const { toast } = useToast()

  React.useEffect(() => {
    setAssets(getAssets())
  }, [])

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.tagId.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    deleteAsset(id)
    setAssets(getAssets())
    toast({
      title: "Asset Removed",
      description: "Inventory record has been deleted."
    })
  }

  return (
    <AppShell>
      <div className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden">
        <div className="p-6 border-b border-border/40 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by name, tag, or category..." 
              className="pl-9 bg-muted/30 border-none focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
              <Filter className="size-3.5" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
              <Download className="size-3.5" />
              Export
            </Button>
            <Button size="sm" className="gap-2 text-xs font-semibold bg-primary hover:bg-primary/90">
              New Asset
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Asset Name</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">RFID Tag</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Category</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Location</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{asset.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">ID: {asset.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 text-primary rounded-md text-xs font-bold border border-primary/10">
                      {asset.tagId}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{asset.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{asset.location}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      asset.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      asset.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        asset.status === 'Active' ? 'bg-emerald-500' : 
                        asset.status === 'Maintenance' ? 'bg-amber-500' :
                        'bg-gray-500'
                      }`} />
                      {asset.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Asset Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <Edit2 className="size-3.5" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <ExternalLink className="size-3.5" /> View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 text-destructive focus:bg-destructive/5 focus:text-destructive"
                          onClick={() => handleDelete(asset.id)}
                        >
                          <Trash2 className="size-3.5" /> Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredAssets.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="size-8 text-muted-foreground/30" />
            </div>
            <div>
              <p className="font-headline font-bold text-lg">No assets found</p>
              <p className="text-sm text-muted-foreground">Adjust your filters or add a new asset entry.</p>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border/40 flex items-center justify-between bg-muted/5">
          <p className="text-xs text-muted-foreground">Showing {filteredAssets.length} of {assets.length} assets</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="text-xs">Previous</Button>
            <Button variant="outline" size="sm" disabled className="text-xs">Next</Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}