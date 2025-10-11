"use client"

import { useState, useEffect } from "react"
import { Check, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// App data with estimated sizes in MB and categories
const popularApps = [
  { id: 1, name: "Instagram", size: 250, icon: "instagram", category: "social" },
  { id: 2, name: "TikTok", size: 400, icon: "tiktok", category: "social" },
  { id: 3, name: "Netflix", size: 150, icon: "netflix", category: "entertainment" },
  { id: 4, name: "Spotify", size: 200, icon: "spotify", category: "entertainment" },
  { id: 5, name: "YouTube", size: 250, icon: "youtube", category: "entertainment" },
  { id: 6, name: "Facebook", size: 350, icon: "facebook", category: "social" },
  { id: 7, name: "WhatsApp", size: 180, icon: "whatsapp", category: "communication" },
  { id: 8, name: "Zoom", size: 130, icon: "zoom", category: "communication" },
  { id: 9, name: "Procreate", size: 800, icon: "procreate", category: "productivity" },
  { id: 10, name: "Microsoft Word", size: 450, icon: "word", category: "productivity" },
  { id: 11, name: "Adobe Photoshop", size: 1200, icon: "photoshop", category: "productivity" },
  { id: 12, name: "Minecraft", size: 1100, icon: "minecraft", category: "games" },
  { id: 13, name: "Fortnite", size: 3500, icon: "fortnite", category: "games" },
  { id: 14, name: "GarageBand", size: 1800, icon: "garageband", category: "entertainment" },
  { id: 15, name: "iMovie", size: 700, icon: "imovie", category: "entertainment" },
]

// Average app size by category in MB
const categorySizes = {
  social: 300,
  entertainment: 400,
  communication: 150,
  productivity: 700,
  games: 2000,
  utility: 100,
  education: 250,
  health: 150,
  finance: 120,
  travel: 200,
  shopping: 150,
  news: 100,
  default: 250, // Default size if category can't be determined
}

// iPad storage options in GB
const iPadStorageOptions = [64, 128, 256, 512, 1024]

// System storage estimate in GB
const systemStorageGB = 15

export function StorageCalculator() {
  const [selectedApps, setSelectedApps] = useState<{ [key: number]: number }>({})
  const [includeSystemStorage, setIncludeSystemStorage] = useState(true)
  const [totalStorageGB, setTotalStorageGB] = useState(0)
  const [recommendedStorage, setRecommendedStorage] = useState(0)
  const [customApps, setCustomApps] = useState<Array<{ id: string; name: string; size: number; icon: string }>>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [estimatedSize, setEstimatedSize] = useState(0)

  // Estimate app size based on name
  const estimateAppSize = (appName: string) => {
    // Convert to lowercase for comparison
    const name = appName.toLowerCase()

    // Check if the app is already in our predefined list
    const existingApp = popularApps.find((app) => app.name.toLowerCase() === name)
    if (existingApp) {
      setEstimatedSize(existingApp.size)
      return existingApp.size
    }

    // Try to determine category based on keywords in the name
    if (name.includes("game") || name.includes("craft") || name.includes("battle") || name.includes("clash")) {
      setEstimatedSize(categorySizes.games)
      return categorySizes.games
    } else if (name.includes("photo") || name.includes("edit") || name.includes("office") || name.includes("doc")) {
      setEstimatedSize(categorySizes.productivity)
      return categorySizes.productivity
    } else if (
      name.includes("tube") ||
      name.includes("play") ||
      name.includes("music") ||
      name.includes("stream") ||
      name.includes("tv")
    ) {
      setEstimatedSize(categorySizes.entertainment)
      return categorySizes.entertainment
    } else if (name.includes("chat") || name.includes("message") || name.includes("mail") || name.includes("meet")) {
      setEstimatedSize(categorySizes.communication)
      return categorySizes.communication
    } else if (name.includes("book") || name.includes("learn") || name.includes("study") || name.includes("edu")) {
      setEstimatedSize(categorySizes.education)
      return categorySizes.education
    }

    // Default size if we can't determine category
    setEstimatedSize(categorySizes.default)
    return categorySizes.default
  }

  // Add custom app to the list
  const addCustomApp = () => {
    if (!searchTerm.trim()) return

    const size = estimateAppSize(searchTerm)
    const newApp = {
      id: `custom-${Date.now()}`,
      name: searchTerm,
      size: size,
      icon: "app",
    }

    setCustomApps((prev) => [...prev, newApp])
    setSearchTerm("")
    setEstimatedSize(0)

    // Add one instance of this app to selected apps
    setSelectedApps((prev) => ({
      ...prev,
      [newApp.id]: 1,
    }))
  }

  // Calculate total storage and recommended iPad storage
  useEffect(() => {
    // Calculate app storage in MB
    const appStorageMB = Object.entries(selectedApps).reduce((total, [appId, count]) => {
      // Check if it's a predefined app
      const app = popularApps.find((a) => a.id === Number.parseInt(appId))
      if (app) {
        return total + app.size * count
      }

      // Check if it's a custom app
      const customApp = customApps.find((a) => a.id === appId)
      return total + (customApp ? customApp.size * count : 0)
    }, 0)

    // Convert to GB and add system storage if included
    const systemStorageInMB = includeSystemStorage ? systemStorageGB * 1024 : 0
    const totalStorageMB = appStorageMB + systemStorageInMB
    const totalGB = totalStorageMB / 1024

    setTotalStorageGB(totalGB)

    // Determine recommended storage
    const recommendedOption =
      iPadStorageOptions.find((option) => option >= totalGB * 2) || iPadStorageOptions[iPadStorageOptions.length - 1]
    setRecommendedStorage(recommendedOption)
  }, [selectedApps, includeSystemStorage, customApps])

  // Handle app selection
  const updateAppCount = (appId: number | string, increment: boolean) => {
    setSelectedApps((prev) => {
      const currentCount = prev[appId] || 0
      const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1)

      if (newCount === 0) {
        const { [appId]: _, ...rest } = prev
        return rest
      }

      return { ...prev, [appId]: newCount }
    })
  }

  // Get app icon placeholder
  const getAppIconUrl = (iconName: string) => {
    return `/placeholder.svg?height=40&width=40&query=${iconName} app icon`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Select Your Apps</h2>
          <p className="text-sm text-gray-500">Choose the apps you plan to install</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="system-storage" checked={includeSystemStorage} onCheckedChange={setIncludeSystemStorage} />
          <Label htmlFor="system-storage">Include system storage ({systemStorageGB} GB)</Label>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type an app name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (e.target.value) {
                  estimateAppSize(e.target.value)
                } else {
                  setEstimatedSize(0)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCustomApp()
                }
              }}
            />
            {estimatedSize > 0 && searchTerm && (
              <p className="text-xs text-gray-500 mt-1">Estimated size: {(estimatedSize / 1024).toFixed(2)} GB</p>
            )}
          </div>
          <Button onClick={addCustomApp} disabled={!searchTerm.trim()}>
            Add App
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {popularApps.map((app) => (
          <Card
            key={app.id}
            className={`border ${selectedApps[app.id] ? "border-blue-200 bg-blue-50" : "border-gray-200"}`}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={getAppIconUrl(app.icon) || "/placeholder.svg"}
                      alt={`${app.name} icon`}
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{app.name}</p>
                    <p className="text-xs text-gray-500">{(app.size / 1024).toFixed(1)} GB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateAppCount(app.id, false)}
                    disabled={!selectedApps[app.id]}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-5 text-center">{selectedApps[app.id] || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateAppCount(app.id, true)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {customApps.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Your Custom Apps</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customApps.map((app) => (
              <Card
                key={app.id}
                className={`border ${selectedApps[app.id] ? "border-blue-200 bg-blue-50" : "border-gray-200"}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src={`/abstract-geometric-shapes.png?height=40&width=40&query=${app.name} app icon`}
                          alt={`${app.name} icon`}
                          className="w-8 h-8"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.name}</p>
                        <p className="text-xs text-gray-500">{(app.size / 1024).toFixed(1)} GB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateAppCount(app.id, false)}
                        disabled={!selectedApps[app.id]}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-5 text-center">{selectedApps[app.id] || 0}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateAppCount(app.id, true)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <h3 className="font-medium">Estimated Storage Usage</h3>
            <span className="font-semibold">{totalStorageGB.toFixed(1)} GB</span>
          </div>
          <Progress value={(totalStorageGB / recommendedStorage) * 100} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0 GB</span>
            <span>{recommendedStorage} GB</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Recommended iPad Storage</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Based on your app selection, we recommend at least:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {iPadStorageOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={option === recommendedStorage ? "default" : "outline"}
                      className={option === recommendedStorage ? "bg-blue-500" : ""}
                    >
                      {option} GB
                    </Badge>
                  ))}
                </div>
                <p className="mt-2 text-xs">
                  We recommend {recommendedStorage} GB to ensure you have enough space for future app updates, photos,
                  videos, and documents. This gives you approximately {(recommendedStorage - totalStorageGB).toFixed(1)}{" "}
                  GB of extra space.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 italic">
          Note: App sizes are estimates and may vary based on version, content, and cache. Actual storage requirements
          may differ.
        </div>
      </div>
    </div>
  )
}
