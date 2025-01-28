import type React from "react"
import { forwardRef, useRef } from "react"

interface NumericInputProps {
  min?: number
  max?: number
  step?: number
  defaultValue: number
  name: string
}

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ min = 0, max = 100, step = 1, defaultValue, name }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const updateValue = (newValue: number) => {
      if (inputRef.current) {
        inputRef.current.value = newValue.toString()
        // Trigger a change event to ensure form data is updated
        const event = new Event("input", { bubbles: true })
        inputRef.current.dispatchEvent(event)
      }
    }

    const handleIncrease = () => {
      if (inputRef.current) {
        const currentValue = Number(inputRef.current.value)
        const newValue = Math.min(currentValue + step, max)
        updateValue(newValue)
      }
    }

    const handleDecrease = () => {
      if (inputRef.current) {
        const currentValue = Number(inputRef.current.value)
        const newValue = Math.max(currentValue - step, min)
        updateValue(newValue)
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value)
      if (!isNaN(newValue)) {
        updateValue(Math.max(min, Math.min(newValue, max)))
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
          ref={(node) => {
            inputRef.current = node
            if (typeof ref === "function") {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          className="rounded border-2 border-zinc-200 shadow-2xl"
          type="numeric"
          defaultValue={defaultValue}
          name={name}
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

