import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import SemenCatalogue, { SemenStraw } from '@/components/ai/SemenCatalogue'
import AddSemenModal, { SemenFormData } from '@/components/ai/AddSemenModal'
import RecordServiceModal, { ServiceFormData } from '@/components/ai/RecordServiceModal'
import ServiceReceiptModal from '@/components/ai/ServiceReceiptModal'
import SemenDetailsModal from '@/components/ai/SemenDetailsModal'
import axios from 'axios'

interface ServiceReceipt {
  receiptId: string
  timestamp: string
  bullName: string
  breed: string
  cowId: string
  cowName: string
  farmerId: string
  farmerName: string
  technicianId: string
  technicianName: string
  heatDate: string
  serviceDate: string
  observationIndex: number
  cost: number
  notes?: string
}

const API_BASE = 'http://localhost:5000/api'

export default function AIServices() {
  const [semenStraws, setSemenStraws] = useState<SemenStraw[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Modal states
  const [showAddSemenModal, setShowAddSemenModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Selected items
  const [selectedSemen, setSelectedSemen] = useState<SemenStraw | null>(null)
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<SemenStraw | null>(null)
  const [serviceReceipt, setServiceReceipt] = useState<ServiceReceipt | null>(null)

  // Service counter for receipt IDs
  const [serviceCounter, setServiceCounter] = useState(1)

  // Fetch semen straws on mount
  useEffect(() => {
    fetchSemenStraws()
  }, [])

  const fetchSemenStraws = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Mock data for development - replace with real API call when backend ready
      const mockSemenStraws: SemenStraw[] = [
        {
          id: '1',
          breed: 'Friesian',
          bullId: 'BULL-001',
          bullName: 'Mzuri',
          origin: 'Imported - Europe',
          quantity: 45,
          expiryDate: '2027-03-15',
          tankId: 'TANK-A1',
          temperature: -196,
          status: 'available',
          createdAt: '2024-09-15T10:30:00Z',
        },
        {
          id: '2',
          breed: 'Jersey',
          bullId: 'BULL-002',
          bullName: 'Gold',
          origin: 'Local',
          quantity: 12,
          expiryDate: '2026-12-01',
          tankId: 'TANK-A2',
          temperature: -196,
          status: 'available',
          createdAt: '2024-10-20T14:15:00Z',
        },
        {
          id: '3',
          breed: 'Simmental',
          bullId: 'BULL-003',
          bullName: 'Red King',
          origin: 'Imported - USA',
          quantity: 8,
          expiryDate: '2026-06-30',
          tankId: 'TANK-B1',
          temperature: -196,
          status: 'available',
          createdAt: '2024-08-10T09:45:00Z',
        },
        {
          id: '4',
          breed: 'Angus',
          bullId: 'BULL-004',
          bullName: 'Black Diamond',
          origin: 'Imported - Australia',
          quantity: 25,
          expiryDate: '2028-01-20',
          tankId: 'TANK-B2',
          temperature: -196,
          status: 'available',
          createdAt: '2024-11-05T11:20:00Z',
        },
        {
          id: '5',
          breed: 'Ayrshire',
          bullId: 'BULL-005',
          bullName: 'Silver Star',
          origin: 'Local',
          quantity: 3,
          expiryDate: '2026-04-15',
          tankId: 'TANK-C1',
          temperature: -196,
          status: 'available',
          createdAt: '2024-07-22T16:00:00Z',
        },
      ]

      setSemenStraws(mockSemenStraws)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load semen straws')
      console.error('Error fetching semen straws:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSemen = async (data: SemenFormData) => {
    try {
      // Real API call (uncomment when backend ready):
      // const response = await axios.post(`${API_BASE}/ai/semen`, data, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // })

      // Mock implementation
      const newSemen: SemenStraw = {
        id: Date.now().toString(),
        ...data,
        status: 'available',
        createdAt: new Date().toISOString(),
      }

      setSemenStraws([...semenStraws, newSemen])
      setSuccessMessage('Semen straw added successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add semen straw')
    }
  }

  const handleSelectSemen = (semen: SemenStraw) => {
    setSelectedSemen(semen)
    setShowServiceModal(true)
  }

  const handleViewDetails = (semen: SemenStraw) => {
    setSelectedDetailsItem(semen)
    setShowDetailsModal(true)
  }

  const handleRecordService = async (data: ServiceFormData) => {
    try {
      // Real API call (uncomment when backend ready):
      // const response = await axios.post(`${API_BASE}/ai/services`, data, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // })

      // Mock implementation
      const receiptId = `SK-AI-${String(serviceCounter).padStart(4, '0')}`
      setServiceCounter(serviceCounter + 1)

      // Update semen quantity
      setSemenStraws((prev) =>
        prev.map((s) =>
          s.id === data.semenStrawId
            ? {
                ...s,
                quantity: Math.max(0, s.quantity - 1),
                status: s.quantity - 1 <= 0 ? 'used' : 'available',
              }
            : s
        )
      )

      // Generate receipt
      const receipt: ServiceReceipt = {
        receiptId,
        timestamp: new Date().toISOString(),
        bullName: data.bullName,
        breed: data.breed,
        cowId: data.cowId,
        cowName: data.cowName,
        farmerId: data.farmerId,
        farmerName: data.farmerName,
        technicianId: data.technicianId,
        technicianName: data.technicianName,
        heatDate: data.heatDate,
        serviceDate: data.serviceDate,
        observationIndex: data.observationIndex,
        cost: data.cost,
        notes: data.notes,
      }

      setServiceReceipt(receipt)
      setShowReceiptModal(true)
      setShowServiceModal(false)
      setSelectedSemen(null)

      setSuccessMessage('AI service recorded successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to record service')
    }
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="section-title">Artificial Insemination Services</h1>
          <p className="text-sm-muted">Manage semen inventory and record AI services</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">{successMessage}</div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline text-sm">
              Dismiss
            </button>
          </div>
        )}

        {/* Semen Catalogue */}
        <SemenCatalogue
          semenStraws={semenStraws}
          onAddSemen={() => setShowAddSemenModal(true)}
          onSelectSemen={handleSelectSemen}
          onViewDetails={handleViewDetails}
          isLoading={isLoading}
        />
      </div>

      {/* Add Semen Modal */}
      <AddSemenModal
        isOpen={showAddSemenModal}
        onClose={() => setShowAddSemenModal(false)}
        onSubmit={handleAddSemen}
      />

      {/* Record Service Modal */}
      <RecordServiceModal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false)
          setSelectedSemen(null)
        }}
        onSubmit={handleRecordService}
        selectedSemen={selectedSemen}
      />

      {/* Service Receipt Modal */}
      <ServiceReceiptModal
        isOpen={showReceiptModal}
        receipt={serviceReceipt}
        onClose={() => setShowReceiptModal(false)}
        onPrint={handlePrintReceipt}
      />

      {/* Semen Details Modal */}
      <SemenDetailsModal
        isOpen={showDetailsModal}
        semen={selectedDetailsItem}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedDetailsItem(null)
        }}
      />
    </Layout>
  )
}
