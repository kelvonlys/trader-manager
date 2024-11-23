'use client'
import React, { useState, useEffect } from 'react'

export default function MarketData() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('http://47.130.90.161:5000/api/test')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch market data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData() // Initial fetch

    return () => {}
  }, [])

  if (isLoading) return <p>Loading market data...</p>
  if (error) return (
    <div>
      <p>Error: {error}</p>
    </div>
  )

  return (
    <div>
      {data && data.message && <p>{data.message}</p>}
    </div>
  )
}