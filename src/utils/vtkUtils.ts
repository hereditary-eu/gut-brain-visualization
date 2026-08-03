import { rgb } from "d3"
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';

/**
 * Rebuild a vtk color transfer function from a d3 interpolator, so the vtk.js
 * views use the exact same color coding as the d3 plots. The interpolator is
 * sampled at `samples` evenly spaced points over [min,max]; vtk interpolates
 * linearly between those, which is well below one 8-bit step for the smooth
 * d3 scales.
 */
function applyInterpolator(ctf : vtkColorTransferFunction,
                           interpolator : (t : number) => string,
                           [min, max] : [number, number],
                           samples : number = 64){
  ctf.removeAllPoints()
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1)
    const c = rgb(interpolator(t))
    ctf.addRGBPoint(min + t * (max - min), c.r / 255, c.g / 255, c.b / 255)
  }
  ctf.modified()
  return ctf
}

export { applyInterpolator }
