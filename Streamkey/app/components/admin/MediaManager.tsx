'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Search, Edit, Tag, X, Plus, Calendar, Eye, EyeOff } from 'lucide-react'
import { DatePicker } from '@/app/components/ui/date-picker'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type MediaItem = {
  id: string
  title: string
  description: string
  type: 'movie' | 'series' | 'anime'
  categories: string[]
  releaseDate: Date
  status: 'active' | 'inactive' | 'scheduled'
  scheduledDate?: Date
}

interface AdSettings {
  enabled: boolean;
  frequency: number; // in minutes
  maxDuration: number; // in seconds
  providers: string[];
  qualityLimit: string;
  audioQuality: string;
}

interface QualitySettings {
  maxResolution: string;
  bitrate: number;
  audioQuality: string;
  autoplay: boolean;
}

export default function MediaManager() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const { toast } = useToast()
  const [adSettings, setAdSettings] = useState<AdSettings>({
    enabled: true,
    frequency: 15,
    maxDuration: 30,
    providers: ['AdProvider1', 'AdProvider2'],
    qualityLimit: '720p',
    audioQuality: 'standard'
  });

  const [qualitySettings, setQualitySettings] = useState<QualitySettings>({
    maxResolution: '720p',
    bitrate: 2500,
    audioQuality: 'standard',
    autoplay: false
  });

  useEffect(() => {
    // Fetch media items from API
    const fetchMediaItems = async () => {
      // This would be an API call in a real application
      const mockItems: MediaItem[] = [
        {
          id: '1',
          title: 'Stranger Things',
          description: 'A sci-fi horror series set in the 1980s',
          type: 'series',
          categories: ['Sci-Fi', 'Horror', 'Drama'],
          releaseDate: new Date('2016-07-15'),
          status: 'active'
        },
        {
          id: '2',
          title: 'The Matrix',
          description: 'A sci-fi action film about simulated reality',
          type: 'movie',
          categories: ['Sci-Fi', 'Action'],
          releaseDate: new Date('1999-03-31'),
          status: 'active'
        },
        {
          id: '3',
          title: 'Attack on Titan',
          description: 'An anime series about humanity\'s fight against giant humanoids',
          type: 'anime',
          categories: ['Action', 'Dark Fantasy'],
          releaseDate: new Date('2013-04-07'),
          status: 'active'
        }
      ]
      setMediaItems(mockItems)
    }

    fetchMediaItems()
  }, [])

  const handleEditItem = (item: MediaItem) => {
    setSelectedItem(item)
  }

  const handleSaveItem = () => {
    if (selectedItem) {
      setMediaItems(mediaItems.map(item =>
        item.id === selectedItem.id ? selectedItem : item
      ))
      setSelectedItem(null)
      toast({
        title: "Änderungen gespeichert",
        description: `Die Änderungen für "${selectedItem.title}" wurden erfolgreich gespeichert.`
      })
    }
  }

  const handleAddCategory = () => {
    if (selectedItem && newCategory) {
      setSelectedItem({
        ...selectedItem,
        categories: [...selectedItem.categories, newCategory]
      })
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (category: string) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        categories: selectedItem.categories.filter(c => c !== category)
      })
    }
  }

  const filteredItems = mediaItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Tabs defaultValue="content" className="space-y-4">
      <TabsList className="bg-zinc-800">
        <TabsTrigger value="content">Medienliste</TabsTrigger>
        <TabsTrigger value="edit">Bearbeiten</TabsTrigger>
        <TabsTrigger value="basic-settings">Basic Plan Settings</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Medien durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-zinc-800 border-zinc-700 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-zinc-400">{item.type}</p>
                  </div>
                  <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{item.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.categories.map((category, index) => (
                    <Badge key={index} variant="outline">{category}</Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleEditItem(item)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Bearbeiten
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="edit">
        {selectedItem ? (
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Inhalt bearbeiten: {selectedItem.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={selectedItem.title}
                  onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                  className="bg-zinc-700 border-zinc-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  className="bg-zinc-700 border-zinc-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Typ</Label>
                <Select
                  value={selectedItem.type}
                  onValueChange={(value: 'movie' | 'series' | 'anime') => setSelectedItem({ ...selectedItem, type: value })}
                >
                  <SelectTrigger id="type" className="bg-zinc-700 border-zinc-600 text-white">
                    <SelectValue placeholder="Typ auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Film</SelectItem>
                    <SelectItem value="series">Serie</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedItem.status}
                  onValueChange={(value: 'active' | 'inactive' | 'scheduled') => setSelectedItem({ ...selectedItem, status: value })}
                >
                  <SelectTrigger id="status" className="bg-zinc-700 border-zinc-600 text-white">
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                    <SelectItem value="scheduled">Geplant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedItem.status === 'scheduled' && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Geplantes Datum</Label>
                  <DatePicker
                    date={selectedItem.scheduledDate}
                    setDate={(date) => setSelectedItem({ ...selectedItem, scheduledDate: date })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Kategorien</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      {category}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleRemoveCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Neue Kategorie"
                    className="bg-zinc-700 border-zinc-600 text-white"
                  />
                  <Button onClick={handleAddCategory} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Hinzufügen
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Veröffentlichungsdatum</Label>
                <DatePicker
                  date={selectedItem.releaseDate}
                  setDate={(date) => setSelectedItem({ ...selectedItem, releaseDate: date })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  Abbrechen
                </Button>
                <Button onClick={handleSaveItem}>
                  Speichern
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-zinc-400 py-8">
            Wählen Sie ein Element aus der Liste aus, um es zu bearbeiten.
          </div>
        )}
      </TabsContent>

      <TabsContent value="basic-settings">
        <Card>
          <CardHeader>
            <CardTitle>Basic Plan Settings</CardTitle>
            <CardDescription>Configure settings for free Basic plan users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Werbung Einstellungen</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label>Werbung aktiviert</Label>
                  <Switch
                    checked={adSettings.enabled}
                    onCheckedChange={(checked) =>
                      setAdSettings(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Werbefrequenz (Minuten)</Label>
                  <Input
                    type="number"
                    value={adSettings.frequency}
                    onChange={(e) =>
                      setAdSettings(prev => ({ ...prev, frequency: parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximale Werbedauer (Sekunden)</Label>
                  <Input
                    type="number"
                    value={adSettings.maxDuration}
                    onChange={(e) =>
                      setAdSettings(prev => ({ ...prev, maxDuration: parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Qualitätseinstellungen</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Maximale Auflösung</Label>
                  <Select
                    value={qualitySettings.maxResolution}
                    onValueChange={(value) =>
                      setQualitySettings(prev => ({ ...prev, maxResolution: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bitrate (kbps)</Label>
                  <Input
                    type="number"
                    value={qualitySettings.bitrate}
                    onChange={(e) =>
                      setQualitySettings(prev => ({ ...prev, bitrate: parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Audioqualität</Label>
                  <Select
                    value={qualitySettings.audioQuality}
                    onValueChange={(value) =>
                      setQualitySettings(prev => ({ ...prev, audioQuality: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niedrig</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Statistiken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Werbestatistiken</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Werbeeinnahmen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">€2,459.99</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Werbeaufrufe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12,453</div>
                      <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Durchschnittliche Ansichtsdauer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24.3s</div>
                      <p className="text-xs text-muted-foreground">-2% from last month</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Werbeperformance</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Jan', value: 400 },
                      { name: 'Feb', value: 300 },
                      { name: 'Mar', value: 550 },
                      { name: 'Apr', value: 450 },
                      { name: 'May', value: 600 },
                      { name: 'Jun', value: 750 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

