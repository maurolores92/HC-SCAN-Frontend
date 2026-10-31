import { useEffect } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { AppDispatch } from 'src/store'
import { createPlan, updatePlan } from 'src/store/apps/plans'
import { PlanType } from 'src/types/apps/planTypes'

const DEFAULT_MODULES = ['documents', 'ai_queries', 'users', 'roles', 'audit']

const planSchema = yup.object().shape({
  name: yup.string().required('El nombre del plan es obligatorio').max(100),
  slug: yup
    .string()
    .required('El slug es obligatorio')
    .matches(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: yup.string().nullable().optional(),
  priceMonthly: yup.number().typeError('Ingrese un monto válido').min(0, 'Mínimo 0').required(),
  maxUsers: yup.number().nullable().transform((v, o) => (o === '' || o === null ? null : v)).min(1, 'Mínimo 1'),
  maxDocuments: yup.number().nullable().transform((v, o) => (o === '' || o === null ? null : v)).min(1, 'Mínimo 1'),
  maxStorageMb: yup.number().nullable().transform((v, o) => (o === '' || o === null ? null : v)).min(1, 'Mínimo 1 MB'),
  maxAiQueriesMonthly: yup.number().nullable().transform((v, o) => (o === '' || o === null ? null : v)).min(0, 'Mínimo 0'),
  includedModules: yup.array().of(yup.string().required()).min(1).required(),
  badgeColor: yup.string().required(),
  isDefault: yup.boolean().required(),
  isActive: yup.boolean().required()
})

export interface PlanFormValues {
  name: string
  slug: string
  description?: string | null
  priceMonthly: number
  maxUsers: number | null
  maxDocuments: number | null
  maxStorageMb: number | null
  maxAiQueriesMonthly: number | null
  includedModules: string[]
  badgeColor: string
  isDefault: boolean
  isActive: boolean
}

export const usePlanForm = (open: boolean, editPlan: PlanType | null, onClose: () => void) => {
  const isEdit = Boolean(editPlan)
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm<PlanFormValues>({
    resolver: yupResolver(planSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      priceMonthly: 49,
      maxUsers: 10,
      maxDocuments: 1000,
      maxStorageMb: 5120,
      maxAiQueriesMonthly: 500,
      includedModules: DEFAULT_MODULES,
      badgeColor: 'primary',
      isDefault: false,
      isActive: true
    }
  })

  useEffect(() => {
    if (!open) return
    if (editPlan) {
      form.reset({
        name: editPlan.name,
        slug: editPlan.slug,
        description: editPlan.description || '',
        priceMonthly: Number(editPlan.priceMonthly || 0),
        maxUsers: editPlan.maxUsers,
        maxDocuments: editPlan.maxDocuments,
        maxStorageMb: editPlan.maxStorageMb,
        maxAiQueriesMonthly: editPlan.maxAiQueriesMonthly,
        includedModules: editPlan.includedModules || DEFAULT_MODULES,
        badgeColor: editPlan.badgeColor || 'primary',
        isDefault: Boolean(editPlan.isDefault),
        isActive: Boolean(editPlan.isActive)
      })
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        priceMonthly: 49,
        maxUsers: 10,
        maxDocuments: 1000,
        maxStorageMb: 5120,
        maxAiQueriesMonthly: 500,
        includedModules: DEFAULT_MODULES,
        badgeColor: 'primary',
        isDefault: false,
        isActive: true
      })
    }
  }, [open, editPlan, form])

  const handleNameChange = (val: string, onChange: (v: string) => void) => {
    onChange(val)
    if (!isEdit) {
      const slug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      form.setValue('slug', slug)
    }
  }

  const onSubmit = async (values: PlanFormValues) => {
    try {
      if (isEdit && editPlan) {
        await dispatch(updatePlan({ id: editPlan.id, data: values })).unwrap()
        toast.success('Plan actualizado correctamente')
      } else {
        await dispatch(createPlan(values)).unwrap()
        toast.success('Plan creado exitosamente')
      }
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar el plan')
    }
  }

  return {
    isEdit,
    ...form,
    handleNameChange,
    onSubmit
  }
}

