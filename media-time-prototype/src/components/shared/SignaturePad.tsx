import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import clsx from 'clsx'

export interface SignaturePadHandle {
  clear: () => void
  isEmpty: () => boolean
  getDataURL: () => string
  loadDataURL: (dataUrl: string) => void
}

interface SignaturePadProps {
  className?: string
  strokeStyle?: string
  lineWidth?: number
  onDraw?: () => void
}

interface Point {
  x: number
  y: number
}

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(function SignaturePad(
  { className, strokeStyle = '#111827', lineWidth = 2.5, onDraw },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const context = canvas.getContext('2d')
    if (!context) return
    context.scale(ratio, ratio)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = strokeStyle
    context.lineWidth = lineWidth
    context.clearRect(0, 0, rect.width, rect.height)
  }, [lineWidth, strokeStyle])

  useImperativeHandle(
    ref,
    () => ({
      clear: () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext('2d')
        if (!context) return
        const rect = canvas.getBoundingClientRect()
        context.clearRect(0, 0, rect.width, rect.height)
        setHasSignature(false)
      },
      isEmpty: () => !hasSignature,
      getDataURL: () => {
        const canvas = canvasRef.current
        if (!canvas) return ''
        return canvas.toDataURL('image/png')
      },
      loadDataURL: (dataUrl: string) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext('2d')
        if (!context) return
        const image = new Image()
        image.onload = () => {
          const rect = canvas.getBoundingClientRect()
          context.clearRect(0, 0, rect.width, rect.height)
          context.drawImage(image, 0, 0, rect.width, rect.height)
          setHasSignature(true)
        }
        image.src = dataUrl
      },
    }),
    [hasSignature],
  )

  const getPoint = (event: PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.setPointerCapture(event.pointerId)
    drawingRef.current = true
    lastPointRef.current = getPoint(event)
  }

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    event.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const point = getPoint(event)
    const lastPoint = lastPointRef.current
    if (lastPoint) {
      context.beginPath()
      context.moveTo(lastPoint.x, lastPoint.y)
      context.lineTo(point.x, point.y)
      context.stroke()
      lastPointRef.current = point
      if (!hasSignature) {
        setHasSignature(true)
      }
      onDraw?.()
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    event.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.releasePointerCapture(event.pointerId)
    drawingRef.current = false
    lastPointRef.current = null
  }

  const handlePointerLeave = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    handlePointerUp(event)
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Signature field"
      className={clsx(
        'h-40 w-full touch-none rounded-2xl border border-dashed border-neutral-300 bg-white shadow-inner dark:border-neutral-600 dark:bg-neutral-800',
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    />
  )
})


