import React from 'react'
import type { FC, PropsWithChildren } from 'react'

// App renders <Bugs> with nested routes as children, which it does not render
const Bugs: FC<PropsWithChildren> = () => {
  return (
    <div>Bugs</div>
  )
}

export default Bugs