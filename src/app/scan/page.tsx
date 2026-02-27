"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  Tag
} from "lucide-react"
import { getAssetByTag, addAsset } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { NewAsset } from "@/lib/types"
import { AIDescriptionButton } from "@/components/assets/ai-description-button"

export default function ScanInterface() {
  const [tagId, setTagId] = React.useState("")
  const [formVisible, setFormVisible] = React.useState(false)
  const [duplicateError, setDuplicateError] = React.useState(false)
  const [formData, setFormData] = React.useState<NewAsset>({
    tagId: "",
    name: "",
    category: "",
    location: "",
    description: "",
    status: "Active"
  })
  const { toast } = useToast()

  const handleSimulateScan = () => {
    if (!tagId) return
    
    const existing = getAssetByTag(tagId)
    if (existing) {
      setDuplicateError(true)
      toast({
        title: "Duplicate Tag Detected",
        description: `This RFID tag is already assigned to: ${existing.name}`,
        variant: "destructive"
      })
      return
    }

    setDuplicateError(false)
    setFormData(prev => ({ ...prev, tagId }))
    setFormVisible(true)
    toast({
      title: "Tag Scanned Successfully",
      description: "Complete the form below to link this tag to a new asset."
    })
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
        <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  <Database className="size-3" /> Hardware Integrated
                </div>
                <h2 className="text-3xl font-headline font-bold">Simulate RFID Scan</h2>
                <p className="text-primary-foreground/80 max-w-sm">
                  Input a tag ID to simulate a signal from IDT107 or Chainway C72 hardware. The system enforces unique record validation.
                </p>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary/60" />
                    <Input 
                      placeholder="Enter RFID Tag ID..." 
                      className="bg-white text-foreground pl-10 h-12 rounded-xl focus:ring-accent transition-all border-none"
                      value={tagId}
                      onChange={(e) => {
                        setTagId(e.target.value)
                        setDuplicateError(false)
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSimulateScan()}
                    />
                  </div>
                  <Button 
                    className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl shadow-lg shadow-accent/20"
                    onClick={handleSimulateScan}
                  >
                    Scan Tag
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="size-48 bg-white/10 rounded-full flex items-center justify-center animate-pulse border border-white/20">
                  <ScanLine className="size-24 text-white/40" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground p-3 rounded-2xl shadow-xl shadow-black/20">
                  <Info className="size-6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {formVisible && (
          <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="font-headline">Create Asset Record</CardTitle>
              <CardDescription>Link digital metadata to the physical RFID tag.</CardDescription>
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
                <p className="text-[10px] text-muted-foreground italic">Tip: Use the AI Assistant to generate a professional asset description based on the name and category.</p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 flex justify-end gap-3 p-4">
              <Button variant="ghost" onClick={() => setFormVisible(false)}>Cancel</Button>
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
              <p className="text-red-700 text-sm">This tag ID is already assigned to an existing asset. Please use a unique RFID tag or update the existing record.</p>
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