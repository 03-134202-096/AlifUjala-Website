import Link from 'next/link'
import React from 'react'

type Props = {
  color?: string
  href?: string
  img?: string
}

export default function GameCard({ color = 'yellow', href = '#', img = '/images/placeholder-animal.png' }: Props) {
  return (
    <Link href={href} className={`card ${color}`}>
      <img src={img} alt="game" />
    </Link>
  )
}
