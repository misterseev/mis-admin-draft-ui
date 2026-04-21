import GRNDetail from './GRNDetail'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { ref: 'GRN-2026-0071' },
    { ref: 'GRN-2026-0070' },
    { ref: 'GRN-2026-0069' },
    { ref: 'GRN-2026-0068' },
    { ref: 'GRN-2026-0067' },
    { ref: 'GRN-2026-0066' },
    { ref: 'GRN-2026-0065' },
  ]
}

export default async function Page({
  params,
}: {
  params: Promise<{ ref: string }>
}) {
  const { ref } = await params
  return <GRNDetail refno={ref} />
}
