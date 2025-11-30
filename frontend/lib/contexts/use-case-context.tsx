"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
  fetchUseCases,
  createUseCase as createUseCaseAPI,
  updateUseCase as updateUseCaseAPI,
  approveUseCase as approveUseCaseAPI,
  type BusinessUseCase,
} from "@/lib/api-use-cases"

interface UseCaseContextType {
  useCases: BusinessUseCase[]
  isLoading: boolean
  addUseCase: (useCase: Omit<BusinessUseCase, "id" | "created_at" | "updated_at">) => Promise<void>
  updateUseCase: (id: string, updates: Partial<BusinessUseCase>) => Promise<void>
  approveUseCase: (
    id: string,
    approverEmail: string,
    role: "product_admin" | "platform_admin",
    comments?: string,
  ) => Promise<void>
  rejectUseCase: (
    id: string,
    approverEmail: string,
    role: "product_admin" | "platform_admin",
    comments?: string,
  ) => Promise<void>
  getUseCaseById: (id: string) => BusinessUseCase | undefined
  getUseCasesByBU: (buId: string) => BusinessUseCase[]
  getPendingApprovals: (buId?: string, role?: string) => BusinessUseCase[]
  refreshUseCases: () => Promise<void>
}

const UseCaseContext = createContext<UseCaseContextType | undefined>(undefined)

export function UseCaseProvider({ children }: { children: React.ReactNode }) {
  const [useCases, setUseCases] = useState<BusinessUseCase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshUseCases = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await fetchUseCases()
      setUseCases(data)
    } catch (error) {
      console.error("[v0] Error loading use cases:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUseCases()
  }, [refreshUseCases])

  const addUseCase = useCallback(async (useCase: Omit<BusinessUseCase, "id" | "created_at" | "updated_at">) => {
    try {
      const newUseCase = await createUseCaseAPI(useCase)
      setUseCases((prev) => [newUseCase, ...prev])
    } catch (error) {
      console.error("[v0] Error creating use case:", error)
      throw error
    }
  }, [])

  const updateUseCase = useCallback(async (id: string, updates: Partial<BusinessUseCase>) => {
    try {
      const updated = await updateUseCaseAPI(id, updates)
      setUseCases((prev) => prev.map((uc) => (uc.id === id ? updated : uc)))
    } catch (error) {
      console.error("[v0] Error updating use case:", error)
      throw error
    }
  }, [])

  const approveUseCase = useCallback(
    async (id: string, approverEmail: string, role: "product_admin" | "platform_admin", comments?: string) => {
      try {
        await approveUseCaseAPI(id, role, approverEmail, "approved", comments)
        await refreshUseCases()
      } catch (error) {
        console.error("[v0] Error approving use case:", error)
        throw error
      }
    },
    [refreshUseCases],
  )

  const rejectUseCase = useCallback(
    async (id: string, approverEmail: string, role: "product_admin" | "platform_admin", comments?: string) => {
      try {
        await approveUseCaseAPI(id, role, approverEmail, "rejected", comments)
        await refreshUseCases()
      } catch (error) {
        console.error("[v0] Error rejecting use case:", error)
        throw error
      }
    },
    [refreshUseCases],
  )

  const getUseCaseById = useCallback(
    (id: string) => {
      return useCases.find((uc) => uc.id === id)
    },
    [useCases],
  )

  const getUseCasesByBU = useCallback(
    (buId: string) => {
      return useCases.filter((uc) => uc.bu_id === buId)
    },
    [useCases],
  )

  const getPendingApprovals = useCallback(
    (buId?: string, role?: string) => {
      let pending = useCases.filter((uc) => {
        if (role === "product_admin") {
          return uc.status === "pending_product_admin"
        } else if (role === "platform_admin" || role === "platform_governance") {
          return uc.status === "pending_platform_admin"
        }
        return uc.status === "pending_product_admin" || uc.status === "pending_platform_admin"
      })

      if (buId) {
        pending = pending.filter((uc) => uc.bu_id === buId)
      }

      return pending
    },
    [useCases],
  )

  return (
    <UseCaseContext.Provider
      value={{
        useCases,
        isLoading,
        addUseCase,
        updateUseCase,
        approveUseCase,
        rejectUseCase,
        getUseCaseById,
        getUseCasesByBU,
        getPendingApprovals,
        refreshUseCases,
      }}
    >
      {children}
    </UseCaseContext.Provider>
  )
}

export function useUseCases() {
  const context = useContext(UseCaseContext)
  if (!context) {
    throw new Error("useUseCases must be used within UseCaseProvider")
  }
  return context
}
