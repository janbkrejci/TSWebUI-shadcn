"use client"

import * as React from "react"
import { Rnd, RndResizeCallback, RndDragCallback } from "react-rnd"
import { X, Minus, Square, Copy, Target, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Global Z-Index counter to ensure new or focused windows are always on top
let globalZIndex = 1000

export interface TsWindowProps {
    id?: string | number // ID is useful for the manager
    title?: string
    defaultWidth?: number
    defaultHeight?: number
    defaultTop?: number
    defaultLeft?: number
    minWidth?: number
    minHeight?: number
    children?: React.ReactNode
}

export interface TsWindowRef {
    minimize: () => void
    maximize: () => void
    restore: () => void
    close: () => void
    centerOnScreen: () => void
    fitToContent: (animate?: boolean) => void
    bringToFront: () => void
}

type WindowState = "normal" | "minimized" | "maximized"

interface Rect {
    width: number
    height: number
    x: number
    y: number
}

export const TsWindow = React.forwardRef<TsWindowRef, TsWindowProps>(({
    id,
    title = "Window",
    defaultWidth = 400,
    defaultHeight = 300,
    defaultTop = 100,
    defaultLeft = 100,
    minWidth = 200,
    minHeight = 100,
    children,
}, ref) => {
    const [windowState, setWindowState] = React.useState<WindowState>("normal")

    // Internal Z-Index state
    const [currentZIndex, setCurrentZIndex] = React.useState(globalZIndex++)

    // States for interaction tracking to disable CSS transitions during drag/resize
    const [isDragging, setIsDragging] = React.useState(false)
    const [isResizing, setIsResizing] = React.useState(false)

    // Aktuální pozice a velikost pro Rnd
    const [size, setSize] = React.useState({ width: defaultWidth, height: defaultHeight })
    const [position, setPosition] = React.useState({ x: defaultLeft, y: defaultTop })

    // Uložení stavu před maximalizací/minimalizací pro restore
    const [restoreRect, setRestoreRect] = React.useState<Rect | null>(null)

    // Uložení pozice minimalizovaného okna
    const [minimizedPosition, setMinimizedPosition] = React.useState<{ x: number; y: number } | null>(null)

    // Opacity state for smooth appearance
    const [isVisible, setIsVisible] = React.useState(false)

    // Reference
    const contentRef = React.useRef<HTMLDivElement>(null)
    const measureRef = React.useRef<HTMLDivElement>(null)
    const rndRef = React.useRef<Rnd>(null)
    const lastResizeHandleClick = React.useRef(0)

    // Get interaction state from manager
    const { isInteracting: globalIsInteracting, setInteracting, closeWindow } = useWindowManager()

    const getParentSize = React.useCallback(() => {
        if (typeof window === 'undefined') return { width: 1024, height: 768 } // SSR fallback

        if (rndRef.current) {
            const el = rndRef.current.getSelfElement()
            const parent = el?.parentElement
            if (parent) {
                const rect = parent.getBoundingClientRect()
                return { width: rect.width, height: rect.height }
            }
        }
        return { width: window.innerWidth, height: window.innerHeight }
    }, [])

    // ResizeObserver to handle parent container resizing
    React.useEffect(() => {
        if (!rndRef.current) return

        const el = rndRef.current.getSelfElement()
        const parent = el?.parentElement
        if (!parent) return

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (entry) {
                const { width: parentWidth, height: parentHeight } = entry.contentRect

                if (windowState === 'maximized') {
                    setSize({ width: parentWidth, height: parentHeight })
                    setPosition({ x: 0, y: 0 })
                } else if (windowState === 'normal') {
                    // Ensure window fits in new parent size
                    setSize(prev => {
                        const newW = Math.min(prev.width, parentWidth)
                        const newH = Math.min(prev.height, parentHeight)
                        return (newW !== prev.width || newH !== prev.height)
                            ? { width: newW, height: newH }
                            : prev
                    })

                    setPosition(prev => {
                        let newX = prev.x
                        let newY = prev.y
                        const headerHeight = 40

                        // Keep window visible
                        if (newX > parentWidth - 50) newX = parentWidth - 50
                        if (newY > parentHeight - headerHeight) newY = parentHeight - headerHeight

                        newX = Math.max(0, newX)
                        newY = Math.max(0, newY)

                        return (newX !== prev.x || newY !== prev.y)
                            ? { x: newX, y: newY }
                            : prev
                    })
                }
            }
        })

        observer.observe(parent)
        return () => observer.disconnect()
    }, [windowState])

    // Auto-fit on mount if requested
    React.useEffect(() => {

        // Initially invisible
        setIsVisible(false)

        requestAnimationFrame(() => {
            if (contentRef.current && measureRef.current) {
                const contentStyles = window.getComputedStyle(contentRef.current)
                const paddingTop = parseFloat(contentStyles.paddingTop) || 0
                const paddingBottom = parseFloat(contentStyles.paddingBottom) || 0
                const innerHeight = measureRef.current.offsetHeight
                const currentScrollbarHeight = contentRef.current.offsetHeight - contentRef.current.clientHeight

                const totalContentHeight = innerHeight + paddingTop + paddingBottom + currentScrollbarHeight
                const headerHeight = 40
                const borderAdjustment = 2

                setSize(prev => ({ ...prev, height: totalContentHeight + headerHeight + borderAdjustment }))
                setIsVisible(true)
            } else {
                setIsVisible(true)
            }
        })

    }, [])



    // Bring to front functionality encapsulated in the component
    const bringToFront = React.useCallback(() => {
        const newZ = ++globalZIndex
        setCurrentZIndex(newZ)
    }, [])


    const restore = () => {
        if (!restoreRect) return

        setWindowState("normal")
        setSize({ width: restoreRect.width, height: restoreRect.height })
        setPosition({ x: restoreRect.x, y: restoreRect.y })
        bringToFront()
    }

    const handleMinimize = () => {
        if (windowState === "minimized") {
            restore()
            return
        }
        if (windowState === "normal") {
            setRestoreRect({ ...size, ...position })
        }

        setWindowState("minimized")
        setSize({ width: 200, height: 40 })

        if (minimizedPosition) {
            setPosition(minimizedPosition)
        }
        bringToFront()
    }

    const handleMaximize = () => {
        if (windowState === "maximized") {
            restore()
            return
        }
        if (windowState === "normal") {
            setRestoreRect({ ...size, ...position })
        }

        const { width, height } = getParentSize()

        setWindowState("maximized")
        setSize({ width, height })
        setPosition({ x: 0, y: 0 })
        bringToFront()
    }

    const handleCenterOnScreen = React.useCallback(() => {
        if (typeof window === 'undefined') return

        let currentWidth = size.width
        let currentHeight = size.height

        if (rndRef.current) {
            const el = rndRef.current.getSelfElement()
            if (el) {
                const rect = el.getBoundingClientRect()
                currentWidth = rect.width
                currentHeight = rect.height
            }
        }

        if (windowState !== 'maximized') {
            const { width: parentW, height: parentH } = getParentSize()

            const newX = (parentW - currentWidth) / 2
            const newY = (parentH - currentHeight) / 2

            setPosition({ x: newX, y: newY })
        }
        bringToFront()
    }, [size, windowState, getParentSize, bringToFront])

    const handleFitToContent = React.useCallback(() => {
        if (contentRef.current && measureRef.current && windowState !== 'minimized' && windowState !== 'maximized') {
            const contentStyles = window.getComputedStyle(contentRef.current)
            const paddingTop = parseFloat(contentStyles.paddingTop) || 0
            const paddingBottom = parseFloat(contentStyles.paddingBottom) || 0

            const innerHeight = measureRef.current.offsetHeight

            // Check for horizontal scrollbar to ensure we don't cut off content due to scrollbar taking space
            const currentScrollbarHeight = contentRef.current.offsetHeight - contentRef.current.clientHeight

            const totalContentHeight = innerHeight + paddingTop + paddingBottom + currentScrollbarHeight

            const headerHeight = 40
            const borderAdjustment = 2 // top + bottom borders

            setSize(prev => ({ ...prev, height: totalContentHeight + headerHeight + borderAdjustment }))
        }
    }, [windowState])

    // Expose API via ref
    React.useImperativeHandle(ref, () => ({
        minimize: handleMinimize,
        maximize: handleMaximize,
        restore: restore,
        close: () => { if (id) closeWindow(id.toString()) },
        centerOnScreen: handleCenterOnScreen,
        fitToContent: handleFitToContent,
        bringToFront: bringToFront
    }))

    const setGlobalUserSelect = (val: string) => {
        document.body.style.userSelect = val
        document.documentElement.style.userSelect = val
    }

    const handleDragStart: RndDragCallback = (e, d) => {
        setIsDragging(true)
        setInteracting(true)
        setGlobalUserSelect('none')
        bringToFront()
    }

    // NOTE: We do NOT use onDrag to update state. This prevents the "jumping" behavior
    // caused by fighting between React state updates and Rnd's internal DOM updates.
    // Instead, we clamp the final position in onDragStop.

    const handleDragStop: RndDragCallback = (e, d) => {
        setIsDragging(false)
        setInteracting(false)
        setGlobalUserSelect('')

        const { width: parentWidth, height: parentHeight } = getParentSize()

        let newX = d.x
        let newY = d.y

        const headerHeight = 40

        // Strict containment: Header must not leave the container even partially.
        // Y axis: Top >= 0, Bottom of header <= parentHeight
        newY = Math.max(0, newY)
        newY = Math.min(newY, parentHeight - headerHeight)

        // X axis: Left >= 0, Right <= parentWidth
        newX = Math.max(0, newX)
        newX = Math.min(newX, parentWidth - size.width)

        const finalPos = { x: newX, y: newY }
        setPosition(finalPos)

        if (windowState === "minimized") {
            setMinimizedPosition(finalPos)
        }
    }

    const handleResizeStart = (e: any) => {
        if (e && e.preventDefault) e.preventDefault()
        setIsResizing(true)
        setInteracting(true)
        setGlobalUserSelect('none')
        bringToFront()
    }

    const handleResizeStop: RndResizeCallback = (e, direction, ref, delta, position) => {
        setIsResizing(false)
        setInteracting(false)
        setGlobalUserSelect('')

        let newWidth = Number.parseInt(ref.style.width)
        let newHeight = Number.parseInt(ref.style.height)
        let newX = position.x
        let newY = position.y

        const { width: parentWidth, height: parentHeight } = getParentSize()
        const headerHeight = 40

        // Y-Axis Clamping
        if (newY < 0) {
            // If Top edge went out
            if (direction.toLowerCase().includes('top')) {
                newHeight = Math.max(minHeight, newHeight + newY) // Shrink height (newY is negative)
            }
            newY = 0
        }

        // Check Bottom edge
        if (newY + newHeight > parentHeight) {
            if (direction.toLowerCase().includes('bottom')) {
                newHeight = Math.max(minHeight, parentHeight - newY)
            }
        }

        // X-Axis Clamping
        if (newX < 0) {
            // If Left edge went out
            if (direction.toLowerCase().includes('left')) {
                newWidth = Math.max(minWidth, newWidth + newX) // Shrink width
            }
            newX = 0
        }

        // Check Right edge
        if (newX + newWidth > parentWidth) {
            if (direction.toLowerCase().includes('right')) {
                newWidth = Math.max(minWidth, parentWidth - newX)
            }
        }

        // Final safety check for minimal visibility if not resizing relevant edges
        // (e.g. if we somehow got pushed out otherwise)
        newY = Math.min(newY, parentHeight - headerHeight)
        newX = Math.min(newX, parentWidth - 30)

        setSize({ width: newWidth, height: newHeight })
        setPosition({ x: newX, y: newY })
    }

    const handleHeaderDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent bubbling
        if (windowState === "minimized") {
            restore()
            return
        }
        if (windowState === "maximized") restore()
        else handleMaximize()
    }

    const renderHandle = (dir: string) => (
        <div
            className="w-full h-full"
        />
    )

    return (
        <Rnd
            ref={rndRef}
            size={size}
            position={position}
            onDragStart={handleDragStart}
            // onDrag={handleDrag} // Removed to fix jitter
            onDragStop={handleDragStop}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            onMouseDown={bringToFront}
            minWidth={windowState === "minimized" ? 200 : minWidth}
            minHeight={windowState === "minimized" ? 40 : minHeight}
            disableDragging={windowState === "maximized"}
            enableResizing={windowState === "normal"}
            resizeHandleComponent={{
                top: renderHandle('top'),
                right: renderHandle('right'),
                bottom: renderHandle('bottom'),
                left: renderHandle('left'),
                topRight: renderHandle('topRight'),
                bottomRight: renderHandle('bottomRight'),
                bottomLeft: renderHandle('bottomLeft'),
                topLeft: renderHandle('topLeft'),
            }}
            dragHandleClassName="window-drag-handle"
            style={{ zIndex: currentZIndex, opacity: isVisible ? 1 : 0 }}
            className={cn(
                "flex flex-col overflow-hidden bg-background pointer-events-auto",
                windowState === "maximized"
                    ? "rounded-none border-none"
                    : "rounded-lg border shadow-xl dark:border-neutral-700"
            )}
        >
            {/* Header / Titlebar */}
            <div
                className={cn(
                    "window-drag-handle flex h-10 shrink-0 items-center justify-between border-b bg-muted px-3 select-none",
                    windowState === "maximized" ? "cursor-default" : "cursor-move"
                )}
                onDoubleClick={handleHeaderDoubleClick}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex gap-1.5 mr-2">
                        <div
                            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer flex items-center justify-center group"
                            onClick={(e) => { e.stopPropagation(); if (id) closeWindow(id.toString()) }}
                        >
                            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div
                            className={cn(
                                "w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer flex items-center justify-center group",
                                windowState === "maximized" && "bg-gray-400 pointer-events-none opacity-50"
                            )}
                            onClick={(e) => { e.stopPropagation(); handleMinimize() }}
                        >
                            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div
                            className={cn("w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer flex items-center justify-center group", windowState === "minimized" && "bg-gray-400 pointer-events-none")}
                            onClick={(e) => { e.stopPropagation(); handleMaximize() }}
                        >
                            {windowState === "maximized" ? (
                                <Copy className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 rotate-180" />
                            ) : (
                                <Square className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 fill-current" />
                            )}
                        </div>
                    </div>

                    <span className="text-sm font-medium truncate opacity-90">
                        {title}
                    </span>
                </div>

                <div className="flex items-center gap-1 ml-2">
                    {windowState === "normal" && (
                        <>
                            <div title="Center on Screen" className="flex items-center justify-center">
                                <Target
                                    className="w-3.5 h-3.5 cursor-pointer opacity-50 hover:opacity-100 text-foreground"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCenterOnScreen()
                                    }}
                                />
                            </div>
                            <div title="Fit to Content" className="flex items-center justify-center">
                                <ChevronsUpDown
                                    className="w-3.5 h-3.5 cursor-pointer opacity-50 hover:opacity-100 text-foreground"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFitToContent();
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div
                ref={contentRef}
                className={cn(
                    "overflow-auto bg-background min-h-0",
                    // If ANY window is interacting, disable selection on ALL windows via context state
                    // If NO interaction, allow selection and auto cursor
                    globalIsInteracting ? "select-none" : "select-text cursor-auto",
                    windowState === "minimized" && "hidden"
                )}
                style={{ height: "calc(100% - 2.5rem)" }}
            >
                <div ref={measureRef} className="h-fit w-full p-4 pb-6">
                    {children}
                </div>
            </div>
        </Rnd>
    )
})
TsWindow.displayName = "TsWindow"


// --- Window Manager System ---

interface WindowItem {
    id: string
    content: React.ReactNode
    props: Partial<TsWindowProps>
    ref: React.RefObject<TsWindowRef | null>
}

interface WindowContextType {
    openWindow: (content: React.ReactNode, options?: Partial<TsWindowProps> & { id?: string }) => void
    closeWindow: (id: string) => void
    getWindow: (id: string) => TsWindowRef | null
    windows: WindowItem[]
    isInteracting: boolean
    setInteracting: (interacting: boolean) => void
}

const WindowContext = React.createContext<WindowContextType | undefined>(undefined)

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [windows, setWindows] = React.useState<WindowItem[]>([])
    const [isInteracting, setInteracting] = React.useState(false)

    const openWindow = React.useCallback((content: React.ReactNode, options: Partial<TsWindowProps> & { id?: string } = {}) => {
        const id = options.id || Math.random().toString(36).substring(7)

        // Default options
        const finalOptions = {
            autoFit: true, // Auto-fit by default
            ...options
        }

        setWindows(prev => {
            const exists = prev.find(w => w.id === id)
            if (exists) {
                // If it exists, we might want to bring it to front or update props
                // For now, let's just bring it to front using its ref if available
                exists.ref.current?.bringToFront()
                return prev
            }

            return [...prev, {
                id,
                content,
                props: finalOptions,
                ref: React.createRef<TsWindowRef>()
            }]
        })
    }, [])

    const closeWindow = React.useCallback((id: string) => {
        setWindows(prev => prev.filter(w => w.id !== id))
    }, [])

    const getWindow = React.useCallback((id: string) => {
        const win = windows.find(w => w.id === id)
        return win?.ref.current || null
    }, [windows])

    return (
        <WindowContext.Provider value={{ openWindow, closeWindow, getWindow, windows, isInteracting, setInteracting }}>
            {children}
        </WindowContext.Provider>
    )
}

export const WindowOutlet: React.FC<{ className?: string }> = ({ className }) => {
    const { windows } = useWindowManager()

    return (
        <div className={cn("absolute inset-0 pointer-events-none z-50", className)}>
            {windows.map(w => (
                <TsWindow
                    key={w.id}
                    ref={w.ref as React.RefObject<TsWindowRef>}
                    id={w.id}
                    title={w.props.title || "Window"}
                    {...w.props}
                >
                    {w.content}
                </TsWindow>
            ))}
        </div>
    )
}

export const useWindowManager = () => {
    const context = React.useContext(WindowContext)
    if (!context) {
        throw new Error("useWindowManager must be used within a WindowProvider")
    }
    return context
}
