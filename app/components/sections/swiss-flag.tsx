interface SwissFlagProps {
  className?: string
}

export const SwissFlag = ({ className }: SwissFlagProps) => (
  <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#FF0000" rx="20" ry="20" />
    <rect x="13" y="6" width="6" height="20" fill="white" />
    <rect x="6" y="13" width="20" height="6" fill="white" />
  </svg>
)
