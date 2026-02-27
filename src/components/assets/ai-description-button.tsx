"use client"

import * as React from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateAssetDescription } from "@/ai/flows/generate-asset-description-flow"
import { useToast } from "@/hooks/use-toast"

interface AIDescriptionButtonProps {
  keywords: string[]
  category?: string
  existingDescription?: string
  onGenerated: (description: string) => void
}

export function AIDescriptionButton({
  keywords,
  category,
  existingDescription,
  onGenerated
}: AIDescriptionButtonProps) {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (keywords.length === 0 && !category) {
      toast({
        title: "More context needed",
        description: "Please provide a category or some keywords first.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const result = await generateAssetDescription({
        keywords,
        category,
        existingDescription
      })
      onGenerated(result.description)
      toast({
        title: "Description Generated",
        description: "AI has successfully refined the asset description."
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Unable to reach the AI engine. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={loading}
      className="gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4" />
      )}
      {loading ? "Optimizing..." : "AI Assistant"}
    </Button>
  )
}