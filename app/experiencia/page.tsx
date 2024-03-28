import { Metadata } from 'next'

import Breadcrumbs, { Breadcrumb } from '@/app/_components/main/breadcrumbs/Breadcrumbs'

import { MdLaptop } from 'react-icons/md'

export const metadata: Metadata = {
  title: 'Experiencia | Jorman Espinoza'
}

export default function ProfessionalExperiencePage() {
  const breadcrumbs: Breadcrumb[] = [{ label: 'Experiencia', icon: <MdLaptop /> }]

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <h2>Experiencia</h2>
    </>
  )
}
