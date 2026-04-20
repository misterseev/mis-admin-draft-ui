import { EMPLOYEES } from '../page'
import EmployeeDetailClient from './EmployeeDetailClient'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { code: 'EMP-2024-0142' },
    { code: 'EMP-2023-0098' },
    { code: 'EMP-2022-0055' },
    { code: 'EMP-2021-0033' },
    { code: 'EMP-2020-0019' },
    { code: 'EMP-2019-0012' },
    { code: 'EMP-2018-0008' },
    { code: 'EMP-2024-0201' },
    { code: 'EMP-2017-0005' },
    { code: 'EMP-2016-0003' },
    { code: 'EMP-2023-0134' },
    { code: 'EMP-2015-0001' },
    { code: 'EMP-2024-0188' },
    { code: 'EMP-2022-0077' },
    { code: 'EMP-2020-0044' },
    { code: 'EMP-2021-0060' },
    { code: 'EMP-2023-0115' },
    { code: 'EMP-2019-0025' },
    { code: 'EMP-2024-0222' },
    { code: 'EMP-2018-0011' },
    { code: 'EMP-2022-0089' },
    { code: 'EMP-2020-0038' },
    { code: 'EMP-2021-0052' },
    { code: 'EMP-2023-0122' },
    { code: 'EMP-2024-0251' },
  ]
}

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <EmployeeDetailClient code={code} />
}