import { useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon'

export default function SelectMenu({ id, label, icon, value, onChange, options, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const listboxId = useId()

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center gap-2.5 rounded-xl bg-surface-container-low/80 px-3.5 py-2.5 transition-colors focus-within:bg-surface-container-lowest ${className}`}
    >
      <Icon name={icon} className="text-[22px] text-secondary" />

      <div className="flex w-full min-w-0 flex-col text-left">
        <span
          id={`${id}-label`}
          className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant"
        >
          {label}
        </span>
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={`${id}-label ${id}`}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-2 bg-transparent text-body-md font-semibold text-on-surface outline-none"
        >
          <span className="truncate">{selectedOption?.label}</span>
          <Icon
            name="expand_more"
            className={`shrink-0 text-[18px] text-outline transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-outline-variant/60"
        >
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <li key={option.value || 'all'} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-body-md transition ${
                    isSelected
                      ? 'bg-secondary-container/60 font-semibold text-on-secondary-container'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Icon name="check" className="shrink-0 text-[18px] text-secondary" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
