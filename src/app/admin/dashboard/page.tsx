import React from 'react'
import Link from 'next/link'
export default function page() {
  return (
    <div>
      Dahboard track nam
       <br />
       <Link href='/admin/dashboard/manage-pages'>Create new page</Link>
    </div>
  )
}
