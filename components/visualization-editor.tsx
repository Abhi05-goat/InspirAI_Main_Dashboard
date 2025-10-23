"use client"

import type React from "react"

import { useState, useRef } from "react"

interface Node {
  id: string
  label: string
  x: number
  y: number
}

interface VisualizationEditorProps {
  niche: string
  index: number
}

export default function VisualizationEditor({ niche, index }: VisualizationEditorProps) {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", label: "Core Idea", x: 50, y: 50 },
    { id: "2", label: "Target Users", x: 20, y: 80 },
    { id: "3", label: "Key Features", x: 50, y: 80 },
    { id: "4", label: "Revenue Model", x: 80, y: 80 },
  ])
  const [newNodeLabel, setNewNodeLabel] = useState("")
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    setDraggedNode(nodeId)
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        setDragOffset({
          x: e.clientX - rect.left - (node.x / 100) * rect.width,
          y: e.clientY - rect.top - (node.y / 100) * rect.height,
        })
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const newX = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100
      const newY = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100

      setNodes(
        nodes.map((node) =>
          node.id === draggedNode
            ? {
                ...node,
                x: Math.max(0, Math.min(100, newX)),
                y: Math.max(0, Math.min(100, newY)),
              }
            : node,
        ),
      )
    }
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
  }

  const addNode = () => {
    if (newNodeLabel.trim()) {
      const newNode: Node = {
        id: Date.now().toString(),
        label: newNodeLabel,
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
      }
      setNodes([...nodes, newNode])
      setNewNodeLabel("")
    }
  }

  const deleteNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id))
  }

  const updateNodeLabel = (id: string, newLabel: string) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, label: newLabel } : node)))
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Mind Map Editor (Drag to Move)</h3>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4 min-h-64 relative overflow-auto cursor-move"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg className="w-full h-64 absolute inset-0" style={{ pointerEvents: "none" }}>
            {/* TODO: Add connection lines between nodes */}
          </svg>

          <div className="relative z-10 space-y-2">
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute bg-blue-100 border-2 border-blue-400 rounded-lg px-3 py-2 text-sm text-blue-900 transition-all group ${
                  draggedNode === node.id
                    ? "shadow-lg border-blue-600 bg-blue-200"
                    : "hover:bg-blue-200 hover:shadow-md"
                } ${draggedNode === node.id ? "cursor-grabbing" : "cursor-grab"}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
              >
                <input
                  type="text"
                  value={node.label}
                  onChange={(e) => updateNodeLabel(node.id, e.target.value)}
                  className="bg-transparent text-blue-900 text-xs w-20 outline-none font-medium"
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => deleteNode(node.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-red-600 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Node Form */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addNode()}
            placeholder="Add new node..."
            className="flex-1 px-3 py-2 rounded-lg bg-white border-2 border-blue-200 text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={addNode}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all text-sm font-semibold"
          >
            Add Node
          </button>
        </div>

        {/* TODO: Add save, export, and share visualization options */}
      </div>
    </div>
  )
}
