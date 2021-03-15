import { forwardRef } from 'react'

const Icon = forwardRef(({
  className = '',
  displayArrows = false,
  ...props
}, ref) => (
  <i {...props} className={`${className} material-icons`} ref={ref} />
))

export default Icon
