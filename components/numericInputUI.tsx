import type React from "react"
import { forwardRef, useEffect, useState } from "react"
import { Input } from "./ui/input"
import { FormLabel } from "./ui/form"

interface NumericInputProps {
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (value: number) => void
}

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ min = 0, max = 100, step = 1, value, onChange }, ref) => {
    const [localValue, setLocalValue] = useState(value)

    useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleIncrease = () => {
      const newValue = Math.min(localValue + step, max)
      setLocalValue(newValue)
      onChange(newValue)
    }

    const handleDecrease = () => {
      const newValue = Math.max(localValue - step, min)
      setLocalValue(newValue)
      onChange(newValue)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseInt(event.target.value, 10)
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        setLocalValue(newValue)
        onChange(newValue)
      }
    }

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          type="button"
          className="bg-black w-8 h-8 rounded-2xl text-white hover:bg-primary/90"
          onClick={handleDecrease}
          style={{ marginRight: "10px" }}
        >
          -
        </button>
        <input
          ref={ref}
          className="rounded border-2 border-zinc-200 shadow-2xl"
          disabled
          type="numeric"
          value={localValue}
          onChange={handleChange}
          style={{
            width: "30px",
            textAlign: "center",
            appearance: "textfield",
          }}
        />
        <button
          type="button"
          className="bg-black w-8 h-8 rounded-2xl text-white hover:bg-primary/90"
          onClick={handleIncrease}
          style={{ marginLeft: "10px" }}
        >
          +
        </button>
      </div>
    )
  },
)

NumericInput.displayName = "NumericInput"

export default NumericInput

