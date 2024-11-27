import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-2xl font-bold">ページが見つかりません</h2>
      <p>申し訳ありませんが、お探しのページは存在しないようです。</p>
      <Link 
        href="/"
        className="text-primary hover:underline"
      >
        ホームに戻る
      </Link>
    </div>
  )
}

