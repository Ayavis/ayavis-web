// Shared mutable ref for scroll progress — updated by GSAP ScrollTrigger,
// read by the R3F CameraRig in its useFrame loop.
export const scrollState = {
  progress: 0,          // 0 → 1 over total page
  mouseX: 0,            // -1 → 1 normalised
  mouseY: 0,
}
