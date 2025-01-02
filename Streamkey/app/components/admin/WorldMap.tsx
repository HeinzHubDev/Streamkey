'use client'

import { useEffect, useRef, useState } from 'react'
import { geoMercator, geoPath, select, scaleLinear, zoom, zoomIdentity } from 'd3'
import { simplifiedWorldData } from '@/app/lib/simplified-world-data'

type UserLocation = {
  country: string
  count: number
}

type WorldMapProps = {
  data: UserLocation[]
}

export function WorldMap({ data }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltipContent, setTooltipContent] = useState('')
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!svgRef.current) return

    const svg = select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Clear previous content
    svg.selectAll('*').remove()

    // Create projection
    const projection = geoMercator()
      .fitSize([width, height], simplifiedWorldData as any)

    // Create path generator
    const pathGenerator = geoPath().projection(projection)

    // Create color scale
    const maxCount = Math.max(...data.map(d => d.count))
    const colorScale = scaleLinear<string>()
      .domain([0, maxCount])
      .range(['#f3f4f6', '#FF6B6B'])

    // Create a group for the map
    const g = svg.append('g')

    // Draw map
    g.selectAll('path')
      .data(simplifiedWorldData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', (d: any) => {
        const countryData = data.find(item => item.country === d.properties.name)
        return countryData ? colorScale(countryData.count) : '#e5e7eb'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)

    // Draw circles for user counts
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: UserLocation) => {
        const country = simplifiedWorldData.features.find(f => f.properties.name === d.country)
        return country ? projection(country.geometry.coordinates as [number, number])[0] : 0
      })
      .attr('cy', (d: UserLocation) => {
        const country = simplifiedWorldData.features.find(f => f.properties.name === d.country)
        return country ? projection(country.geometry.coordinates as [number, number])[1] : 0
      })
      .attr('r', (d: UserLocation) => Math.sqrt(d.count) * 0.5)
      .attr('fill', '#4ECDC4')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('opacity', 0.7)
      .on('mouseover', (event, d: UserLocation) => {
        setTooltipContent(`${d.country}: ${d.count} users`)
        setTooltipPosition({ x: event.pageX, y: event.pageY })
      })
      .on('mouseout', () => {
        setTooltipContent('')
      })

    // Add zoom behavior
    const zoomBehavior = zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoomBehavior as any)

  }, [data])

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} width="100%" height="100%" />
      {tooltipContent && (
        <div
          className="absolute bg-white dark:bg-gray-800 p-2 rounded shadow-md text-sm"
          style={{ left: tooltipPosition.x + 10, top: tooltipPosition.y - 10 }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  )
}

