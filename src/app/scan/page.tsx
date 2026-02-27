"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  ScanLine, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Database,
  Tag,
  Cpu,
  Wifi
} from "lucide-react"
import { getAssetByTag, addAsset, recordScan } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { NewAsset } from "@/lib/types"
import { AIDescriptionButton } from "@/components/assets/ai-description-button"
import Link from "next/link"

export default function ScanInterface() {
  const [tagId, setTagId] = React.useState("")
  const [formVisible, setFormVisible] = React.useState(false)
  const [duplicateError, setDuplicateError] = React.useState(false)
  const [isHardwareActive, setIsHardwareActive] = React.useState(true)
  const [formData, setFormData] = React.useState<NewAsset>({
    tagId: "",
    name: "",
    category: "",
    location: "",
    description: "",
    status: "Active"
  })
  const { toast } = useToast()

  // Hardware Listener for IDT 107 (HID Mode)
  React.useEffect(() => {
    let buffer = ""
    let lastKeyTime = Date.now()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHardwareActive) return

      const currentTime = Date.now()
      // RFID scanners send keys very rapidly (usually < 30ms apart)
      if (currentTime - lastKeyTime > 50) {
        buffer = "" // Clear buffer if it's slow (manual typing)
      }

      if (e.key === 'Enter') {
        if (buffer.length > 3) {
          handleIncomingScan(buffer)
          buffer = ""
        }
      } else if (e.key.length === 1) {
        buffer += e.key
      }
      
      lastKeyTime = currentTime
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isHardwareActive])

  const handleIncomingScan = (id: string) => {
    setTagId(id)
    const existing = recordScan(id)
    
    if (existing) {
      toast({
        title: "Asset Identified",
        description: `Successfully logged scan for: ${existing.name}`,
        variant: "default",
      })
      setFormVisible(false)
    } else {
      setFormData(prev => ({ ...prev, tagId: id }))
      setFormVisible(true)
      setDuplicateError(false)
      toast({
        title: "New Tag Detected",
        description: "Tag ID not found in database. Create a new record?",
      })
    }
  }

  const handleManualScan = () => {
    if (!tagId) return
    handleIncomingScan(tagId)
  }

  const handleSave = () => {
    try {
      addAsset(formData)
      toast({
        title: "Asset Saved",
        description: "New inventory record has been created and synced."
      })
      setFormVisible(false)
      setTagId("")
      setFormData({
        tagId: "",
        name: "",
        category: "",
        location: "",
        description: "",
        status: "Active"
      })
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive"
      })
    }
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className={`size-3 rounded-full animate-pulse ${isHardwareActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Cpu className="size-4" /> Hardware Status: {isHardwareActive ? 'IDT 107 Connected' : 'Disconnected'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary"
            onClick={() => setIsHardwareActive(!isHardwareActive)}
          >
            {isHardwareActive ? 'Disable Hardware Listening' : 'Enable Hardware Listening'}
          </Button>
        </div>

        <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  <Wifi className="size-3" /> Auto-Sync Active
                </div>
                <h2 className="text-3xl font-headline font-bold">Ready to Scan</h2>
                <p className="text-primary-foreground/80 max-w-sm">
                  The system is listening for signals from your IDT 107 reader. Just place a tag near the reader or type manually below.
                </p>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary/60" />
                    <Input 
                      placeholder="Enter RFID Tag ID..." 
                      className="bg-white text-foreground pl-10 h-12 rounded-xl focus:ring-accent transition-all border-none"
                      value={tagId}
                      onChange={(e) => setTagId(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
                    />
                  </div>
                  <Button 
                    className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl shadow-lg shadow-accent/20"
                    onClick={handleManualScan}
                  >
                    Process Tag
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className={`size-48 bg-white/10 rounded-full flex items-center justify-center border border-white/20 transition-all duration-500 ${isHardwareActive ? 'animate-pulse scale-110' : 'opacity-50'}`}>
                  <ScanLine className="size-24 text-white/40" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground p-3 rounded-2xl shadow-xl shadow-black/20">
                  <Database className="size-6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {formVisible && (
          <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">New Asset Detected</CardTitle>
                <CardDescription>Assign metadata to the physical tag: <span className="font-mono text-primary font-bold">{formData.tagId}</span></CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Discovery Mode</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Asset Name</Label>
                  <Input 
                    placeholder="e.g. Cisco Switch X-500" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={v => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Machinery">Machinery</SelectItem>
                      <SelectItem value="IT Hardware">IT Hardware</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Location</Label>
                  <Input 
                    placeholder="e.g. Warehouse B, Aisle 4" 
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Operational Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Detailed Description</Label>
                  <AIDescriptionButton 
                    keywords={formData.name ? [formData.name] : []}
                    category={formData.category}
                    existingDescription={formData.description}
                    onGenerated={(desc) => setFormData({ ...formData, description: desc })}
                  />
                </div>
                <Textarea 
                  placeholder="Technical specifications, serial numbers, or owner information..." 
                  className="min-h-[120px] resize-none"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 flex justify-end gap-3 p-4">
              <Button variant="ghost" onClick={() => setFormVisible(false)}>Ignore Scan</Button>
              <Button className="bg-primary hover:bg-primary/90 font-bold px-8" onClick={handleSave}>
                Save Record
              </Button>
            </CardFooter>
          </Card>
        )}

        {duplicateError && (
          <div className="flex items-start gap-3 p-6 bg-red-50 border border-red-100 rounded-2xl animate-in zoom-in-95 duration-200">
            <AlertCircle className="size-6 text-red-600 shrink-0" />
            <div>
              <p className="text-red-900 font-bold">Duplication Error</p>
              <p className="text-red-700 text-sm">This tag ID is already assigned. Use a different tag.</p>
              <Link href="/inventory" className="text-red-600 text-xs font-bold hover:underline mt-2 inline-block">
                Go to Inventory List <ArrowRight className="size-3 inline ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
