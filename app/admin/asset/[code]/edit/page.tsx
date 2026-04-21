import AssetEditForm from './AssetEditForm'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { code: 'AST-2024-0441' },
    { code: 'AST-2023-0388' },
    { code: 'AST-2022-0301' },
    { code: 'AST-2024-0512' },
    { code: 'AST-2021-0211' },
    { code: 'AST-2023-0352' },
    { code: 'AST-2022-0288' },
    { code: 'AST-2019-0088' },
    { code: 'AST-2024-0488' },
    { code: 'AST-2023-0401' },
  ]
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <AssetEditForm assetCode={code} />
}
