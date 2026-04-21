import LifecycleDetail from './LifecycleDetail'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { ref: 'LCE-2026-0052' },
    { ref: 'LCE-2026-0051' },
    { ref: 'LCE-2026-0050' },
    { ref: 'LCE-2026-0049' },
    { ref: 'LCE-2026-0048' },
    { ref: 'LCE-2026-0047' },
    { ref: 'LCE-2026-0046' },
    { ref: 'LCE-2026-0045' },
  ]
}

export default async function Page({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params
  return <LifecycleDetail eventRef={ref} />
}
