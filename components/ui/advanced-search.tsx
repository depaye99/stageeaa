"use client"

import { useState } from "react"
import { Search, Filter, X, Calendar } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Calendar as CalendarComponent } from "./calendar"
import { useAppStore } from "@/lib/store"

interface AdvancedSearchProps {
  onSearch: (query: string, filters: any) => void
  searchPlaceholder?: string
  filterOptions?: {
    status?: string[]
    type?: string[]
    department?: string[]
  }
}

export function AdvancedSearch({
  onSearch,
  searchPlaceholder = "Rechercher...",
  filterOptions = {},
}: AdvancedSearchProps) {
  const { searchQuery, filters, setSearchQuery, setFilters } = useAppStore()
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  const handleSearch = () => {
    setFilters(localFilters)
    onSearch(searchQuery, localFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    setFilters(emptyFilters)
    setSearchQuery("")
    onSearch("", emptyFilters)
  }

  const hasActiveFilters = Object.keys(localFilters).length > 0 || searchQuery.length > 0

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-blue-50 border-blue-300" : ""}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        <Button onClick={handleSearch}>Rechercher</Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Effacer
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filterOptions.status && (
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <Select
                  value={localFilters.status || ""}
                  onValueChange={(value) => setLocalFilters({ ...localFilters, status: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {filterOptions.status.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterOptions.type && (
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select
                  value={localFilters.type || ""}
                  onValueChange={(value) => setLocalFilters({ ...localFilters, type: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {filterOptions.type.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterOptions.department && (
              <div>
                <label className="block text-sm font-medium mb-2">Département</label>
                <Select
                  value={localFilters.department || ""}
                  onValueChange={(value) => setLocalFilters({ ...localFilters, department: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les départements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    {filterOptions.department.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {localFilters.dateRange?.start || "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={localFilters.dateRange?.start ? new Date(localFilters.dateRange.start) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setLocalFilters({
                          ...localFilters,
                          dateRange: {
                            ...localFilters.dateRange,
                            start: date.toISOString().split("T")[0],
                          },
                        })
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {localFilters.dateRange?.end || "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={localFilters.dateRange?.end ? new Date(localFilters.dateRange.end) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setLocalFilters({
                          ...localFilters,
                          dateRange: {
                            ...localFilters.dateRange,
                            end: date.toISOString().split("T")[0],
                          },
                        })
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
