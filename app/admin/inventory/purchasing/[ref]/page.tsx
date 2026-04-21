import PRDetail from './PRDetail'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { ref: 'PR-2026-0142' },
    { ref: 'PR-2026-0141' },
    { ref: 'PR-2026-0140' },
    { ref: 'PR-2026-0139' },
    { ref: 'PR-2026-0138' },
    { ref: 'PR-2026-0135' },
    { ref: 'PR-2026-0134' },
  ]
}

export default async function Page({
  params,
}: {
  params: Promise<{ ref: string }>
}) {
  const { ref } = await params
  return <PRDetail refno={ref} />
}
