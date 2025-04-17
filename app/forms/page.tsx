import { DashboardLayout } from '@/components/dashboard/layout'
import { SalesforceForms } from '@/components/salesforce/forms-list'

export default function FormsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Salesforce Forms</h1>
        <SalesforceForms />
      </div>
    </DashboardLayout>
  )
}
