import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import useApi from 'src/hooks/useApi'
import apiConnector from 'src/services/api.service'
import toast from 'react-hot-toast'
import { PlanType } from 'src/types/apps/planTypes'
import { companyModalSchema, DEFAULT_COMPANY_MODULES } from './companyModal.schema'

export const useCompanyModalForm = (
  open: boolean,
  companyData: any | null,
  onSuccess: () => void,
  onClose: () => void
) => {
  const isEdit = Boolean(companyData)
  const api = useApi('companies')
  const [plans, setPlans] = useState<PlanType[]>([])

  const form = useForm({
    resolver: yupResolver(companyModalSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      legalName: '',
      taxId: '',
      address: '',
      phone: '',
      email: '',
      planId: '' as any,
      useCustomLimits: false,
      maxUsers: 15 as number | null,
      maxDocuments: 5000 as number | null,
      maxStorageMb: 10240 as number | null,
      maxAiQueriesMonthly: 2000 as number | null,
      enabledModules: DEFAULT_COMPANY_MODULES,
      adminName: '',
      adminLastName: '',
      adminEmail: '',
      adminPassword: ''
    }
  })

  useEffect(() => {
    if (!open) return
    apiConnector
      .get<any>('/plans')
      .then(res => {
        const list: PlanType[] = Array.isArray(res) ? res : res?.data || []
        setPlans(list)

        const defaultPlan = list.find(p => p.isDefault) || list[0]
        if (companyData) {
          form.reset({
            name: companyData.name || '',
            slug: companyData.slug || '',
            legalName: companyData.legalName || '',
            taxId: companyData.taxId || companyData.cuit || '',
            address: companyData.address || '',
            phone: companyData.phone || '',
            email: companyData.email || '',
            planId: companyData.planId ?? defaultPlan?.id ?? '',
            useCustomLimits: Boolean(companyData.useCustomLimits),
            maxUsers: companyData.maxUsers !== undefined ? companyData.maxUsers : (defaultPlan?.maxUsers ?? 15),
            maxDocuments: companyData.maxDocuments !== undefined ? companyData.maxDocuments : (defaultPlan?.maxDocuments ?? null),
            maxStorageMb: companyData.maxStorageMb !== undefined ? companyData.maxStorageMb : (defaultPlan?.maxStorageMb ?? null),
            maxAiQueriesMonthly: companyData.maxAiQueriesMonthly !== undefined ? companyData.maxAiQueriesMonthly : (defaultPlan?.maxAiQueriesMonthly ?? null),
            enabledModules: companyData.enabledModules || DEFAULT_COMPANY_MODULES
          })
        } else {
          form.reset({
            name: '',
            slug: '',
            legalName: '',
            taxId: '',
            address: '',
            phone: '',
            email: '',
            planId: defaultPlan?.id ?? '',
            useCustomLimits: false,
            maxUsers: defaultPlan?.maxUsers ?? 15,
            maxDocuments: defaultPlan?.maxDocuments ?? 5000,
            maxStorageMb: defaultPlan?.maxStorageMb ?? 10240,
            maxAiQueriesMonthly: defaultPlan?.maxAiQueriesMonthly ?? 2000,
            enabledModules: defaultPlan?.includedModules || DEFAULT_COMPANY_MODULES,
            adminName: '',
            adminLastName: '',
            adminEmail: '',
            adminPassword: ''
          })
        }
      })
      .catch(() => {})
  }, [open, companyData, form])

  const handleNameChange = (val: string, onChange: (val: string) => void) => {
    onChange(val)
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      form.setValue('slug', generatedSlug)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      const limitsPayload = {
        planId: data.planId ? Number(data.planId) : null,
        useCustomLimits: Boolean(data.useCustomLimits),
        maxUsers: data.useCustomLimits ? data.maxUsers : null,
        maxDocuments: data.useCustomLimits ? data.maxDocuments : null,
        maxStorageMb: data.useCustomLimits ? data.maxStorageMb : null,
        maxAiQueriesMonthly: data.useCustomLimits ? data.maxAiQueriesMonthly : null
      }

      if (isEdit) {
        await api.patch(companyData.id, {
          name: data.name,
          legalName: data.legalName,
          taxId: data.taxId,
          address: data.address,
          phone: data.phone,
          email: data.email || undefined,
          enabledModules: data.enabledModules,
          ...limitsPayload
        })
        toast.success('Compañía actualizada correctamente')
      } else {
        await api.create({
          ...data,
          email: data.email || undefined,
          adminEmail: data.adminEmail || undefined,
          adminPassword: data.adminPassword || undefined,
          ...limitsPayload
        })
        toast.success('Compañía y Administrador creados exitosamente')
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al guardar la compañía')
    }
  }

  return {
    isEdit,
    plans,
    ...form,
    handleNameChange,
    onSubmit
  }
}
