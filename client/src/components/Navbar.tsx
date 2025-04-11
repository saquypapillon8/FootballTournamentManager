import React from 'react'
import { Link } from 'wouter'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <a className="text-xl font-bold text-gray-800">⚽ Tournoi de Football</a>
          </Link>
          <div className="flex space-x-4">
            <Link href="/teams">
              <a className="text-gray-600 hover:text-gray-800">Équipes</a>
            </Link>
            <Link href="/matches">
              <a className="text-gray-600 hover:text-gray-800">Matchs</a>
            </Link>
            <Link href="/statistics">
              <a className="text-gray-600 hover:text-gray-800">Statistiques</a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 