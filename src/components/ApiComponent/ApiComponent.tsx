// 'use client'
// import React, { useState, useEffect } from 'react'

// export default function MarketData() {
//   const [data, setData] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [color, setColor] = useState('text-black-500')
//   const [previousValue, setPreviousValue] = useState(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true)
//         const response = await fetch('http://47.130.90.161:5000/api/test')
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }
        
//         const result = await response.json()
//         setData(result)
//       } catch (err) {
//         console.error('Error fetching data:', err)
//         setError('Failed to fetch market data')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData() // Initial fetch
//     const interval = setInterval(fetchData, 100);

//     return () => {
//       clearInterval(interval);
//     }
//   }, [])

//   useEffect(() => {
//     if (data && data.message !== null && previousValue !== null) {
//       if (data.message > previousValue) {
//         setColor('text-blue-500')
//       } else if (data.message < previousValue) {
//         setColor('text-red-500')
//       }
//     }
//     setPreviousValue(data?.message || null)
//   }, [data])

//   if (data === null) return <p>Loading Data...</p>
//   if (error) return (
//     <div>
//       <p>Error: {error}</p>
//     </div>
//   )

//   const formatNum = addCommas(data.message)

//   return (
//     <div>
//       {data && data.message && (
//         <>
          
//           <p className={`${color} font-medium`}> {formatNum} </p>
//         </>
//       )}
//     </div>
//   )

//   function addCommas(number) {
//     return number.toString().replace(/\B(?=(\d{3})+\b)/g, ",");
//   }

// }
