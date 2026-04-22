import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import SemenCatalogue, { SemenStraw } from '@/components/ai/SemenCatalogue'
import AddSemenModal, { SemenFormData } from '@/components/ai/AddSemenModal'
import RecordServiceModal, { ServiceFormData } from '@/components/ai/RecordServiceModal'
import ServiceReceiptModal from '@/components/ai/ServiceReceiptModal'
import SemenDetailsModal from '@/components/ai/SemenDetailsModal'
import axios from '@/config/axios'

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

const API_BASE = 'http://localhost:8000/api'

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

      const response = await axios.get(`${API_BASE}/ai/semen`)
      setSemenStraws(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load semen straws')
      console.error('Error fetching semen straws:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSemen = async (data: SemenFormData) => {
    try {
      const response = await axios.post(`${API_BASE}/ai/semen`, data)
      setSemenStraws([...semenStraws, response.data])
      setSuccessMessage('Semen straw added successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchSemenStraws() // Refresh list
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
      const response = await axios.post(`${API_BASE}/ai/services`, data)
      
      const receipt: ServiceReceipt = {
        receiptId: response.data.receiptId,
        timestamp: response.data.timestamp,
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
      await fetchSemenStraws() // Refresh list

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
