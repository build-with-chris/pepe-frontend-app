import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  defaultSize,
  minSize,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      defaultSize={defaultSize ?? 50}
      minSize={minSize ?? 5}
      {...props}
    />
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90 bg-white/40 hover:bg-white/70 transition-colors",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-white z-10 flex h-6 w-4 items-center justify-center rounded-sm shadow-md">
          <GripVerticalIcon className="size-3 text-black" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

export function AnimatedArrow() {
  // Inline-Variante: direkt rechts neben dem Button platzieren
  return (
    <span className="inline-flex items-center align-middle ml-2 pointer-events-none select-none" aria-hidden>
      <DotLottieReact
        src="https://lottie.host/1985d394-ec30-49ec-8af2-308f5d0dcbbf/9r4qtGep4f.lottie"
        loop
        autoplay
        style={{
          width: "56px",
          height: "56px",
          transform: "rotate(-270deg)",
          filter: "invert(1) brightness(15)",
        }}
      />
    </span>
  )
}
